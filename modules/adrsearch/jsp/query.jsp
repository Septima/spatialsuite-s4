<%@ page language="java" contentType="charset=UTF-8"
 pageEncoding="UTF-8"
 import="dk.septima.search.address.Querier"
 import="com.carlbro.cbinfo.global.GlobalRessources"
 %>
 
 <%
 	//query.jsp?query=ad 2 234 75&limit=10&callback=fuc
 	String query = request.getParameter("query");
 
 	query = new String(query.getBytes("ISO8859_1"), "UTF-8");

 	String limit = request.getParameter("limit");
 	int limitToUse = 10;
 	if (limit != null){
 		limitToUse = Integer.parseInt(limit);
 	}
 	String jsonResult = Querier.query(query, limitToUse); 
 	String callback = request.getParameter("callback");
 	if (callback != null){
 	 	response.setContentType("application/javascript; charset=UTF-8");
 		out.println (callback + "(" + jsonResult + ")");
 	}else{
 	 	response.setContentType("application/json; charset=UTF-8");
 		out.println (jsonResult);
 	}
 %>
 