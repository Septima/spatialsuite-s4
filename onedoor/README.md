## Shows OneDoor results and details in Spatial Map (all configuration is done in OneDoor)  

Copy the tool `.../modules/custom/thirdparty/s4/tools/s4-plugin-onedoor.xml`  
to `.../tools/custom/s4-plugin-onedoor.xml`  

Include in profile
```xml
<tool dir="custom" name="s4-plugin-onedoor" />
```  

[Customize](#Customization-of-s4-OneDoor-tool) to your needs

### Detail plugins  

#### These standard s4 plugins may be used with s4-plugin-onedoor  
- [s4-eknap-plugin](../tools/#s4-eknap-plugin)
- [s4-cowi-gadefoto-plugin](../tools/#s4-cowi-gadefoto-plugin)
- [s4-show-hide](../tools/#s4-show-hide)
- [s4-details-themes-related-plugin](../tools/#s4-details-themes-related-plugin)

#### These tools are specifically for use with s4-plugin-onedoor and emulate clicking on big map in OneDoor  
- s4-onedoor-mapclick-plugin - creates an ${\color{orange}orange}$  cross hair icon in search box. **Show results in s4**  
- s4-onedoor-mapclick - creates a **menu item** i Spatial Map - **Open result in OneDoor Web**  

**__Requirement__**  
A geometry Searcher __must__ be defined in OneDoor:  
```yaml  
  geometrysearcher:
    _type: Septima.Search.ClientSearcher
    _options:
      singular: Geometry
      plural: Geometries
      isAsync: false
      usesGeoFunctions: true
      provider:
        _type: Septima.Search.GeometrySearchProvider
    detailhandlers:
      - ...
      - ...
```  
and registered with the controller:  
```yaml  
    - _ref: $.searchers.geometrysearcher # kun til geografiske opslag
```  


## Profile example:
```javascript  
<tool module="s4" name="s4-eknap-plugin" />
<tool module="s4" name="s4-cowi-gadefoto-plugin"/>
<tool module="s4" name="s4-show-hide" panel="top-right">
      <jsonconfig>
        {"hideFromStart": false}
      </jsonconfig>
</tool>
<tool module="s4" name="s4-details-themes-related-plugin" />
<tool module="s4" name="s4-onedoor-mapclick-plugin">
  <jsonconfig>
  <!-- jsonconfig er kun nødvendig, hvis man vil ændre defaults: search/Geometries/Geometry-->
      {"mode": "search",
      "source": "Geometries",
      "type": "Geometry"}
  </jsonconfig>
</tool>
<tool module="s4" name="s4-onedoor-mapclick">
  <jsonconfig>
  <!-- jsonconfig er kun nødvendig, hvis man vil ændre defaults: link/Geometries/Geometry-->
      {"mode": "link",
      "source": "Geometries",
      "type": "Geometry"}
  </jsonconfig>
</tool>
```

## <a name="s4OneDoorcustomization"></a>Customization of s4 OneDoor tool  

Customization of this tool is very similar to the standard tool
The only specific entry is `s3searcher` which takes these three parameters: 
### Connection parameters
* host (mandatory)
* organisation (mandatory)
* configuration (mandatory)
* showLinkToWeb (optional default: false)
* authorization (optional)

Speak to your OneDoor admin to obtain the correct values  

```javascript  
//  'panel-brand': Force s4 to panel-brand 
//  'menu': As the last menu in the menu line
//  'tool': Use the panel as specified in the profile
//  'panel-top': Force s4 to top menu
//  'default': same as map-top-right
//  'panel-middle': Force s4 to menu linie (right justified)
//  'map-top-right': SpS 4.1+ only
panel: 'default',

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
  printconfig: 'rotated_contact',
  forcedblurOnSelect: 'false',
  zoomBuffer: '100',
  marginToBottom: 100,
  placeholder: "Søg" 
},
                
//Septima Search Server
s3searcher: {
  enabled: true,
  info: true,
  print: true,
  showLinkToWeb: false,  // optional default false
  host: "https://onedoor.test.septima.dk",
  organisation: "septima",
  configuration: "demo",
  authorization: {Bearer: {token: "xxxxxxxxx"} } // optional
},

//Themes in profile
themesearcher: {enabled: true},
	            
//Profiles
profilesearcher: {enabled: true},
	            
//Favorites
favoritesearcher: {enabled: true},
	            
//Workspaces
workspacesearcher: {enabled: true},
                
//History
//Promote: show history icon in search input
//persist: Remember history between sessions
historysearcher: {enabled: false, promote: true, persist: true},

//SpS projection
//Any other projection than epsg:25832 MUST be defined here
projection_epsg: {code: "epsg:25832", def: "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"}
```  
