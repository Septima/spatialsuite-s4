# S4 - Septima Search for SpatialSuite  
  
Septima Search for Spatial Suite (s4) is a search tool.  
  
* The user can search a wide range of public data  
* S4 will also search local Spatial Suite data as well as themes, workspaces, profiles, and favorites  

### Contents:  
[License](#license)  
[Basic installation and test](#installation)  
[Customization](#s4customization)  
- [Standard tool](#s4customization) (Configure everything)  
- [OneDoor tool](./onedoor#shows-onedoor-results-and-details-in-spatial-map-all-configuration-is-done-in-onedoor) (Use OneDoor Server)  

[Included tools](./tools#tools-included-in-s4)   
[Search Spatial Suite data](#local)  
[CBInfo parameters](#cbinfoparametre)  
[FAQ and Issues](#problems)  
  
### Issue tracker:
https://github.com/Septima/spatialsuite-s4/issues  

### News letters:  
- Latest: v 2.18.2
- Previous:
  - [v 2.17.0](https://us15.campaign-archive.com/?u=4765ed85ec81b390bd936ae90&id=0e61f3c8d8) Correction: [v 2.17.0 Correction](https://us15.campaign-archive.com/?u=4765ed85ec81b390bd936ae90&id=cb7570085f)
  - [v 2.16.5](https://mailchi.mp/3b2a18bdeb28/version-2164-af-septima-search-til-spatial-suite-s4-20284774)
  - [v 2.16.4](https://mailchi.mp/3b2a18bdeb28/version-2164-af-septima-search-til-spatial-suite-s4-20284774)
  - [v 2.16.2](https://mailchi.mp/992c7d595999/version-2161-af-septima-search-til-spatial-suite-s4-20278394)
  - [v 2.16.1](https://mailchi.mp/d941e5cdb666/version-2161-af-septima-search-til-spatial-suite-s4-20275678)
  - [v 2.15.7](https://us15.campaign-archive.com/?u=4765ed85ec81b390bd936ae90&id=ba6f3945bb)
  - [v 2.15.6](https://mailchi.mp/059623596681/version-2151-af-septima-search-til-spatial-suite-s4-20261533)
  - [v 2.15.5](https://us15.campaign-archive.com/?u=4765ed85ec81b390bd936ae90&id=df0ea5360d)
  - [v 2.15.3](https://mailchi.mp/7727c9a22f08/version-2151-af-septima-search-til-spatial-suite-s4-20165721)
  - [v 2.15.1](https://mailchi.mp/f9b63272b7c1/version-2151-af-septima-search-til-spatial-suite-s4-20150217)
  - [v 2.14.5](https://us15.campaign-archive.com/?u=4765ed85ec81b390bd936ae90&id=57288af1b2)
  - [v 2.14.4](https://us15.campaign-archive.com/?u=4765ed85ec81b390bd936ae90&id=c93e0e3ab9)
  - [v 2.14.1](https://us15.campaign-archive.com/?u=4765ed85ec81b390bd936ae90&id=77bba3e961)  (Big release)
- [All news letters](https://us15.campaign-archive.com/home/?u=4765ed85ec81b390bd936ae90&id=ed20681715)  
  
## <a name="license"></a>License
 Name:        S4 - Septima Search for SpatialSuite  
 Purpose:     Septima Search based module for Spatial Map

 Author:      klavs(AT)septima.dk
  
 Created:     03-05-2013  
 Copyright:   (c) Septima P/S  
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
      2.18.3: https://github.com/Septima/spatialsuite-s4/archive/2.18.3.zip   
      
#### Unzip and copy the module to [cbinfo.config.dir]/modules/thirdparty/septima/s4

##### Update modules.xml:
```xml
<module name="s4" dir="thirdparty/septima/s4" permissionlevel="public"/>
```

### Include tools in profile(s):  
This describes the standard s4 tool. If you want to show OneDoor results please go to [OneDoor tool](./onedoor)  

#### In Denmark:  
Copy the standard tool [cbinfo.config.dir]/modules/custom/thirdparty/s4/tools/s4-plugin-dk-all.xml to:
[cbinfo.config.dir]/tools/custom/s4-plugin-[your-municipality-code]-all.xml, where the name MUST start with _s4-plugin_  
    
Add the customized tool to your profile:  
```xml
<tool dir="custom" name="s4-plugin-[your-municipality-code]-all"/>
```

The tool will now search all of Denmark. You will need to set the _municipality_ parameter in your tool (See below)  
  
  
#### Outside Denmark:    
Copy the standard tool [cbinfo.config.dir]/modules/custom/thirdparty/s4/tools/s4-plugin-all.xml to:
[cbinfo.config.dir]/tools/custom/s4-plugin-all.xml, where the name MUST start with _s4-plugin_  
    
Add the customized tool to your profile (_panel_ is optional):  
```xml
<tool dir="custom" name="s4-plugin-all" [panel="xxx"]/>
```
  
S4 will now search themes, profiles, and workspaces. In order to search your local data please see [Search Spatial Suite data](#local)    
  

## <a name="s4customization"></a>Customization of s4 tool

#### In Denmark:  

##### Restrict searches to your municipality  
Set the __municipality__ parameter in the javascript part of [cbinfo.config.dir]/tools/custom/s4-plugin-[*your-municipality-code*]-all.xml  

#### General options  
* Set the __printconfig__ parameter. The default is *rotatet*  
* Set the __blankbehavior__ parameter. Default is *search* which searches even when the user hasn't entered a query string  
* Set the __autofocus__ parameter. If set, the search input field will get focus immediately meaning the user may start searching right away. Default is *false*  
* set the __panel__ parameter.

```javascript  
//Mellemrums-separeret liste af kommunenumre. '*' søger i alle kommuner. Ellers feks. '101' eller '101 253'. 
municipality: '*',

//Position
//  'default': same as map-top-right
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

//Plansystem
// Full set of targets is ['vedtagetlokalplan', 'kommuneplanramme', 'kommuneplantillaeg', 'lokalplanforslag', 'regionplan', 'byggefelt', 'delområde', 'vedtagetkloakopland', 'mulighedforudtraedenkloakopland', 'zonestatus']
plansearcher: {enabled: true, info: true, print: true, targets: ['vedtagetlokalplan', 'kommuneplanramme', 'kommuneplantillaeg', 'lokalplanforslag', 'regionplan', 'byggefelt', 'delområde', 'vedtagetkloakopland', 'mulighedforudtraedenkloakopland', 'zonestatus']},

//Local SpatialSuite-datasources
//  datasources: "*" for all, or space separated names of datasources
//  blankbehavior: search or none
indexsearcher: {enabled: false, info: true, print: true, datasources: "*", blankbehavior: "search"},

//Themes in profile
themesearcher: {enabled: true, userThemes: "all", userDrawings: "own", searchDescription: true},

//Profiles
profilesearcher: {enabled: true},

//Favorites
favoritesearcher: {enabled: true},

//Workspaces
workspacesearcher: {enabled: true},
                
//History
// Promote: show history icon in search input
// persist: Remember history between sessions
historysearcher: {enabled: false, promote: true, persist: true},

//SpS projection
// Any other projection than epsg:25832 MUST be defined here
projection_epsg: {code: "epsg:25832", def: "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"}

```

### Searcher options

For each searcher a number of parameters may be set:  
* __Enable/disable__ a searcher by setting enabled: *true* or *false*  
* __Info__ determines whether the user can do a spatial query with a selected feature; info: *true* or *false*  
* __print__ determines whether it should be possible to open the print dialog; print: *true* or *false*    

#### Geosearcher  
The targets in the geosearcher are changed by editing the *targets* property.

```javascript
geosearcher:{enabled: true, info: true, print: true, targets: ['matrikelnumre', 'postdistrikter']},
```

#### Indexsearcher  
Select the datasources in which the tool will search (See [Search Spatial Suite data](#local)). This is controlled in the *datasources* key in the indexsearcher:

To search all local datasources:

```javascript
indexsearcher:{enabled: true, info: true, print: true, datasources: "*"}
```

To search specific datasources:

```javascript
indexsearcher:{enabled: true, info: true, print: true, datasources: "ds_skoler ds_boligforeninger"}
```

#### Plansearcher  
The targets in the plansearcher are set by editing the *targets* property.  

```javascript
//Full set of targets is ['vedtagetlokalplan', 'kommuneplanramme', 'kommuneplantillaeg', 'lokalplanforslag', 'regionplan', 'byggefelt', 'delområde', 'vedtagetkloakopland', 'mulighedforudtraedenkloakopland', 'zonestatus']
plansearcher: {enabled: true, info: true, print: true, targets: ['vedtagetlokalplan', 'kommuneplanramme', 'kommuneplantillaeg', 'lokalplanforslag', 'regionplan', 'byggefelt', 'delområde', 'vedtagetkloakopland', 'mulighedforudtraedenkloakopland', 'zonestatus']},
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

S4 comes with a number of tools included. 
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


## <a name="cbinfoparametre"></a> CBInfo-parameters  

These are s4's general CBInfo parameters - Tools may take more params as described in their documentation  
### Index Search  

These params must be set if you index your own datasources (See [Search Spatial Suite data](#local))

```xml
<!-- Config folder -->
 <param name="s4.config.dir">[cbinfo.misc.dir]/custom/s4</param>

<!-- Index database -->
 <param name="module.s4.index.externdb.type">postgis</param>
 <param name="module.s4.index.externdb.connect">localhost:5432/data</param>
 <param name="module.s4.index.externdb.user">postgres</param>
 <param name="module.s4.index.externdb.pwd">postgres</param>
 <param name="module.s4.index.externdb.srid">[cbinfo.mapserver.epsg]</param>
```
### Layout  

These params are optional

```xml
<!-- s4.color: Default blue -->
<!-- orange, green or grey -->
 <param name="s4.color">orange</param>
```

```xml
<!-- Make detail header small -->
 <param name="s4.header.small">true</param>
```

```xml
<!-- Adjust to top bar -->
 <param name="s4.input.topbar">True</param>
```

## <a name="problems"></a> FAQ and Issues  
<a name="problems.encoding"><a name="problems.localdata"></a><a name="problems.css"></a>
If you have any questions please consult the s4 wiki at https://github.com/Septima/spatialsuite-s4/wiki  

To report an issue, please go to https://github.com/Septima/spatialsuite-s4/issues  

	
