<%@ page language="java" contentType="text/html; charset=UTF-8"
 pageEncoding="UTF-8"
 import="dk.septima.spatialsuite.search.IndexBuilder"
 import="com.carlbro.cbinfo.global.GlobalRessources"
 import="java.util.concurrent.TimeUnit"
 %>
 <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
 <html>
 <%
 	try{
 	 	String configDir = GlobalRessources.getInstance().getCBInfoParam().getLocalStringValue("s4.config.dir");
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
	
	<!-- Include common javascript libraries -->
	<script type="text/javascript" src="http://common.cdn.septima.dk/latest/js/septima.js"></script>
	<script type="text/javascript" src="http://common.cdn.septima.dk/latest/js/json2.js"></script>
	
	<!-- Include septimaSearch -->
	<script type="text/javascript" src="http://search.cdn.septima.dk/2.9.9/septimasearch.min.js"></script>
	<link rel="stylesheet" type="text/css" href="http://search.cdn.septima.dk/2.9.9/css/defaultView.css">
	
	<style type="text/css">
		#inputcontainer {
		    width: 400px;
/* 		    position: absolute; */
/* 		    top: 35px; */
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

			_view = new Septima.Search.DefaultView({input:jQuery("#inputcontainer"), placeholder:"Test index"});

			var controllerOptions = {onError: error, blankBehavior: "search"};
			_controller = new Septima.Search.Controller([], _view, controllerOptions);

			var s4IndexSearcherOptions = {datasources: "*", onSelect: s4IndexHit, matchesPhrase: "match", blankBehavior: "search", "allowDetails": true};
			var indexSearcher = new Septima.Search.S4IndexSearcher(s4IndexSearcherOptions);
			_controller.addSearcher({"title": "", "searcher" : indexSearcher});

			_controller.go ();
		}
		
		function s4IndexHit(result){
			log(result.target + ": " + result.title + ". Geometry: " + JSON.stringify(result.geometry));
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
	 	out.println ("<pre>");
		e.printStackTrace(new java.io.PrintWriter(out));
	 	out.println ("</pre>");
 	}
 %>
 </html>
