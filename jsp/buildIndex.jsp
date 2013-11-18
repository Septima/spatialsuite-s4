<%@ page language="java" contentType="text/html; charset=UTF-8"
 pageEncoding="UTF-8"
 import="dk.septima.spatialsuite.search.IndexBuilder"
 %>
 
 <%
	 IndexBuilder ib = new IndexBuilder();
	 ib.build();
	 out.println ("Index has been built");
 %>