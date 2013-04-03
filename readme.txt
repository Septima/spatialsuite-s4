INSTALLATION

NOTE: Never change content of s4 module. Instead, create a custom module with changes only. See later in this document
	__________________
	Copy the module to:
	
	    appbase/spatialmap/WEB-INF/config/modules/custom/s4
	__________________
	Update MODULES.XML
	
	    <module name="s4" dir="custom/s4" permissionlevel="public"/>

	    Comment out other modules conflicting with this module e.g.:
	        <!--     <module name="afstand" dir="standard/dk/afstand" permissionlevel="public"/> -->
	        <!--     <module name="spatialaddress" dir="standard/dk/spatialaddress" permissionlevel="public"/>    -->
	__________________________
	Include tool in profile(s)
	
	    <tool module="s4" name="s4-plugin" />

	    Comment out other tools conflicting with this tool e.g.:
	        <!--     <tool module="spatialaddress" name="spatialaddress-plugin" /> -->

	    Customization: Please see the Customization Guide below on how to customize the search tool
	_______________
	Include library
	
	    1:	COPY \lib\dk.septima.spatialsuite.index-xx.jar TO \WEB-INF\lib
	    2:	REMOVE old versions of the library
	___________________________
	Configure your search index
	
		Create configuration folder
			Create the following directory structures
				WEB-INF/config/misc/custom/s4
				WEB-INF/config/misc/custom/s4/presentations
			OR copy the examples
				Copy /s4/config-example/* to WEB-INF/config/misc/custom/s4
	
	    Please see the configuration guide below on how to configure the index
	______________________
	Build the search index
	
	    1:  Start or reload configuration
	    2:  In your browser, call the following URL [YOURHOST]/jsp/modules/s4/buildIndex.jsp
	    3:  Call the above URL any time you need to update the index;
	        The URL may be called in
	            a: your data load script,
	            b: your start up script, or
	            c: at regular intervals, eg. wget in task scheduler


CONFIGURATION and CUSTOMIZATION
	_______________________________________
	CONFIGURE WHICH DATASOURCES ARE INDEXED
	
		Edit WEB-INF/config/misc/custom/s4/config.xml to include the datasources you want to index
	
			<datasources>
				<datasource id="ds_skoler" presentation="s4-pres-skoler"/>
				....
			</datasources>
		
		Each datasource MUST have a presentation in the WEB-INF/config/misc/custom/s4/presentations folder
			Each presentation MUST have the following columns
					<column format="heading"> : The title when presented as a search result
			Each presentation MAY have the following columns
					<column format="searchstring"> : The text which is indexed and free text queried
					<column format="description"> : The description when presented as a search result
					<column format="hyperlink"> : A link which will be presented directly in the search result
				
	_____________________________
	CUSTOMIZATIONS OF SEARCH TOOL
	
		1: Create a custom module, eg; myS4
		
		2: Include this tool in modules.xml AFTER the s4 module
			    <module name="s4" dir="custom/s4" permissionlevel="public"/>
			    <module name="myS4" dir="custom/myS4" permissionlevel="public"/>
		
		Create a "tools" directory in myS4 with your own customized versions of the original s4-plugin.xml (eg; s4-plugin-public.xml)
		Include these tools in your profile
				    <tool module="myS4" name="s4-plugin-public" />
	_____________________________
	
	CUSTOMIZATIONS OF CSS
	
		Copy css folder from s4 to mys4 module
		Delete everything in s4.css that is not customized, eg:
		
		.inputcontainer {
		    top:5px;
		}
		
		Create deploy.xml file to deploy customized css:
		
		<?xml version="1.0" encoding="UTF-8"?>
		<deploy>
		   <version>2.7.1</version>
		   <stoponerror>true</stoponerror>
		
		  <makedir dir="[cbinfo.wwwroot.dir]/modules/mys4/css"/>
		
		  <copyfile fromfile="[module:mys4.dir]/css/s4.css" tofile="[cbinfo.wwwroot.dir]/modules/mys4/css/s4.css"/>
		
		  <makedir dir="[cbinfo.wwwroot.dir]/modules/mys4/septimasearch/css/images"/>
		  <copyfile fromfile="[module:s4.dir]/septimasearch/0.1/css/images/close_button.gif" tofile="[cbinfo.wwwroot.dir]/modules/mys4/septimasearch/css/images/close_button.gif"/>
		  <copyfile fromfile="[module:s4.dir]/septimasearch/0.1/css/images/down.png" tofile="[cbinfo.wwwroot.dir]/modules/mys4/septimasearch/css/images/down.png"/>
		  <copyfile fromfile="[module:s4.dir]/septimasearch/0.1/css/images/search.png" tofile="[cbinfo.wwwroot.dir]/modules/mys4/septimasearch/css/images/search.png"/>
		</deploy>
		
		Finally,  add your custom css file in custom tool:
		 
		 <file type="css"    name="/modules/s4-custom/css/s4.css" />
		 
		
				    