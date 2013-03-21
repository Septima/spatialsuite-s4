<%@ page language="java" contentType="charset=UTF-8"
 pageEncoding="UTF-8"
 import="dk.septima.spatialsuite.search.IndexQuerier"
 import="dk.septima.spatialsuite.search.QueryResults"
 %>
 
 <%
 	//queryIndex.jsp?query=gyri joh gur kim&limit=10&datasources=ds_skoler ds_daginstitutioner
 	String query = request.getParameter("query");
 	String queryToUse = "";
 	if (query != null){
 		queryToUse = utf8Convert(query);
 	}
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
 	QueryResults qr = iq.query(queryToUse, limitToUse, datasourcesToUse); 
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
 