<%@ page language="java" contentType="charset=UTF-8"
 pageEncoding="UTF-8"
 import="dk.septima.spatialsuite.search.IndexQuerier"
 import="dk.septima.spatialsuite.search.QueryResults"
 import="com.carlbro.cbinfo.global.GlobalRessources"
 import="java.util.Properties"
 import="java.util.Enumeration"
 import="java.util.Map"
 %>
 
 <%
 	//queryIndex.jsp?wkt=xxxxxxx&query=gyri joh gur kim&limit=10&datasources=ds_skoler ds_daginstitutioner

 	//Params
 	String limit = null;
 	String datasources = null;
 	String query = null;
 	String wkt = null;
 
 	int limitToUse = 10;
	String datasourcesToUse = "*";
 	String queryToUse = "";
 	//if (request.getMethod().toLowerCase().equals("get")){
 		
 	 	limit = request.getParameter("limit");
 	 	if (limit != null){
 	 		limitToUse = Integer.parseInt(limit);
 	 	}
 	 	
 	 	datasources = request.getParameter("datasources");
 	 	if (datasources != null && !datasources.trim().equals("")){
 	 		datasourcesToUse = datasources;
 	 	}
 	 	
 		query = request.getParameter("query");
 	 	wkt = request.getParameter("wkt");
//  	}else{
//  		try{
//  	 		Properties requestParameters = getPostParams(request);

//  	 	 	limit = requestParameters.getProperty("limit");
//  	 	 	if (limit != null){
//  	 	 		limitToUse = Integer.parseInt(limit);
//  	 	 	}
 	 	 	
//  	 	 	datasources = requestParameters.getProperty("datasources");
//  	 	 	if (datasources != null && !datasources.trim().equals("")){
//  	 	 		datasourcesToUse = datasources;
//  	 	 	}
 	 	 	
//  	 	 	query = requestParameters.getProperty("query");
//  	 	 	wkt = requestParameters.getProperty("wkt");
//  	 		out.println ("wkt:" + wkt);
//  		}catch (Exception e){
// 			String a = "Klavs"; 			
//  		}
//  	}
 	
	IndexQuerier iq = new IndexQuerier();
	QueryResults qr = null;
	
 	//If wkt is set perform a spatial query. Else perform text query. In a later version the two will be combined.
	if (wkt != null){
	 	qr = iq.spatialQuery(wkt, limitToUse, datasourcesToUse); 
	}else{
	 	if (query != null){
	 		String utf8behaviour = GlobalRessources.getInstance().getCBInfoParam().getLocalStringValue("module.s4.index.utf8behaviour");
	 		if (utf8behaviour != null && utf8behaviour.equalsIgnoreCase("noconvert")){
	 	 		queryToUse = query;
	 		}else{
	 	 		queryToUse = utf8Convert(query);
	 		}
	 	}
	 	String limitType = request.getParameter("limitType");
	 	if (limitType == null){
	 		limitType = "collapse";
	 	}
	 	qr = iq.query(queryToUse, limitToUse, datasourcesToUse, limitType); 
	}

 	String callback = request.getParameter("callback");
 	if (callback != null){
 	 	response.setContentType("application/javascript; charset=UTF-8");
 		out.println (callback + "(" + qr.toJson() + ")");
 	}else{
 	 	response.setContentType("application/json; charset=UTF-8");
 		out.println (qr.toJson());
 	}
 %>
 
<%!
String utf8Convert(String utf8String) throws java.io.UnsupportedEncodingException {
	byte[] bytes = new byte[utf8String.length()];
	for (int i = 0; i < utf8String.length(); i++) {
	bytes[i] = (byte) utf8String.charAt(i);
	}
	return new String(bytes, "UTF-8");
}

// Properties getRequestParameters(HttpServletRequest request) throws Exception{
//     Enumeration parameters = request.getParameterNames();
//     Properties requestParameters = new Properties();
//     while (parameters.hasMoreElements()){
//         String parameter = (String) parameters.nextElement();
//         if (parameter == null){
//         }else{
//         	requestParameters.setProperty(parameter, request.getParameter(parameter));
//     	  }
//     }
//     return (requestParameters);
// }

Properties getPostParams(HttpServletRequest request){
	Map<String, String[]> parameters = request.getParameterMap();
    Properties requestParameters = new Properties();
	for(String parameter : parameters.keySet()) {
    	requestParameters.setProperty(parameter, parameters.get(parameter)[0]);
	}
    return (requestParameters);
}

%>
 