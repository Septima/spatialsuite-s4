#S4 - Septima Search for SpatialSuite
===
####[Description](#description)
####[License](#license)
####[Basic installation and test](#installation)
####[Customization](#s4customization)
####[Search Spatial Suite data](#local)
 *  [Build the search index](#build)
 *  [Separate indexes for separate sites](#build.site)
 *  [Using an external database](#externaldb)  
 
####[FAQ and Issues](#problems)

## <a name="description"></a>Description
Septima Search for Spatial Suite (s4) is a search tool. The user can search [smartAddress](https://smartadresse.dk/), kortforsyningens [GeoSearch] (http://www.kortforsyningen.dk/dokumentation/geonoeglergeosearch) and cvr and plan services
offered by Septima.

S4 will also search local Spatial Suite data as well as themes, workspaces and favorites.  
  
S4 product page: http://www.septima.dk/p_s4/  

See a demo here: http://sps-demo.septima.dk  

Wiki: https://github.com/Septima/spatialsuite-s4/wiki  

Issues: https://github.com/Septima/spatialsuite-s4/issues  
  
## <a name="license"></a>License
 Name:        S4 - Septima Search for SpatialSuite  
 Purpose:     Septima Search based module for Spatial Map

 Author:      klavs(AT)septima.dk
  
 Created:     03-05-2013  
 Copyright:   (c) Septima P/S 2013-2014  
 License:     Commercially licensed product. Please contact Septima to obtain
              a valid license.
              You are granted the right to download and install this module for
              evaluation purposes free of charge.  
              
 Contact:     Septima P/S  
              Frederiksberggade 28, 2. tv.  
              1459 København K  
              www.septima.dk  
              kontakt@septima.dk  

## <a name="installation"></a>Basic installation and test

### Download s4 module:
      
Released versions:  
      2.2.2:   https://github.com/Septima/spatialsuite-s4/archive/2.2.2.zip  
      2.2.1:   https://github.com/Septima/spatialsuite-s4/archive/2.2.1.zip  
      2.2:   https://github.com/Septima/spatialsuite-s4/archive/2.2.zip  
      2.1:   https://github.com/Septima/spatialsuite-s4/archive/2.1.zip  
      2.0.8: https://github.com/Septima/spatialsuite-s4/archive/2.0.8.zip  
      2.0.7: https://github.com/Septima/spatialsuite-s4/archive/2.0.7.zip  
      2.0.6: https://github.com/Septima/spatialsuite-s4/archive/2.0.6.zip  
      2.0.5: https://github.com/Septima/spatialsuite-s4/archive/2.0.5.zip  
      2.0.3: https://github.com/Septima/spatialsuite-s4/archive/2.0.3.zip  
      2.0.2: https://github.com/Septima/spatialsuite-s4/archive/2.0.2.zip  
      2.0.1: https://github.com/Septima/spatialsuite-s4/archive/2.0.1.zip  
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
      
Development version (at your own risk) may be downloaded from:  
      https://github.com/Septima/spatialsuite-s4/archive/development.zip  

### Unzip and copy the module to [cbinfo.config.dir]/modules/thirdparty/septima/s4

### Update modules.xml:
```xml
<module name="s4" dir="thirdparty/septima/s4" permissionlevel="public"/>
```

### Include tool in profile(s):
  
#### In Denmark:  
Copy the standard tool [cbinfo.config.dir]/modules/custom/thirdparty/s4/tools/s4-plugin-dk-all.xml to:

    [cbinfo.config.dir]/tools/custom/s4-plugin-[your-municipality-code]-all.xml  
    
Add the customized tool to your profile:
```xml
<tool dir="custom" name="s4-plugin-[your-municipality-code]-all" />
```
The tool s4-plugin-dk-all searches all of Denmark. You will need to customize your tool (See below)  

Comment out other tools conflicting with this tool e.g.:
```xml
<!--     <tool module="spatialaddress" name="spatialaddress-plugin" /> -->
```  

##### Test

Now you are ready to test s4 module and tool(s4-plugin-dk-all).

The s4-plugin-dk-all tool is configured with Geosearcher and the Septima indexes *cvr* and *lokalplan* enabled.  
* Open a browser and navigate to Spatial Map and the profile where the tool is included. A search input field should be visible in top right corner og the profile  
* Start typing in the search input field. When results show up in the search field click a result and the map should zoom to the selected search result.  
* Basic installation and test is now finished  
  
  
#### Outside Denmark:    
Copy the standard tool [cbinfo.config.dir]/modules/custom/thirdparty/s4/tools/s4-plugin-all.xml to:

    [cbinfo.config.dir]/tools/custom/s4-plugin-all.xml  
    
Add the customized tool to your profile:
```xml
<tool dir="custom" name="s4-plugin-all"/>
```
  
S4 will now search themes, profiles, and workspaces. In order to search your local data please See [Search Spatial Suite data](#local)    


## <a name="s4customization"></a>Customization of s4 tool

##### Restrict searches for address, cvr, and plan to your municipality  
Set the __municipality__ parameter in the javascript part of [cbinfo.config.dir]/tools/custom/s4-plugin-[*your-municipality-code*]-all.xml  

##### Other options  
* Set the __printconfig__ parameter. The default is *rotatet*  
* Set the __blankbehavior__ parameter. Default is *search* which searches even when the user hasn't entered a query string  
* Set the __autofocus__ parameter. If set, the search input field will get focus immediately meaning the user may start searching right away. Default is *false*  
* set the __panel__ parameter.

```javascript
{municipality: '[your-municipality-code]',

//Positioning of s4. Choose between
//  'default': In panel-brand if possible, else in panel-middle (menu linie, right justified)
//  'panel-brand': Force s4 to panel-brand 
//  'panel-top': Force s4 to top menu
//  'panel-middle': Force s4 to menu line (right justified)
//  'menu': As the last menu in the menu line
panel: 'default',

//Result presentation
//  printconfig: standard, full_freetext, rotatet, rotatet_contact or html  
//  blankbehavior: search or none  
//  autofocus: true or false. Default is false 
view:{limit: 20, blankbehavior: "search", autofocus: false, dynamiclayer: 'userdatasource', infoprofilequery: 'userdatasource', printconfig: 'rotatet'},

//Smart-adress
adresssearcher:{enabled: false, info: true, print: true, apiKey: "FCF3FC50-C9F6-4D89-9D7E-6E3706C1A0BD", streetNameHit: false},

//Geodatastyrelsen-geosearch
// Full set of geosearcher targets is: ['adresser','stednavne', 'kommuner', 'matrikelnumre', 'opstillingskredse', 'politikredse', 'postdistrikter', 'regioner', 'retskredse']
geosearcher:{enabled: true, info: true, print: true, targets: ['adresser','stednavne', 'matrikelnumre', 'opstillingskredse', 'postdistrikter'], streetNameHit: false},

//Septima CVR-index
cvrsearcher:{enabled: true, info: true, print: true},

//Septima lokalplan-index
plansearcher:{enabled: true, info: true, print: true},

//Local SpatialSuite-datasources
//datasources: "*" for all, or space separated names of datasources
indexsearcher:{enabled: false, info: true, print: true, datasources: "*"},

//Themes in profile
themesearcher:{enabled: true},

//Profiles
profilesearcher:{enabled: true},

//Favorites
favoritesearcher:{enabled: true},

//Workspaces
workspacesearcher:{enabled: true}};
```

### Customize other options

For each searcher a number of parameters may be set:  
* __Enable/disable__ a searcher by setting enabled: *true* or *false*  
* __Info__ determines whether the user can do a spatial query with a selected feature; info: *true* or *false*  
* __print__ determines whether it should be possible to open the print dialog; print: *true* or *false*    

The targets in the geosearcher are changed by editing the *targets* property.

	geosearcher:{enabled: true, info: true, print: true, targets: ['adresser','stednavne', 'matrikelnumre'], streetNameHit: false},

Another useful option is to choose which local datasources the tool will search in (See [Search Spatial Suite data](#local)). This is controlled in the datasources key in the indexsearcher:

To search all local datasources:

	indexsearcher:{enabled: true, info: true, print: true, datasources: "*"}

To search specific datasources:

	indexsearcher:{enabled: true, info: true, print: true, datasources: "ds_skoler ds_boligforeninger"}

### Create profile specific search tools

You can create as many tools as you need. To tailor a tool to a specific profile make a copy of your tool and call it s4-plugin-[*your-municipality-code*]-[*profile*].xml.  

Replace [*profile*] with the name of the profile in which the customized tool is included.  

Add the customized tool to your profile:
```xml
<tool dir="custom" name="s4-plugin-[your-municipality-code]-[profile].xml" />
```

Finished, now try out your profile and the customized search tool

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

	Copy /s4/config-example/* to WEB-INF/config/misc/custom/s4
    
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
		<datasource id="ds_skoler" presentation="s4-pres-skoler"/>
		<datasource id="ds_...." presentation="s4-pres-...."/>
		<datasource id="ds_...." presentation="s4-pres-...."/>
	</datasources>
</config>
```

You may use any existing datasource, but there are good reasons to create specific datasources for indexing:  
* *Sorting*: Search results are sorted first by relevance and secondly by the order in which they are returned from the datasource. It's much quicker to sort directly in a view in the database than in the datasource definition.  
* *Index performance*: Create a datasource based on a view which only selects the necessary columns. (Those that are mentioned in the presentaion PLUS geometry)  

#### Presentations    

* The corresponding presentations MUST exist in [*s4.config.dir*]/presentations/  
* The text tag MUST have both a value and a plural  
* Each presentation MUST have the following columns  
```xml
<column format="heading"> : The title when presented as a search result
```

#### Minimal presentation file
```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<presentation xmlns:fo="http://www.w3.org/1999/XSL/Format">
	<text name="overskrift" value="Skole" plural="Skoler"/>
	<columns>
		<column format="heading">
			<label></label>
			<value>skolensnavn</value>
		</column>
</presentation>
```
Each presentation *MAY* have the following columns
```xml
<column format="description"> : The description when presented as a search result
<column format="searchstring"> : Text which is indexed and free text queried. This text is not visible to the end user
<column format="hyperlink"> : A link which will be presented directly in the search result
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
			<value>adresse</value>
		</column>
		<column format="searchstring">
			<label></label>
			<value>leder + ' ' + adresse + ' ' + hyperlink</value>
		</column>
		<column format="hyperlink">
			<label>'Se skolens hjemmeside'</label>
			<value>hyperlink</value>
		</column>
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

## <a name="problems"></a> FAQ and Issues  
<a name="problems.encoding"><a name="problems.localdata"></a><a name="problems.css"></a>
If you have any questions please consult the s4 wiki at https://github.com/Septima/spatialsuite-s4/wiki  

To report an issue, please go to https://github.com/Septima/spatialsuite-s4/issues  

	
