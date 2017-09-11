<%@ page language="java"
 import="dk.septima.spatialsuite.search.Configuration"
 import="com.carlbro.cbinfo.global.GlobalRessources"
 import="org.w3c.dom.Document"
 import="com.carlbro.jdaf.xml.DocumentCache"
 import="java.io.File"
 %>
 <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
 <html>
 <%
  String configDir = GlobalRessources.getInstance().getCBInfoParam().getLocalStringValue("s4.config.dir");
  out.println ("s4.config.dir: " + configDir);
  out.println ("<br>");
  DocumentCache docCache = GlobalRessources.getInstance ().getDocumentCache ();
  String configFileName = configDir + "/config.xml";
  out.println ("configFileName: " + configFileName);
  out.println ("<br>");
  File f = new File(configFileName);
  if(f.exists() && !f.isDirectory()) { 
	  try{
	       Document configDoc = docCache.getDocument(configFileName);
	       if (configDoc == null){
	        out.println ("Couldn't load " + configFileName);
	        out.println ("<br>");
	       }else{
	            out.println ("Load " + configFileName);
	            out.println ("<br>");
	       }
	  }catch (Exception e){
	      out.println ("Couldn't load " + configFileName);
	      out.println ("<br>");
	      out.println ("Message: " + e.getMessage());
	      out.println ("<br>");
	  }
  }else{
      out.println ("Couldn't find " + configFileName);
      out.println ("<br>");
  }
  
 %>
 </body> 
 