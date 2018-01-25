# S4 - Septima Search for SpatialSuite  
## Tools included in s4  
Please read the [general installation instructions](../../../#installation) before reading this  
  
The main tool:    
* [s4-plugin-dk-all (s4-plugin-all)](#s4-plugin-dk-all)  
  
Tools relevant for Denmark only:  
* Viser ikoner med links til BBR, SKAT og jordforureningsattest fra DAI for adresser og matrikler  
    * [s4-matrikel-plugin](#s4-matrikel-plugin)  
    * [s4-adresse-plugin](#s4-adresse-plugin)  
    * [s4-adresse-hgf-matrikel-plugin](#s4-adresse-hgf-matrikel-plugin) linker til _Hvad gælder for matriklen_.  

 
* Visning af- og søgning i vejmidter  
    * [s4-vis-dawa-vejmidter-plugin](#s4-vis-dawa-vejmidter-plugin)  
    * [s4-vis-egne-vejmidter-plugin](#s4-vis-egne-vejmidter-plugin)  
    * [s4-soeg-egne-vejmidter-plugin](#s4-soeg-egne-vejmidter-plugin)  

 
* Links vedrørende lokalplaner
    * [s4-planSystem-plugin](#s4-planSystem-plugin)  
    * [s4-odeum-plugin](#s4-odeum-plugin)  
    * [s4-dkPlan-plugin](#s4-dkPlan-plugin)  

* Link til cvr-info
    * [s4-cvr-virk-plugin](#s4-cvr-virk-plugin)
 
* Vis E-Knap   
    * [s4-eknap-plugin](#s4-eknap-plugin)  
  
Tools using the details view function:  
* [s4-details-nearest-plugin](#s4-details-nearest-plugin)  
* [s4-details-spatialquery-plugin](#s4-details-spatialquery-plugin)  
* [s4-details-themesForIndex-plugin](#s4-details-themesForIndex-plugin)
* [s4-details-s4index-plugin](#s4-details-s4index-plugin)  
* [s4-details-dawa-dagi-plugin](#s4-details-dawa-dagi-plugin)  
* [s4-details-dawa-planer-plugin](#s4-details-dawa-planer-plugin)
* [s4-details-adresse-tinglysninger](#s4-details-adresse-tinglysninger)  
* [s4-details-themes-related-plugin](#s4-details-themes-related-plugin)  
* [s4-details-themes-tools-plugin](#s4-details-themes-tools-plugin)
 
* Experimental tools:  
    * [s4-details-guides-plugin](#s4-details-guides-plugin)  
    * [s4-details-help-plugin](#s4-details-help-plugin)  
 
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
  
### <a name="s4-buttons-spatialMapTools-plugin"></a>s4-buttons-spatialMapTools-plugin    
This tools creates icons for Spatial Map functions (Info and print).  
  
  _Must_ be included.    
```xml
<tool module="s4" name="s4-buttons-spatialMapTools-plugin" />
```    
  
### <a name="s4-matrikel-plugin"></a>s4-matrikel-plugin  
Only relevant in Denmark  
Viser ikoner med links til BBR, SKAT og jordforureningsattest fra DAI for matrikler  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-matrikel-plugin" />
```  
  
### <a name="s4-adresse-plugin"></a>s4-adresse-plugin  
Only relevant in Denmark  
Viser ikoner med links til BBR, SKAT og jordforureningsattest fra DAI for adresse fra Dawa  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-adresse-plugin" />
```  
  
### <a name="s4-adresse-hgf-matrikel-plugin"></a>s4-adresse-hgf-matrikel-plugin  
Only relevant in Denmark  
Viser ikoner med links til BBR, SKAT, jordforureningsattest fra DAI samt _Hvad gælder for matriklen_ for adresse fra Dawa  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-adresse-hgf-matrikel-plugin" />
```  
  
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

### <a name="s4-cvr-virk-plugin"></a>s4-cvr-virk-plugin  
Only relevant in Denmark  

Link til cvr-info på virk.dk.  

```xml
<tool module="s4" name="s4-cvr-virk-plugin" />
```  

### <a name="s4-planSystem-plugin"></a>s4-planSystem-plugin  
Only relevant in Denmark  
Viser ikon med link til plansystemets pdf for lokalplaner  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-planSystem-plugin" />
```  
  
### <a name="s4-odeum-plugin"></a>s4-odeum-plugin  
Only relevant in Denmark  
Viser ikon med link til ODEUM for lokalplaner. (Du viderestilles til Plansystem.dk, hvis Odeum ikke har lokalplanen)  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-odeum-plugin" />
```  
Sæt følgende parameter for at pluginnet virker:  
```xml
<param name="s4.odeumClientName">odeumClientName</param>
```  
, hvor _odeumClientName_ er den del af urlen som bruges i ODEUM til din kommune. For url'en _http://plandk2.mapcentia.com/apps/custom/planurl/public/index.php/api/v1/url/__horsens__/lokalplaner.lpplandk2_join/xxx_ er det _horsens_.  
  
### <a name="s4-dkPlan-plugin"></a>s4-dkPlan-plugin  
Only relevant in Denmark  
Viser ikon med link til Niras' DKplan for lokalplaner. (OBS: Linket anvender plannr så hvis du klikker på en plan i en anden kommune så vises _din_ plan med det plannr.)  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-dkPlan-plugin" />
```  
Sæt følgende parameter for at pluginnet virker:  
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

### <a name="#s4-details-spatialquery-plugin"></a>s4-details-spatialquery-plugin      
Perform a standard Spatial Suite spatial query against your _local_ datasources.  
  
To customize, copy to tools/custom and follow the instructions in the _Customize HERE_ sections.

Include in profile:  
```xml
<tool module="s4" name="s4-details-spatialquery-plugin" />
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

Vis vedtaget lokalplan for adressen.  

Inkludér in profil:  
```xml
<tool module="s4" name="s4-details-dawa-planer-plugin" />
```    
  
### <a name="#s4-details-dawa-dagi-plugin"></a>s4-details-dawa-dagi-plugin  
Only relevant in Denmark.  
  
Vis DAGI-information for adresse.  

Inkludér in profil:  
```xml
<tool module="s4" name="s4-details-dawa-dagi-plugin" />
```    
  
### <a name="#s4-details-adresse-tinglysninger"></a>s4-details-adresse-tinglysninger  
Vis Link til Tingbogen for en adresse.  

Inkludér in profil:  
```xml
<tool module="s4" name="s4-details-adresse-tinglysninger" />
```    
  
### <a name="#s4-details-themes-related-plugin"></a>s4-details-themes-related-plugin    
Show other themes belonging to the themegroup  

Include in profile:  
```xml
<tool dir="custom" name="s4-details-themes-related-plugin" />
```    
  
### <a name="#s4-details-themes-tools-plugin"></a>s4-details-themes-tools-plugin  
Show tools (transparency, meetadat, copyright etc) for a theme.  

Include in profile:  
```xml
<tool dir="custom" name="s4-details-themes-tools-plugin" />
```    
  
### <a name="#s4-details-guides-plugin"></a>s4-details-guides-plugin  
Let your users search and discover your Spatial Map guides.  
  
Copy the tool to tools/custom.

Include in profile:  
```xml
<tool dir="custom" name="s4-details-guides-plugin" />
```    
    
### <a name="#s4-details-help-plugin"></a>s4-details-help-plugin    
Let your users search and the built-in Spatial Map on-line help  
  
Include in profile:  
```xml
<tool module="s4" name="s4-details-help-plugin" />
```   


