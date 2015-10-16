<%@ page language="java" contentType="charset=UTF-8"
 pageEncoding="UTF-8"
 import="dk.septima.spatialsuite.search.IndexQuerier"
 import="dk.septima.spatialsuite.search.QueryResults"
 import="com.carlbro.cbinfo.global.GlobalRessources"
 %>
 
 <%
 	//queryIndex.jsp?wkt=xxxxxxx&query=gyri joh gur kim&limit=10&datasources=ds_skoler ds_daginstitutioner

 	String limit = request.getParameter("limit");
 	int limitToUse = 10;
 	if (limit != null){
 		limitToUse = Integer.parseInt(limit);
 	}

 	String datasources = request.getParameter("datasources");
 	String datasourcesToUse = "*";
 	if (datasources != null && !datasources.trim().equals("")){
 		datasourcesToUse = datasources;
 	}
 	
	IndexQuerier iq = new IndexQuerier();
	QueryResults qr = null;
	
 	String wkt = request.getParameter("wkt");
 	//If wkt is set perform a spatial query. Else perform text query. In a later version the two will be combined.
	if (wkt != null){
	 	qr = iq.spatialQuery(wkt, limitToUse, datasourcesToUse); 
	}else{
		String query = request.getParameter("query");
	 	String queryToUse = "";
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
%>
 