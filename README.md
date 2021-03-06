# S4 - Septima Search for SpatialSuite  
  
Septima Search for Spatial Suite (s4) is a search tool.  
  
* The user can search [dawa/aws](http://dawa.aws.dk), [smartAddress](https://smartadresse.dk/), kortforsyningens [GeoSearch] (http://www.kortforsyningen.dk/dokumentation/geonoeglergeosearch) and cvr and plan services
offered by Septima.
* S4 will also search local Spatial Suite data as well as themes, workspaces and favorites.  

  
#### [License](#license)  
#### [Basic installation and test](#installation)  
#### [Customization](#s4customization)  
#### [Included tools](./tools#tools-included-in-s4)   
#### [Search Spatial Suite data](#local)  
#### [FAQ and Issues](#problems)  

#### Links  
  
* S4 product page: http://www.septima.dk/p_s4  
* Septima Search product page: http://www.septima.dk/p_search  
* See a demo here: http://sps.test.septima.dk  
* Wiki: https://github.com/Septima/spatialsuite-s4/wiki  
* Issues: https://github.com/Septima/spatialsuite-s4/issues  
  
## <a name="license"></a>License
 Name:        S4 - Septima Search for SpatialSuite  
 Purpose:     Septima Search based module for Spatial Map

 Author:      klavs(AT)septima.dk
  
 Created:     03-05-2013  
 Copyright:   (c) Septima P/S 2013-2020  
 License:     Commercially licensed product. Please contact Septima to obtain
              a valid license.
              You are granted the right to download and install this module for
              evaluation purposes free of charge.  
              
 Contact:     Septima P/S  
              Frederiksberggade 19, 2.   
              1459 København K  
              www.septima.dk  
              kontakt@septima.dk  

## <a name="installation"></a>Basic installation and test  

### Download s4 module:
      
Current version:  
      2.13.1: https://github.com/Septima/spatialsuite-s4/archive/2.13.1.zip  
      
#### Unzip and copy the module to [cbinfo.config.dir]/modules/thirdparty/septima/s4

##### Update modules.xml:
```xml
<module name="s4" dir="thirdparty/septima/s4" permissionlevel="public"/>
```

### Include tools in profile(s):
  
#### In Denmark:  
Copy the standard tool [cbinfo.config.dir]/modules/custom/thirdparty/s4/tools/s4-plugin-dk-all.xml to:

    [cbinfo.config.dir]/tools/custom/s4-plugin-[your-municipality-code]-all.xml   
(It's important that the name starts with _s4-plugin_)  
    
Add the customized tool to your profile (_panel_ is optional):  
```xml
<tool dir="custom" name="s4-plugin-[your-municipality-code]-all" [panel="xxx"]/>
```

##### Update cbinfo.xml (In Denmark):  
In order to search the danish Plansystem and cvr data, please include the following parameter in your relevant cbinfo.xml:    
```xml
<!-- =================================== -->
<!-- S4 Index parameters                 -->
<!-- =================================== -->  
<param name="s4.searchchindex.token">aaaaAAAA-00000000</param>
```  
where aaaaAAAA-00000000 is a special token provided to you by Septima.  
  
The tool will now search all of Denmark. You will need to set the _municipality_ parameter in your tool (See below)  
  
  
#### Outside Denmark:    
Copy the standard tool [cbinfo.config.dir]/modules/custom/thirdparty/s4/tools/s4-plugin-all.xml to:

    [cbinfo.config.dir]/tools/custom/s4-plugin-all.xml    
(It's important that the name starts with _s4-plugin_)  
    
Add the customized tool to your profile (_panel_ is optional):  
```xml
<tool dir="custom" name="s4-plugin-all" [panel="xxx"]/>
```
  
S4 will now search themes, profiles, and workspaces. In order to search your local data please see [Search Spatial Suite data](#local)    
  
#### More tools:    
To enable the info and print icons, please incklude the following tool:  
```xml
<tool module="s4" name="s4-buttons-spatialMapTools-plugin" />
```    
  

## <a name="s4customization"></a>Customization of s4 tool

##### Restrict searches to your municipality  
Set the __municipality__ parameter in the javascript part of [cbinfo.config.dir]/tools/custom/s4-plugin-[*your-municipality-code*]-all.xml  

##### General options  
* Set the __printconfig__ parameter. The default is *rotatet*  
* Set the __blankbehavior__ parameter. Default is *search* which searches even when the user hasn't entered a query string  
* Set the __autofocus__ parameter. If set, the search input field will get focus immediately meaning the user may start searching right away. Default is *false*  
* set the __panel__ parameter.

```javascript  
//Mellemrums-separeret liste af kommunenumre. '*' søger i alle kommuner. Ellers feks. '101' eller '101 253'. 
municipality: '*',

//  'default': same as panel-middle
//  'panel-brand': Force s4 to panel-brand 
//  'menu': As the last menu in the menu line
//  'tool': Use the panel as specified in the profile
//  'panel-top': Force s4 to top menu
//  'panel-middle': Force s4 to menu linie (right justified)
//  'map-top-right': SpS 4.1+ only
panel: 'map-top-right',

//Result presentation
//  printconfig: standard, full_freetext, rotatet, rotatet_contact or html
//  blankbehavior: search or none  
//  autofocus: true or false. Default is false
//  forcedblurOnSelect: Force close of result list. Default is false
//  zoomBuffer: Buffer when result is shown in map. Default is '100'
//  marginToBottom: Distance between bottom of resultlist and bottom af window. Default is 100
view: {
  limit: 20,
  blankbehavior: "search",
  autofocus: false,
  dynamiclayer: 'userdatasource',
  infoprofilequery: 'userdatasource',
  printconfig: 'rotatet',
  forcedblurOnSelect: 'false',
  zoomBuffer: '100',
  marginToBottom: 100,
  placeholder: "Søg" 
},

//Adressesøgning i DAWA
// minimumShowCount: How many adresses should always be shown
dawasearcher: {enabled: true, info: true, print: true, minimumShowCount: 3, showMinimumOnBlank: false},

//Geodatastyrelsen-geosearch
// Full set of geosearcher targets is: ['kommuner', 'matrikelnumre', 'opstillingskredse', 'politikredse', 'postdistrikter', 'regioner', 'retskredse']
geosearcher: {enabled: true, info: true, print: true, targets: ['matrikelnumre', 'opstillingskredse', 'postdistrikter']},

//Geodatastyrelsen - Stednavne i geosearch
geostednavnesearcher: {enabled: true, info: true, print: true},

//Septima CVR-index
cvrsearcher: {enabled: true, info: true, print: true},

//Septima lokalplan-index
plansearcher: {enabled: true, info: true, print: true},

//Local SpatialSuite-datasources
//  datasources: "*" for all, or space separated names of datasources
//  blankbehavior: search or none
indexsearcher: {enabled: false, info: true, print: true, datasources: "*", blankbehavior: "search"},

//Themes in profile
themesearcher: {enabled: true},

//Profiles
profilesearcher: {enabled: true},

//Favorites
favoritesearcher: {enabled: true},

//Workspaces
workspacesearcher: {enabled: true}



```

### Searcher options

For each searcher a number of parameters may be set:  
* __Enable/disable__ a searcher by setting enabled: *true* or *false*  
* __Info__ determines whether the user can do a spatial query with a selected feature; info: *true* or *false*  
* __print__ determines whether it should be possible to open the print dialog; print: *true* or *false*    

The targets in the geosearcher are changed by editing the *targets* property.

```javascript
geosearcher:{enabled: true, info: true, print: true, targets: ['stednavne_v2', 'matrikelnumre']},
```

Another useful option is to choose which local datasources the tool will search in (See [Search Spatial Suite data](#local)). This is controlled in the datasources key in the indexsearcher:

To search all local datasources:

```javascript
indexsearcher:{enabled: true, info: true, print: true, datasources: "*"}
```

To search specific datasources:

```javascript
indexsearcher:{enabled: true, info: true, print: true, datasources: "ds_skoler ds_boligforeninger"}
```

### Create profile specific search tools

You may create as many tools as you need. To tailor a tool to a specific profile make a copy of your tool and call it s4-plugin-[*your-municipality-code*]-[*profile*].xml.  

Replace [*profile*] with the name of the profile in which the customized tool is included.  

Add the customized tool to your profile:
```xml
<tool dir="custom" name="s4-plugin-[your-municipality-code]-[profile].xml" />
```

Finished, now try out your profile and the customized search tool

## <a name="tools"></a> Included tools  

S4 comes a number of included tools. 
All included tools must be included in the profile _after_ the main tool.  
Please see [the tools section](./tools#tools-included-in-s4)  


## <a name="local"></a> Search Spatial Suite data  

### Include the s4 java library:

Searching in local data requires a jar file which is shipped with the s4 module.

Copy the jar file to your Spatial Map site:  
* COPY \lib\custom-dk.septima.spatialsuite.index-xx.jar TO \WEB-INF\lib  
* REMOVE old versions of the library

### Create configuration folders and parameter  

The index builder needs a parameter pointing to a folder with index configuration.  

For each site you need to create a configuration folder eg.:  
    WEB-INF/config/misc/custom/s4  
    WEB-INF/config/misc/custom/s4/presentations

You may copy the attached examples 

```
Copy /s4/config-example/* to WEB-INF/config/misc/custom/s4
```
    
In cbinfo.xml create a param pointing to the configuration folder  
```xml
<!-- =================================== -->
<!-- S4 Index parameters                 -->
<!-- =================================== -->  
<param name="s4.config.dir">[cbinfo.misc.dir]/custom/s4</param>
```
### Configure datasources to be searchable

Edit [*s4.config.dir*]/config.xml to include the datasources you want to index:

#### <a name="local.datasource"></a>config.xml example
```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
	<endpoint>s4index</endpoint>
	<datasources>
		<datasource id="ds_skoler" presentation="s4-pres-skoler" [iconuri=""]/>
		<datasource id="ds_...." presentation="s4-pres-...."/>
		<datasource id="ds_...." presentation="s4-pres-...."/>
	</datasources>
</config>
```
, where _datasource_ and _presentation_ are mandatory. Optional: Specify a URL to a 20X20 pixel icon for a datasource for a custom icon in the result list.  
   
You may use any existing datasource, but there are good reasons to create specific datasources for indexing:  
* *Sorting*: Search results are sorted first by relevance and secondly by the order in which they are returned from the datasource. It's much quicker to sort directly in a view in the database than in the datasource definition.  
* *Index performance*: Create a datasource based on a view which only selects the necessary columns. (Those that are mentioned in the presentation PLUS geometry)  

#### Presentations    

* The corresponding presentations MUST exist in [*s4.config.dir*]/presentations/  
* The text tag MUST have both a value and a plural  
* Each presentation MUST have the following columns  
```xml
<column format="heading"> : The title when presented as a search result
```  
Maximum length of the title is 255 characters.  

#### Minimal presentation file
```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<presentation xmlns:fo="http://www.w3.org/1999/XSL/Format">
	<text name="overskrift" value="Skole" plural="Skoler"/>
	<columns>
		<column format="heading">
			<label></label>
			<value>skolensnavn</value> <!-- Max 255 chars -->
		</column>
    </columns>
</presentation>
```  
_value_ and _plural_ are mandatory.  

Each presentation *MAY* have the following columns
```xml
<column format="description"> : The description when presented as a search result
<column format="searchstring"> : Text which is indexed and free text queried. This text is not visible to the end user
<column format="hyperlink"> : A link which will be presented directly in the search result
<column format="javascriptlink"> : Javascript which may invoke a function (See examples below)
<column>: Ordinary columns
```
#### Extended presentation file
```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<presentation xmlns:fo="http://www.w3.org/1999/XSL/Format">
	<text name="overskrift" value="Skole" plural="Skoler"/>
	<columns>
		<column format="heading">
			<label></label>
			<value>skolensnav</value>
		</column>
		<column format="description">
			<label></label>
			<value>adresse</value> <!-- Max 255 chars -->
		</column>
		<column format="searchstring">
			<label></label>
			<value>leder + ' ' + adresse + ' ' + hyperlink</value>
		</column>
		<column format="hyperlink">
			<label>'Se skolens hjemmeside'</label>
			<value>hyperlink</value>
		</column>
        <column format="javascriptlink">
            <label>'Alert navnet på skolen1'</label>
            <value>'alert("' + skolensnav + '")'</value>
            <condition/>
        </column>
        <column>
            <label>'Klassetrin'</label>
            <value>bem + ' klasse ' </value>
            <condition/>
        </column>
        <column>
            <label>'Tlf'</label>
            <value>tlf</value>
            <condition/>
        </column>
        <column>
            <label>'Mail'</label>
            <value>email</value>
            <condition/>
        </column>
    </columns>
</presentation>
```

## <a name="build"></a> Build the search index
When datasources and presentations are configured the search index has to be built
### Start site or reload configuration:
    [YOURSITE]/admin?command=reloadconfig
### Build the search index:
    [YOURSITE]/jsp/modules/s4/buildIndex.jsp
This URL may be called according to your desired workflow and integrated into:

* your data load script
* your start up script, or
* at regular intervals, eg. wget "[YOURSITE]/jsp/modules/s4/buildIndex.jsp" in task/cron scheduler

### <a name="build.site"></a> Separate indexes for separate sites  

In some situations you might want to index differently in internal sites vs external sites. Please see https://github.com/Septima/spatialsuite-s4/wiki/Separate-indexes-for-separate-sites  

### <a name="externaldb"></a> Using an external database as local data index  
  
Why use an external database?  
* Spatial Map versions prior to 2.7 don't include an embedded database. You must create an external database for the s4 index.  
* Your index is too big for the embedded database. An external database will hold indices of any size  
  
In these situations you might want to index In an external database. You may use either postgres og sql server. Please see https://github.com/Septima/spatialsuite-s4/wiki/How-to-use-an-external-database    
  
## <a name="problems"></a> FAQ and Issues  
<a name="problems.encoding"><a name="problems.localdata"></a><a name="problems.css"></a>
If you have any questions please consult the s4 wiki at https://github.com/Septima/spatialsuite-s4/wiki  

To report an issue, please go to https://github.com/Septima/spatialsuite-s4/issues  

	
