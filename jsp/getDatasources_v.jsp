<%@ page language="java"
 import="dk.septima.spatialsuite.search.IndexQuerier"
 import="dk.septima.spatialsuite.search.QueryResults"
 %>
 
 <%
 	//getDatasources.jsp?filter=ds_skoler ds_daginstitutioner
 	String filter = request.getParameter("filter");
 	String filterToUse = "*";
 	if (filter != null){
 		filterToUse = filter;
 	}
	IndexQuerier iq = dk.septima.spatialsuite.search.v103.Api.getIndexQuerier();
 	QueryResults qr = iq.getIndexedDatasources(filterToUse);
 	String callback = request.getParameter("callback");
 	if (callback != null){
 	 	response.setContentType("application/javascript; charset=UTF-8");
 		out.println (callback + "(" + qr.toJson() + ")");
 	}else{
 	 	response.setContentType("application/json; charset=UTF-8");
 		out.println (qr.toJson());
 	}
 %>