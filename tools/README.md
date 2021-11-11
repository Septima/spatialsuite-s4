# S4 - Septima Search for SpatialSuite  
## Tools included in s4  
Please read the [general installation instructions](../../../#installation) before reading this  
  
### The main tool:    
* [s4-plugin-dk-all (s4-plugin-all)](#s4-plugin-dk-all)  

#### Show/Hide search box:    
* [s4-show-hide](#s4-show-hide)  
  
### Tools relevant for Denmark only:  
* Viser offentlige links til for adresser og matrikelnumre  
    * [s4-matrikel-plugin](#s4-matrikel-plugin)  
    * [s4-adresse-plugin](#s4-adresse-plugin)  
    * [s4-adresse-hgf-matrikel-plugin](#s4-adresse-hgf-matrikel-plugin) linker til _Hvad gælder for matriklen_.  

* Visning af- og søgning i vejmidter  
    * [s4-vis-dawa-vejmidter-plugin](#s4-vis-dawa-vejmidter-plugin)  
    * [s4-vis-egne-vejmidter-plugin](#s4-vis-egne-vejmidter-plugin)  
    * [s4-soeg-egne-vejmidter-plugin](#s4-soeg-egne-vejmidter-plugin)  
 
* Links vedrørende lokalplaner
    * [s4-plan-plugin](#s4-plan-plugin)  

* Link til cvr-info
    * [s4-cvr-virk-plugin](#s4-cvr-virk-plugin)
 
* Vis E-Knap   
    * [s4-eknap-plugin](#s4-eknap-plugin)  
  
* Link til JO FilArkiv for adresser og matrikelnumre   
    * [s4-jo-filarkiv-link-plugin](#s4-jo-filarkiv-link-plugin)  
  
* Link til LIFAOIS, tlExplorer og ejdExplorer for adresser og matrikelnumre   
    * [s4-lifa-links-plugin](#s4-lifa-links-plugin)  

* Link til COWI gadefoto for adresser og matrikelnumre
    * [s4-cowi-gadefoto-plugin](#s4-cowi-gadefoto-plugin)  
  
#### Tools using the details view function:  
* [s4-details-nearest-plugin](#s4-details-nearest-plugin)  
* [s4-details-spatialquery-plugin](#s4-details-spatialquery-plugin)  
* [s4-details-themesForIndex-plugin](#s4-details-themesForIndex-plugin)
* [s4-details-s4index-plugin](#s4-details-s4index-plugin)  
* [s4-details-dawa-dagi-plugin](#s4-details-dawa-dagi-plugin)  
* [s4-details-dawa-planer-plugin](#s4-details-dawa-planer-plugin)
* [s4-details-adresse-tinglysninger](#s4-details-adresse-tinglysninger)  
* [s4-details-themes-related-plugin](#s4-details-themes-related-plugin)  
* [s4-details-themes-tools-plugin](#s4-details-themes-tools-plugin)
* [s4-details-cvr-info](#s4-details-cvr-info)
* [s4-details-cvr-virksomheder-paa-adresse](#s4-details-cvr-virksomheder-paa-adresse)
* [s4-details-intersects-plugin](#s4-details-intersects-plugin)
* [s4-details-planinfo-plugin](#s4-details-planinfo-plugin)

API documentation:  
* [s4ApiDemo](#apidemo)  
    
### <a name="s4-plugin-dk-all"></a>s4-plugin-dk-all (s4-plugin-all)  
The main tool.  
[Customize the tool ](../../../#customization-of-s4-tool) and include to enable search in Spatial Map.  
      
_Please include this tool before any other s4 tool_    
```xml
<tool dir="custom" name="s4-plugin-dk-all" />
```  

S4 ships with two versions of the tool:  
* _s4-plugin-dk-all_ includes searchers only relevant in Denmark  
* _s4-plugin-all_ is used outside of Denmark  

### <a name="s4-show-hide"></a>Show/Hide search box  
This tools gives the user a menu item which shows/hides the search box  
Include in profile:  
```xml
<tool module="s4" name="s4-show-hide" panel="middle-right">
```  
To hide the search box from the start:    
```xml
<tool module="s4" name="s4-show-hide" panel="middle-right">
  <jsonconfig>
    {"hideFromStart": true}
  </jsonconfig>
</tool>
```   
### <a name="s4-matrikel-plugin"></a>s4-matrikel-plugin    
Only relevant in Denmark  
Viser ikoner med links til offentlige sites for jordstykker  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-matrikel-plugin" />
```  
Links kan konfigureres:  
Hvilke links, der vises kan styres således:  
```xml
<tool module="s4" name="s4-matrikel-plugin">
  <jsonconfig>
    {"links": ["jfa","bbrmeddelelse","ejendomsinfo.dk","boligejer.dk","vurdering","bbkort","ois", "geokoder", "retbbr", "skraafoto", "skraafoto_js", "sdfekort", "plankort"]}
  </jsonconfig>
</tool>
```  
Fjern de links du ikke ønsker at se

### <a name="s4-adresse-plugin"></a>s4-adresse-plugin  
Only relevant in Denmark  
Viser ikoner med links til offentlige sites for husnumre  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-adresse-plugin" />
```  
Links kan konfigureres:  
Hvilke links, der vises kan styres således:  
```xml
<tool module="s4" name="s4-adresse-plugin">
  <jsonconfig>
    {"links": ["jfa","bbrmeddelelse","ejendomsinfo.dk","boligejer.dk","vurdering","bbkort","ois", "geokoder", "retbbr", "skraafoto", "skraafoto_js", "sdfekort", "plankort"]}
  </jsonconfig>
</tool>
```  
Fjern de links du ikke ønsker at se
  
### <a name="s4-adresse-hgf-matrikel-plugin"></a>s4-adresse-hgf-matrikel-plugin  
Only relevant in Denmark  
Viser ikoner med links til offentlige sites for jordstykker, __samt__ _Hvad gælder for matriklen_ for husnummer  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-adresse-hgf-matrikel-plugin" />
```  
Links kan konfigureres:  
Hvilke links, der vises kan styres således:  
```xml
<tool module="s4" name="s4-adresse-hgf-matrikel-plugin">
  <jsonconfig>
    {"links": ["jfa","bbrmeddelelse","ejendomsinfo.dk","boligejer.dk","vurdering","bbkort","ois", "geokoder", "retbbr", "skraafoto", "skraafoto_js", "sdfekort", "plankort"]}
  </jsonconfig>
</tool>
```  
Fjern de links du ikke ønsker at se
  
### <a name="s4-sdfe-oblique-plugin"></a>s4-sdfe-oblique-plugin    
Only relevant in Denmark  
Udgået - erstattet af hhv [s4-matrikel-plugin](#s4-matrikel-plugin) og [s4-adresse-plugin](#s4-adresse-plugin)  
  
### <a name="s4-soeg-egne-vejmidter-plugin"></a>s4-soeg-egne-vejmidter-plugin  
Only relevant in Denmark  
Dette er et tool, som understøtter søgning i egne vejmidter.
Inkludér i profil:  
```xml
<tool module="s4" name="s4-soeg-egne-vejmidter-plugin" />
```  

Forbered en datasource _ds_s4_vejmidte_:  
  
s4-soeg-egne-vejmidter-plugin forventer, at der findes en datasource, som hedder _ds_s4_vejmidte_ med følgende command:  
* _read_search_, som bliver kaldt med to parametre; [query] og [limit]. Skal returnere felterne heading og shape_wkt for veje uden husnumre. Returnér max [limit] veje.  
  
Eksempel:  
Dette er den datasource, bruges i Silkeborg.  
```xml
<datasource endpoint="s4_vejmidte" name="ds_s4_vejmidte">
	<!-- https://github.com/Septima/spatialsuite-s4/wiki/Datasource-Searcher -->
       <table geometrycolumn="geom" name="testdata.vejmidte_aggregeret" pkcolumn="gid"/>
	<sql command="read_search">select vejnavn as heading, st_astext(geom) as shape_wkt
		from	testdata.vejmidte_aggregeret
		where	vejnavn ilike '[query]%'
				and adresselos  is null
		order	by vejnavn
		limit [limit];
	</sql>
</datasource>       
```  
Silkeborg skriver:  
Vejmidtedata er genereret ud fra FOT Vejmidte brudt hvor GST har lagt CPR-Vejkode på de fleste vejmidter (der er stumper af småveje der ikke er med).
Vi har lavet et script i databasen, der aggregerer geometrien på baggrund af vejkoden og sætter attributten adresselos ved at teste vejkoden op i mod vores BBR-adressetabel. Dette script kører en gang i døgnet, så rettelser i vejmidten og test mod adresserne altid er ajour.
Scriptet deler vi selvfølgeligt gerne, men det virker jo kun i SQL server.  

  
### <a name="s4-vis-egne-vejmidter-plugin"></a>s4-vis-egne-vejmidter-plugin  
Only relevant in Denmark  
Dette er et tool, som understøtter visning af vejgeometri når en vej er valgt i geosearch. Se https://github.com/Septima/spatialsuite-s4/issues/45.    
OBS: Dawa-searcheren kan vise vejmidter fra dawa, hvis du istedet bruger toolet [s4-vis-dawa-vejmidter-plugin](#s4-vis-dawa-vejmidter-plugin)  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-vis-egne-vejmidter-plugin" />
```  

Forbered en datasource _ds_s4_vejmidte_:  
  
s4-vejmidter-plugin forventer, at der findes en datasource, som hedder _ds_s4_vejmidte_ med følgende command:  
* _read_geometry_, som bliver kaldt med parameteren [vejkode]. Skal returnere shape_wkt for vej.  
  
Eksempel:  
Dette er den datasource, bruges i Silkeborg.  
```xml
<datasource endpoint="s4_vejmidte" name="ds_s4_vejmidte">
    <!-- https://github.com/Septima/spatialsuite-s4/wiki/Datasource-Searcher -->
       <table geometrycolumn="geom" name="testdata.vejmidte_aggregeret" pkcolumn="gid"/>
    <sql command="read_geometry">select st_astext(geom) as shape_wkt
        from    testdata.vejmidte_aggregeret
        where   cprvejkode = [vejkode];
    </sql>
</datasource>       
```  
Silkeborg skriver:  
Vejmidtedata er genereret ud fra FOT Vejmidte brudt hvor GST har lagt CPR-Vejkode på de fleste vejmidter (der er stumper af småveje der ikke er med).
Vi har lavet et script i databasen, der aggregerer geometrien på baggrund af vejkoden og sætter attributten adresselos ved at teste vejkoden op i mod vores BBR-adressetabel. Dette script kører en gang i døgnet, så rettelser i vejmidten og test mod adresserne altid er ajour.
Scriptet deler vi selvfølgeligt gerne, men det virker jo kun i SQL server.  

  
### <a name="s4-vis-dawa-vejmidter-plugin"></a>4-vis-dawa-vejmidter-plugin  
Only relevant in Denmark  
Viser vejmidter fra dawa når en vej er valgt  
```xml
<tool module="s4" name="4-vis-dawa-vejmidter-plugin" />
```  
  
### <a name="s4-eknap-plugin"></a>s4-eknap-plugin  
Only relevant in Denmark  
Viser et E-Knap ikon for adresser og matrikler returneret fra geosearch, samt for virksomheder returneret fra cvr-søgeren.  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-eknap-plugin" />
```  
Hvis du ønsker E-Knap for andre typer søgeresultater skal du kopiere toolet til tools/custom, tilpasse det, samt inkludere det i profil:  
Inkludér i profil:  
```xml
<tool dir="custom" name="s4-eknap-plugin" />
```  
For tilføje E-Knap for resultater fra dit lokale indeks skal du sætte target til _entalsformen_ af den presentation, der bruges i indekset. Eksempel:  
```javascript
_s4CustomButtons.push({"buttonText": "Vis ejeroplysninger for skolen", "buttonImage": _s4eKnapUri, "callBack": s4DoEKnap, "searcher": "indexsearcher", "target": "skole"});
```  
hvor ordet "skole" korresponderer med _text.value_ i presentation:  
```xml
<text name="overskrift" value="Skole" plural="Skoler"/>
```  

### <a name="s4-jo-filarkiv-link-plugin"></a>s4-jo-filarkiv-link-plugin  
Only relevant in Denmark  
Viser link til JO FilArkiv for adresser og matrikelnumre.  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-jo-filarkiv-link-plugin" />
```  
Sæt følgende parameter for at pluginnet virker:  
```xml
<!-- ========================================= -->
<!-- S4 mod JO FilArkiv -->
<!-- ========================================= -->
<param name="s4.jo.filarkiv.kommunenavn">xxx</param>
```  
Linker til "https://xxx.filarkiv.dk  

### <a name="s4-lifa-links-plugin"></a>s4-lifa-links-plugin  
Only relevant in Denmark  
Viser links til LIFAOIS, tlExplorer og ejdExplorer for adresser og matrikelnumre  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-lifa-links-plugin" />
```  
Sæt følgende parameter for at pluginnet virker:  
```xml
<!-- ========================================= -->
<!-- S4 mod LIFAOIS -->
<!-- ========================================= -->
<param name="s4.lifaois.uid">xxx</param>
<param name="s4.lifaois.pwd">xxx</param>
```  
Linker til "https://xxx.filarkiv.dk  


### <a name="s4-cowi-gadefoto-plugin"></a>s4-cowi-gadefoto-plugin  
Only relevant in Denmark  

Hvis modulet cowi-gadefoto findes i profilen vil det kunne aktiveres direkte fra s4 for adresser og matrikelnumre  

COWI gadefoto for adresser og matrikelnumre    

```xml
<tool module="s4" name="s4-cowi-gadefoto-plugin"/>
```  


### <a name="s4-cvr-virk-plugin"></a>s4-cvr-virk-plugin  
Only relevant in Denmark  

Link til cvr-info på virk.dk.  

```xml
<tool module="s4" name="s4-cvr-virk-plugin" />
```  

### <a name="s4-details-cvr-info"></a>s4-details-cvr-info  
Only relevant in Denmark  

Viser mange detaljer for produktionsenheder  

```xml
<tool module="s4" name="s4-details-cvr-info" />
```  

### <a name="s4-details-cvr-virksomheder-paa-adresse"></a>s4-details-cvr-virksomheder-paa-adresse    
Only relevant in Denmark

Viser alle produktionsenheder på et husnummer  

```xml
<tool module="s4" name="s4-details-cvr-virksomheder-paa-adresse" />
```  

### <a name="s4-plan-plugin"></a>s4-plan-plugin  
Only relevant in Denmark  
Viser ikon med link til plansystemets pdf for lokalplaner, kan konfigureres til også at vise links til Odeum og DKPlan  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-plan-plugin" />
```  

Sæt følgende parameter for at vise link til Odeum:  
```xml
<param name="s4.odeumClientName">odeumClientName</param>
```  
, hvor _odeumClientName_ er den del af urlen som bruges i ODEUM til din kommune. For url'en _http://plandk2.mapcentia.com/apps/custom/planurl/public/index.php/api/v1/url/__horsens__/lokalplaner.lpplandk2_join/xxx_ er det _horsens_.  

Sæt følgende parameter for at vise link til DKPlan:  
```xml
<param name="s4.dkPlanClientName">dkPlanClientName</param>
```  
, hvor _dkPlanClientName_ er den del af urlen som bruges i din kommune. For url'en _http://silkeborglokalplaner.viewer.dkplan.niras.dk/dkplan/dkplan.aspx?LokalplanNr=xxx_ er det _silkeborglokalplaner_.    
  
  
### <a name="apidemo"></a>s4ApiDemo  
Tool which demonstrates the use of the S4 API. It's shown how you attach custom searchers to s4 and how you can listen to onSelect events. Read more about the API [https://github.com/Septima/spatialsuite-s4/wiki/S4-API]  
  

### <a name="#s4-details-nearest-plugin"></a>s4-details-nearest-plugin    
For an address; show the nearest three features of each type in your s4 index.  
  
To customize, copy to tools/custom and follow the instructions in the _Customize HERE_ sections.

Include in profile:  
```xml
<tool module="s4" name="s4-details-nearest-plugin" />
```    

### <a name="#s4-details-themesForIndex-plugin"></a>s4-details-themesForIndex-plugin      
Show relevant themes for features from the s4 index.  

Include in profile:  
```xml
<tool module="s4" name="s4-details-themesForIndex-plugin" />
```    

### <a name="#s4-details-s4index-plugin"></a>s4-details-s4index-plugin  
Show all columns from presentations used to build the s4 index.  

Include in profile:  
```xml
<tool module="s4" name="s4-details-s4index-plugin" />
```    
  
### <a name="#s4-details-dawa-planer-plugin"></a>s4-details-dawa-planer-plugin  
Only relevant in Denmark.  

Vis planer for adressen.  

Inkludér in profil:  
```xml
<tool module="s4" name="s4-details-dawa-planer-plugin" />
```    

### <a name="s4-details-planinfo-plugin"></a>s4-details-planinfo-plugin    
Only relevant in Denmark  

Viser info om planer fra plansystemet

```xml
<tool module="s4" name="s4-details-planinfo-plugin" />
```  

### <a name="#s4-details-dawa-dagi-plugin"></a>s4-details-dawa-dagi-plugin  
Only relevant in Denmark.  
  
Vis DAGI-information d.v.s. kommune, opstillingskreds, politikreds, postdistrikt, region, retskreds og sogn for en adresse  

Inkludér in profil:  
```xml
<tool module="s4" name="s4-details-dawa-dagi-plugin" />
```    

Kopiér toolet til tools/custom, hvis du vil tilpasse det. 
 
### <a name="#s4-details-themes-related-plugin"></a>s4-details-themes-related-plugin    
Show other themes belonging to the themegroup  

Include in profile:  
```xml
<tool dir="custom" name="s4-details-themes-related-plugin" />
```    
  
### <a name="#s4-details-themes-tools-plugin"></a>s4-details-themes-tools-plugin  
Show tools (transparency, meetadata, copyright etc) for a theme.  

Include in profile:  
```xml
<tool dir="custom" name="s4-details-themes-tools-plugin" />
```    

### <a name="s4-details-intersects-plugin"></a>s4-details-intersects-plugin  
This tool will list intersections of a result with other searchers - it may use a proxy as intersect geometry. Can also show route between points  

The version shipped with s4 will not work in your setup - To customize, copy to tools/custom and follow the instructions in the _Customize HERE_ sections.
  
This tool is a very flexible tool - you might need assistance to set it up      


