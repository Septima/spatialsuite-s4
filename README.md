#S4 - Septima Search for SpatialSuite
===
## Content

#### 1. [Description](#description)
#### 2. [License](#license)
#### 3. [Basic installation and test](#installation)
#### 4. [Customization](#customization)
#### 5. [Search Spatial Suite data](#local)
#### 6. [Build the search index](#build)
#### 7. [Using an external database](#externaldb)
#### 8. [Problems](#problems)

## <a name="description"></a> 1. Description
Septima Search for Spatial Suite is a search tool. In addition to [smartAddress](https://smartadresse.dk/), kortforsyningens [GeoSearch] (http://www.kortforsyningen.dk/dokumentation/geonoeglergeosearch) and services
offered by Septima.

The tool will also search local Spatial Suite data as well as themes, workspaces and favorites.  
  
S4 product page: http://www.septima.dk/p_s4/  

See a demo here: http://sps-demo.septima.dk  
  
## <a name="license"></a> 2. License
 Name:        S4 - Septima Search for SpatialSuite  
 Purpose:     Septima Search based module for Spatial Map

 Author:      klavs(AT)septima.dk
  
 Created:     03-05-2013  
 Copyright:   (c) Septima P/S 2013  
 Licence:     Commercially licensed product. Please contact Septima to obtain
              a valid license.
              You are granted the right to download and install this module for
              evaluation purposes free of charge.  
              
 Contact:     Septima P/S  
              Larsbjørnsstræde 3  
              1454 København K  
              www.septima.dk  
              kontakt@septima.dk  

## <a name="installation"></a> 3. Basic installation and test


### 3.a Get s4 module:
      
Released versions:  
      1.9.1: https://github.com/Septima/spatialsuite-s4/archive/1.9.1.zip  
      1.9: https://github.com/Septima/spatialsuite-s4/archive/1.9.zip  
      1.8.1: https://github.com/Septima/spatialsuite-s4/archive/1.8.1.zip  
      1.8: https://github.com/Septima/spatialsuite-s4/archive/1.8.zip  
      1.7: https://github.com/Septima/spatialsuite-s4/archive/1.7.zip  
      1.6: https://github.com/Septima/spatialsuite-s4/archive/1.6.zip  
      1.5: https://github.com/Septima/spatialsuite-s4/archive/1.5.zip  
      1.4: https://github.com/Septima/spatialsuite-s4/archive/1.4.zip  
      1.3: https://github.com/Septima/spatialsuite-s4/archive/1.3.zip  
      1.2: https://github.com/Septima/spatialsuite-s4/archive/1.2.zip  
      1.1: https://github.com/Septima/spatialsuite-s4/archive/1.1.zip  
      1.0: https://github.com/Septima/spatialsuite-s4/archive/1.0.zip  
      
Latest version is always located at:  
      https://github.com/Septima/spatialsuite-s4/archive/master.zip  
      
Development version (at your own risk) can be downloaded from:  
      https://github.com/Septima/spatialsuite-s4/archive/develop.zip  

### 3.a Unzip and copy the module to [cbinfo.config.dir]/modules/thirdparty/septima/s4

### 3.b 	Update modules.xml by adding:
```xml
<module name="s4" dir="thirdparty/septima/s4" permissionlevel="public"/>
```

### 3.c Include tool in profile(s):
```xml
<tool module="s4" name="s4-plugin-dk-all"/>
```  
The tool s4-plugin-dk-all searches all of Denmark and includes a demo license key for smartAddress.  
You need to create a custom tool searching your municipality using your license key for smartAddress. (See below)   
  
### 3.e Comment out other tools conflicting with this tool e.g.:

```xml
<!--     <tool module="spatialaddress" name="spatialaddress-plugin" /> -->
```

### 3.d Test

Now you are ready to test s4 module and tool(s4-plugin-dk-all).

Open a browser and navigate to Spatial Map and the profile where the tool is included. 

A search input field should be visible in top right corner og the profile

The s4-plugin-dk-all tool is configured with Geosearcher enabled which enable search for addresses in all DK municipalities.

Start typing adresses in the search input field. When results show up in the search field click result and the map should zoom in top selected search result.

Basic installation and test is now finished

## <a name="customization"></a> 4. Customization of s4 tool

A typical customization is to restict adress/cvr searchers to search only in data with a specific municipality code. 

Another typical use case is to have different s4 tools for different Spatial Map profiles eg. search for schools and adresses - not industrial waste site - in a profile related to schools and insitutions.   


### 4.a Search by municipality code
 
Copy the tool [cbinfo.config.dir]/modules/custom/thirdparty/s4/tools/s4-plugin-dk-all.xml to:


    [cbinfo.config.dir]/tools/custom/s4-plugin-dk-all.xml

Rename to s4-plugin-[municipality-code]-all.xml

Replace [municipality-code] with your own muncipal code 


Configure __municipality__ code in the javascript part of [cbinfo.config.dir]/tools/custom/s4-plugin-[municipality-code]-all.xmll

```javascript
            {municipality: '*',
            view:{limit: 20, dynamiclayer: 'userdatasource', infoprofilequery: 'userdatasource'},
            adresssearcher:{enabled: false, info: true, apiKey: "FCF3FC50-C9F6-4D89-9D7E-6E3706C1A0BD"},
            geosearcher:{enabled: true, info: true, targets: ['adresser','stednavne', 'matrikelnumre', 'opstillingskredse', 'postdistrikter']},
            // Full set of geosearcher targets is targets: ['adresser','stednavne', 'kommuner', 'matrikelnumre', 'opstillingskredse', 'politikredse', 'postdistrikter', 'regioner', 'retskredse']
            cvrsearcher:{enabled: true, info: true},
            plansearcher:{enabled: true, info: true},
            indexsearcher:{enabled: true, info: true, datasources: "*"},
            //datasources: "*" for all, or space separated names of datasources
            clientsearcher:{enabled: true},
            profilesearcher:{enabled: true},
            favoritesearcher:{enabled: true},
            workspacesearcher:{enabled: true}};
```

### 4.b Customize other options

 A typical use case is to fine tune the search tool to match information in the profile


     [cbinfo.config.dir]/tools/custom/s4-plugin-[municipality-code]-all.xml

Rename to s4-plugin-[municipality-code]-[profile].xml

Replace [profile] with the name of the profile where the customized tool is intended to be applied.


Configure __municipality__ code iand __enable/disable__ and other __options__ in the javascript part of s4-plugin-[municipality-code]-[profile].xml

### 4.c Include the new customized tool

Finally, add the customized tool to your profile:
```xml
        <!-- Comment out the original tool-->
        <!--tool module="s4" name="s4-plugin"/-->
        <tool dir="custom" name="s4-plugin-[municipality-code]-[profile].xml" />
```

Finished, now try out your profile and the customized search tool

## <a name="local"></a> 5. Search Spatial Suite data  

Searching local data requires that an index of these data is configured and rebuilt every time data is updated.

For Spatial Map versions 2.7+ the embedded database will be used to host the index. For previous versions of Spatial Map please see [Using an external database](#externaldb)


### 5.a include the s4 java library:

Searching in local data requires a new jar file which is shipped with the s4 module.

Copy jar file to your Spatial Map site:


COPY \lib\custom-dk.septima.spatialsuite.index-xx.jar TO \WEB-INF\lib
REMOVE old versions of the library


### 5.b Create configuration folders and parameter  

The index builder needs a parameter pointing to a folder with index configuration.  

For each site you need to create a configuration folder eg.:  
    WEB-INF/config/misc/custom/s4  
    WEB-INF/config/misc/custom/s4/presentations

You may copy the attached examples 
```xml

    Copy /s4/config-example/* to WEB-INF/config/misc/custom/s4
    
   <!-- In cbinfo.xml create a param pointing to the configuration folder -->  

		<!-- =================================== -->
		<!-- S4 Index parametres                 -->
		<!-- =================================== -->  
				
		<param name="s4.config.dir">[cbinfo.misc.dir]/custom/s4</param>

```
### 5.c Configure datasources to be searchable

Edit WEB-INF/config/misc/custom/s4/config.xml to include the datasources you want to index:

###Example config file
```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
	<endpoint>s4index</endpoint>
	<datasources>
		<datasource id="ds_skoler" presentation="s4-pres-skoler"/-->
	</datasources>
</config>
```

A corresponding presentation MUST exist in Edit WEB-INF/config/misc/custom/s4/presentations/

Each presentation MUST have the following columns

    <column format="heading"> : The title when presented as a search result
    
Each presentation MAY have the following columns
```xml
	<column format="description"> : The description when presented as a search result
        <column format="searchstring"> : The text which is indexed and free text queried
	<column format="hyperlink"> : A link which will be presented directly in the search result
```
###Example presentation file
```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<presentation xmlns:fo="http://www.w3.org/1999/XSL/Format">
	<text name="overskrift" value="Skole" plural="Skoler"/>
	<columns>
		<column format="heading">
			<label>''+skolensnav</label>
			<value>skolensnav</value>
		</column>
		<column format="searchstring">
			<label></label>
			<value>leder + ' ' + adresse + ' ' + hyperlink</value>
		</column>
		<column format="description">
			<label>'Adresse:'</label>
			<value>adresse</value>
		</column>
</presentation>
```

## <a name="build"></a> 6. Build the search index
When datasources and presentations are configured the search index has to be built
### 6.a start site or reload configuration:
    http://localhost:8080/admin?command=reloadconfig
### 6.b Build the search index:
    [YOURSITE]/jsp/modules/s4/buildIndex.jsp
This URL may be called according to your desired workflow and integrated into:


    your data load script
    your start up script, or
    Regular intervals, eg. wget "[YOURSITE]/jsp/modules/s4/buildIndex.jsp" in task/cron scheduler

## <a name="externaldb"></a> 7. Using an external database instead of the embedded database  
  
  Spatial Map versions prior to 2.7 don't include an embedded database. You must create a database in postgres.
	
	1: create schema in your database (postgres script is included in the /db/create-schema.sql)
	2: Use external database instead of embedded   
	Include the following parameters in cbinfo.xml:  
```xml	
		<!-- =================================== -->
		<!-- S4 Index parametres                 -->
		<!-- =================================== -->
		 		 
		<param name="s4.config.dir">[cbinfo.misc.dir]/custom/s4</param>
		<param name="module.s4.index.externdb.type">postgis</param>
		<param name="module.s4.index.externdb.connect">localhost:5432/s4</param>
		<param name="module.s4.index.externdb.user">s4</param>
		<param name="module.s4.index.externdb.pwd">s4</param>
		<param name="module.s4.index.externdb.srid">[cbinfo.mapserver.epsg]</param>

```
## <a name="problems"></a>8. Problems  
### Encoding  
  if you experience encoding problems (seen in Spatial Map prior to 2.9) please try to insert the following parameter into cbinfo.xml
```xml
	<param name="module.s4.index.utf8behaviour">noconvert</param>
```	
### Can't search local data
  Please verify that everything is set up according to [Search Spatial Suite data](#local) and that you have [built your index](#build)
	
	
### Custom CSS moving Search box to an undesired position
  If for some reason your profile or site contains some custom CSS which causes Septima Search box to be positioned in a bad or undesired position in the profile, a new custom s4 module has to be created
  
1: Create new empty module eg. s4-custom: [cbinfo.config.dir]/modules/custom/s4-custom/

2: Create a css folder and empty css file in: [cbinfo.config.dir]/modules/custom/s4-custom/css/s4.css

3: Add the custom CSS rules to the css file:

```css
  .inputcontainer {
      top:5px;
  }
```
  4: Create and deploy.xml file in the s4-custom module:

    In your custom module [cbinfo.config.dir]/modules/thirdparty/septima/s4-custom, create a new deploy.xml file which deploys your customized CSS
```xml
<?xml version="1.0" encoding="UTF-8"?>
      <deploy>
         <version>2.7.1</version>
         <stoponerror>true</stoponerror>
        <makedir dir="[cbinfo.wwwroot.dir]/modules/thirdparty/septima/s4-custom/css"/>
        <copyfile fromfile="[module:s4-custom.dir]/css/s4.css" tofile="[cbinfo.wwwroot.dir]/modules/thirdparty/septima/s4-custom/css/s4.css"/>
      </deploy>
```
  5: Finally, edit the tool [cbinfo.config.dir]/tools/custom/s4-plugin-[municipality-code]-all.xmlto include the css from s4-custom module after the standard s4 css:
```xml
        <file type="css"    name="/modules/s4/css/s4.css" />
        <file type="css"    name="/modules/thirdparty/septima/s4-custom/css/s4.css" />
```
