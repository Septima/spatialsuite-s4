<%@ page language="java"
 import="dk.septima.spatialsuite.search.IndexQuerier"
 import="dk.septima.spatialsuite.search.IndexedFeature"
 import="com.carlbro.cbinfo.global.GlobalRessources"
 %>
 
 <%
    //getFeature.jsp?id=Signaturskolen - Skads&datasource=ds_esbjerg-skoler

    //Params
    String datasource = utf8Convert(request.getParameter("datasource"));
    String id = utf8Convert(request.getParameter("id"));
    
    IndexQuerier iq =  new IndexQuerier();
    IndexedFeature f = iq.get(id, datasource);
    String responseJson = "{}";
    if ( f != null){
    	responseJson = f.getJson();
    }

    String callback = request.getParameter("callback");
    if (callback != null){
        response.setContentType("application/javascript; charset=UTF-8");
        out.println (callback + "(" + responseJson + ")");
    }else{
        response.setContentType("application/json; charset=UTF-8");
        out.println (responseJson);
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
 