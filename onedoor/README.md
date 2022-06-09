## <a name="s4OneDoorcustomization"></a>Customization of s4 OneDoor tool  

Customization of this tool is very similar to the [standard tool](#s4customization)  
The only specific entry is `s3searcher` which takes these three parameters: 
### Connection parameters
* host (mandatory)
* organisation (mandatory)
* configuration (mandatory)
* service (deprecated, organisation and configuration in one parameter)
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
  //organisation/service
  organisation: "septima",
  configuration: "demo",
  //Or service
  //service: "/api/v1/organisations/septima/configurations/demo", // deprecated organisation and configuration in one parameter
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
