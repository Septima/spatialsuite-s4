<%@ page language="java"
 import="dk.septima.spatialsuite.search.IndexQuerier"
 import="dk.septima.spatialsuite.search.QueryResults"
 import="com.carlbro.cbinfo.global.GlobalRessources"
 %>
 
 <%
 	//getDatasources.jsp?filter=ds_skoler ds_daginstitutioner
    String epsgCode = GlobalRessources.getInstance().getCBInfoParam().getLocalStringValue("cbinfo.map.srs");
 	String filter = request.getParameter("filter");
 	String filterToUse = "*";
 	if (filter != null){
 		filterToUse = filter;
 	}
	IndexQuerier iq = new IndexQuerier();
 	QueryResults qr = iq.getIndexedDatasources(filterToUse);
 	String callback = request.getParameter("callback");
 	String json = qr.toJson();
    json = json.substring(1);
    String json1 = "{\"crs\": \"" + epsgCode + "\", " + json;
 	if (callback != null){
 	 	response.setContentType("application/javascript; charset=UTF-8");
 		out.println (callback + "(" + json1 + ")");
 	}else{
 	 	response.setContentType("application/json; charset=UTF-8");
 		out.println (json1);
 	}
 %>