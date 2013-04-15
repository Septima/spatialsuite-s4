#s4 - SeptimaSearch for SpatialSuite
===
## Content

#### 1. Description
#### 2. License
#### 3. Installation
#### 4. Configure your search index
#### 5. Build the search index
#### 6. Customization of module

## 1. Description
Septima Search for Spatial Suite is an implementation of SeptimaSearch for SpatialSuite


## 2. License

add here some text

## 3. Installation

###NOTE: Never change content of s4 module. Instead, create a custom module with changes only. See later in this document


### 3.a Get latest version of the s4 module here:
    https://github.com/Septima/spatialsuite-s4/archive/markdown.zip

### 3.a Unzip and copy the module to [cbinfo.config.dir]/modules/septima/s4

### 3.b 	Update modules.xml by adding:
```xml
<module name="s4" dir="custom/s4" permissionlevel="public"/>
```
### 3.c Comment out other modules conflicting with this module e.g.:
```xml
<!--     <module name="afstand" dir="standard/dk/afstand" permissionlevel="public"/> -->
<!--     <module name="spatialaddress" dir="standard/dk/spatialaddress" permissionlevel="public"/>    -->
```

### 3.d Include tool in profile(s):
```xml
<tool module="s4" name="s4-plugin" />
```
### 3.e Comment out other tools conflicting with this tool e.g.:

```xml
<!--     <tool module="spatialaddress" name="spatialaddress-plugin" /> -->
```

### 3.f include java library:

COPY \lib\dk.septima.spatialsuite.index-xx.jar TO \WEB-INF\lib

REMOVE old versions of the library

## 4. Configure your search index

### 4.a Create configuration folders


    WEB-INF/config/misc/custom/s4
    WEB-INF/config/misc/custom/s4/presentations

Or copy the examples

    Copy /s4/config-example/* to WEB-INF/config/misc/custom/s4

### 4.b Configure datasources to be searchable

Edit WEB-INF/config/misc/custom/s4/config.xml to include the datasources you want to index:

###Example config file
```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
	<endpoint>s4index</endpoint>
	<datasources>
		<datasource id="ds_akoler" presentation="s4-pres-skoler"/-->
	</datasources>
</config>
```

A corresponding presentation MUST exist in Edit WEB-INF/config/misc/custom/s4/presentations/

Each presentation MUST have the following columns

    <column format="heading"> : The title when presented as a search result
Each presentation MAY have the following columns

    <column format="searchstring"> : The text which is indexed and free text queried
	<column format="description"> : The description when presented as a search result
	<column format="hyperlink"> : A link which will be presented directly in the search result

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

## 5. Build the search index
When datasources and presentations are configured the search index has to bo built
### 5.a start site or reload configuration:
    http://localhost:8080/admin?command=reloadconfig
### 5.b Build the search index:
    http://localhost:8080/jsp/modules/s4/buildIndex.jsp
This URL may be called according to your desired workflow and integrated into:


    your data load script
    your start up script, or
    Regular intervals, eg. wget "http://localhost:8080/admin?command=reloadconfig" in task/cron scheduler

## 6. Customization of module

In most cases it is desired to make a custom version of the module to handle CSS specific design/layouts on your site and configure SeptimaSearch to search in municipal specific adresses and local municipal plans (PlansystemDK)

In this case, create a custom module containing only what is different from the standard s4 module. This custom module will override settings from the standard s4 module

### 6.a Create a custom __mys4__ module with following content (copy files from s4 module):


    [cbinfo.config.dir]/modules/custom/mys4
    [cbinfo.config.dir]/modules/custom/mys4/css/s4.css
    [cbinfo.config.dir]/modules/custom/mys4/tools/s4-plugin.xml

In [cbinfo.config.dir]/modules/custom/mys4/css/s4.css delete all content and only add what you need to override:

```css
.inputcontainer {
    top:5px;
}
```
### 6.b customize plugin
Next, rename the tool [cbinfo.config.dir]/modules/custom/mys4/tools/s4-plugin.xml to something else:


    [cbinfo.config.dir]/modules/custom/mys4/tools/s4-plugin-mycustomplugin.xml

Now, you have to edit this file to add customized CSS, enable/disable external search services and configure municipal code

Add path to the cusotm CSS file after the standard css file :

		<file type="css"    name="/modules/s4/css/s4.css" />
        <file type="css"    name="/modules/mys4/css/s4.css" />

Configure __municipality__ code and __enable/disable__ and other __options__  in the javascript part of cbinfo.config.dir]/modules/custom/mys4/tools/s4-plugin-mycustomplugin.xml
```javascript
          if (s4Params == undefined){
            var s4Params =
            {municipality: '101',
            view:{limit: 20, dynamiclayer: 'userdatasource', infoprofilepuery: 'userdatasource'},
            adresssearcher:{enabled: true, info: true, apiKey: "3F2504E0-4F89-11D3-9A0C-0305E82C3301"},
            cvrsearcher:{enabled: true, info: true},
            plansearcher:{enabled: true, info: true},
            indexsearcher:{enabled: true, info: true, datasources: "*"},
            clientsearcher:{enabled: true}};
	        s4_init (s4Params);
    	}else{
            throw "Only one (1) s4-plugin tool may be defined in a profile";
    	}
```



### 6.c Include the new customized module and tool

In your custom module [cbinfo.config.dir]/modules/custom/mys4, create a new deploy.xml file which deploys your customized CSS
```xml
<?xml version="1.0" encoding="UTF-8"?>
		<deploy>
		   <version>2.7.1</version>
		   <stoponerror>true</stoponerror>
		  <makedir dir="[cbinfo.wwwroot.dir]/modules/mys4/css"/>
		  <copyfile fromfile="[module:mys4.dir]/css/s4.css" tofile="[cbinfo.wwwroot.dir]/modules/mys4/css/s4.css"/>
		</deploy>
```


Finally, add the customized tool to your profile:
```xml
        <tool module="s4" name="s4-plugin"/>
        <tool module="myS4" name="s4-pluginmycustomplugin" />
```



Finished, now try out your profile