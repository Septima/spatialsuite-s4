<%@ page language="java" contentType="text/html; charset=UTF-8"
 pageEncoding="UTF-8"
 import="dk.septima.search.address.Indexer"
 import="com.carlbro.cbinfo.global.GlobalRessources"
 %>
 <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
 <html>
 <%
 	try{
 	 	String configDir = GlobalRessources.getInstance().getCBInfoParam().getLocalStringValue("adrsearch.config.dir");
 	 	if (configDir == null || configDir.equalsIgnoreCase("")){
 	 		throw new Exception ("The cbInfo parameter adrSearch.config.dir is not defined. Please see the modules readme file");
 	 	}else{
 	 		Indexer i = new Indexer();
 	 		i.build();
 		 	out.println ("<h2>SUCCESS: Address index has been built</h2>");
 	 	}
 	}catch (Exception e){
	 	out.println ("<h2>ERROR: There was an error building the address index:</h2>");
	 	out.println ("<h3>" + e.getMessage() + "</h3>");
	 	out.println ("<pre>");
		e.printStackTrace(new java.io.PrintWriter(out));
	 	out.println ("</pre>");
 	}
 %>
 </html>
