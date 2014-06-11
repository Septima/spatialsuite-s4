<%@ page language="java" contentType="text/html; charset=UTF-8"
 pageEncoding="UTF-8"
 import="dk.septima.spatialsuite.search.IndexBuilder"
 import="com.carlbro.cbinfo.global.GlobalRessources"
 %>
 <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
 <html>
 <%
 	try{
 	 	String configDir = GlobalRessources.getInstance().getCBInfoParam().getLocalStringValue("s4.config.dir");
 	 	if (configDir == null || configDir.equalsIgnoreCase("")){
 	 		throw new Exception ("The cbInfo parameter s4.config.dir is not defined. Please see https://github.com/Septima/spatialsuite-s4#readme");
 	 	}else{
 	 		IndexBuilder ib = new IndexBuilder();
 	 		ib.build();
 		 	out.println ("<h2>SUCCESS: Index has been built</h2>");
 	 	}
 	}catch (Exception e){
	 	out.println ("<h2>ERROR: There was an error building the index:</h2>");
	 	out.println ("<h3>" + e.getMessage() + "</h3>");
	 	out.println ("<pre>");
		e.printStackTrace(new java.io.PrintWriter(out));
	 	out.println ("</pre>");
 	}
 %>
 </html>
