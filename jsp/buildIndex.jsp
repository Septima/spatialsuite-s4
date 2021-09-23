<%@ page language="java"
 import="dk.septima.spatialsuite.search.IndexBuilder"
 import="com.carlbro.cbinfo.global.GlobalRessources"
 import="java.util.concurrent.TimeUnit"
 %>
 <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
 <html>
 <%
 	try{
 	 	String configDir = GlobalRessources.getInstance().getCBInfoParam().getLocalStringValue("s4.config.dir");
        String searchCss = GlobalRessources.getInstance().getCBInfoParam().getLocalStringValue("s4.search.version") + "/css/defaultView.css";
        String searchScript = GlobalRessources.getInstance().getCBInfoParam().getLocalStringValue("s4.search.version") + "/septimasearch.min.js";
 	 	if (configDir == null || configDir.equalsIgnoreCase("")){
 	 		throw new Exception ("The cbInfo parameter s4.config.dir is not defined. Please see https://github.com/Septima/spatialsuite-s4#readme");
 	 	}else{
 	 		long startTime = System.currentTimeMillis();
 	 		IndexBuilder ib = new IndexBuilder();
 	 		ib.build();

 	 		long endTime = System.currentTimeMillis();
 	 		
 	 		long millis = (endTime - startTime);
 	 		String strTime = String.format("%d min, %d sec", 
 	 			    TimeUnit.MILLISECONDS.toMinutes(millis),
 	 			    TimeUnit.MILLISECONDS.toSeconds(millis) - 
 	 			    TimeUnit.MINUTES.toSeconds(TimeUnit.MILLISECONDS.toMinutes(millis))
 	 			);

 %>
 
 <head>
 	<title>S4 Indexbuilder - SUCCESS: Index has been built</title>
 
	 <!-- Include jquery -->
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
	
    <link rel="stylesheet" type="text/css" href="<%=searchCss%>">
    <script type="text/javascript" src="<%=searchScript%>" charset="UTF-8"></script>
    
	<style type="text/css">
		#inputcontainer {
		    width: 400px;
		}
		#log {
		    position: absolute;
		    top: 35px;
		    left: 460px;
		}
	</style>

	<script type="text/javascript">
		jQuery(document).ready(function() {
			showSearcher();
		});
		
		function showSearcher(){
			var $demoDiv = jQuery('#searchDiv');
			$demoDiv.append('<div id="inputcontainer"/><div id="log"/>');

			var controllerOptions = {onError: error, blankBehavior: "search"};
			_controller = new Septima.Search.Controller([], controllerOptions);

			var s4IndexSearcherOptions = {
			        datasources: "*",
			        onSelect: s4IndexHit,
			        matchesPhrase: "match",
			        blankBehavior: "search",
			        "allowDetails": true};
			
			var indexSearcher = new Septima.Search.S4IndexSearcher(s4IndexSearcherOptions);
			_controller.addSearcher({"title": "", "searcher" : indexSearcher});
			
            _view = new Septima.Search.DefaultView({
                input:jQuery("#inputcontainer")[0],
                placeholder:"Test index",
                controller: _controller});
		}
		
		function s4IndexHit(result){
			log(result.type + ": " + result.title + ". Geometry: " + JSON.stringify(result.geometry));
		}

		function log(message){
			jQuery("#log").prepend(message + "<br/><hr/>");
		}
		
		function error(searcher, errorThrown){
			log("Error: " + searcher.getId() + ": " + errorThrown);
		}
	</script>
 </head>
<body>
	<h2>SUCCESS: Index has been built</h2>
	<h3>Took: <%=strTime %></h3>
  	<div id="searchDiv"></div>
</body> 
 
 <%
 	 	}
 	}catch (Exception e){
	 	out.println ("<h3>ERROR: There was an error building the index:</h3>");
	 	out.println ("<h2>" + e.getMessage() + "</h2>");
        out.println ("<a href='./testConfig.jsp'>Test configuration</a>");
	 	out.println ("<pre>");
		e.printStackTrace(new java.io.PrintWriter(out));
	 	out.println ("</pre>");
 	}
 %>
 </html>
