#S4 - Septima Search for SpatialSuite  
##Tools included in s4  
Please read the [general installation instructions](../../../#installation) before reading this  
  
Tools:  
The main tool:    
* [s4-plugin-dk-all (s4-plugin-all)](#s4-plugin-dk-all)  
  
This tool creates icons for Spatial Map functions (Info and print)  
* [s4-buttons-spatialMapTools-plugin](#s4-buttons-spatialMapTools-plugin)  
  
Tools relevant for Denmark only:  
* [s4-matrikel-plugin](#s4-matrikel-plugin)  
* [s4-adresse-plugin](#s4-adresse-plugin)  
* [s4-vejmidter-plugin](#s4-vejmidter-plugin)  
* [s4-eknap-plugin](#s4-eknap-plugin)  
* [s4-planSystem-plugin](#s4-planSystem-plugin)  
* [s4-odeum-plugin](#s4-odeum-plugin)  
* [s4-dkPlan-plugin](#s4-dkPlan-plugin)  
  
  
Tools using the details view function:  
* [s4-details-nearest-plugin] (#s4-details-nearest-plugin)  
* [s4-details-spatialquery-plugin] (#s4-details-spatialquery-plugin)  
* [s4-details-themesForIndex-plugin] (#s4-details-themesForIndex-plugin)
* [s4-details-s4index-plugin] (#s4-details-s4index-plugin)  
* [s4-details-dawa-dagi-plugin] (#s4-details-dawa-dagi-plugin)  
  
Experimental tools:  
* [s4-details-guides-plugin] (#s4-details-guides-plugin)  
* [s4-details-help-plugin] (#s4-details-help-plugin)  

API documentation:  
* [s4ApiDemo](#apidemo)  
    
###<a name="s4-plugin-dk-all"></a>s4-plugin-dk-all (s4-plugin-all)  
The main tool.
[Customize this tool ](../../../#include-tool-in-profiles) and include to enable search in Spatial Map. Please read the [Configuration documentation](../../../#s4customization).  
      
_Please include the plugin _before_ any other s4 tool_    
```xml
	<tool dir="custom" name="s4-plugin-dk-all" />
```  
  
S4 ships with two versions of the tool:  
* _s4-plugin-dk-all_ includes searchers only relevant in Denmark  
* _s4-plugin-all_ is used used outside Denmark  
  
###<a name="s4-buttons-spatialMapTools-plugin"></a>s4-buttons-spatialMapTools-plugin    
This tools creates icons for Spatial Map functions (Info and print).  
  
  _Must_ be included.    
```xml
	<tool module="s4" name="s4-buttons-spatialMapTools-plugin" />
```    
  
###<a name="s4-matrikel-plugin"></a>s4-matrikel-plugin  
Only relevant in Denmark  
Viser ikoner med links til BBR, SKAT og jordforureningsattest fra DAI for matrikler  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-matrikel-plugin" />
```  
  
###<a name="s4-adresse-plugin"></a>s4-adresse-plugin  
Only relevant in Denmark  
Viser ikoner med links til BBR, SKAT og jordforureningsattest fra DAI for adresse fra Dawa  
Inklud�r i profil:  
```xml
<tool module="s4" name="s4-adresse-plugin" />
```  
  
###<a name="s4-vejmidter-plugin"></a>s4-vejmidter-plugin  
Only relevant in Denmark  
Dette er et tool, som underst�tter s�gning af veje uden husnumre (Underst�ttes ikke af geosearch), samt visning af vejgeometri n�r en vej er valgt i geosearch https://github.com/Septima/spatialsuite-s4/issues/45  
Inklud�r i profil:  
```xml
<tool module="s4" name="s4-vejmidter-plugin" />
```  

Forbered en datasource:  
  
s4-vejmidter-plugin forventer, at der findes en datasource, som hedder _ds_s4_vejmidte_ med to commands:  
* read_search, som bliver kaldt med to parametre; [query] og [limit]. Skal returnere felterne heading og shape_wkt for veje uden husnumre. Return�r max [limit] veje.  
* read_geometry, som bliver kaldt med parameteren [vejkode]. Skal returnere shape_wkt for vej.  
  
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
	<sql command="read_geometry">select	st_astext(geom) as shape_wkt
		from	testdata.vejmidte_aggregeret
		where	cprvejkode = [vejkode];
	</sql>
</datasource>       
```  
Jacob Nicolajsen skriver:  
Vejmidtedata er genereret ud fra �FOT Vejmidte brudt� hvor GST har lagt CPR-Vejkode p� de fleste vejmidter (der er stumper af sm�veje der ikke er med).
Jeg har lavet et script i databasen, der aggregerer geometrien p� baggrund af vejkoden og s�tter attributten adresselos ved at teste vejkoden op i mod vores BBR-adressetabel. Dette script k�rer en gang i d�gnet, s� rettelser i vejmidten og test mod adresserne altid er ajour.
Scriptet deler jeg selvf�lgeligt gerne, men det virker jo kun i SQL server.  

  
###<a name="s4-eknap-plugin"></a>s4-eknap-plugin  
Only relevant in Denmark  
Viser et E-Knap ikon for adresser og matrikler returneret fra geosearch, samt for virksomheder returneret fra cvr-s�geren.  
Inklud�r i profil:  
```xml
<tool module="s4" name="s4-eknap-plugin" />
```  
Hvis du �nsker E-Knap for andre typer s�geresultater skal du kopiere toolet til tools/custom, tilpasse det, samt inkludere det i profil:  
Inklud�r i profil:  
```xml
<tool dir="custom" name="s4-eknap-plugin" />
```  
For tilf�je E-Knap for resultater fra dit lokale indeks skal du s�tte target til _entalsformen_ af den presentation, der bruges i indekset. Eksempel:  
```javascript
_s4CustomButtons.push({"buttonText": "Vis ejeroplysninger for skolen", "buttonImage": _s4eKnapUri, "callBack": s4DoEKnap, "searcher": "indexsearcher", "target": "skole"});
```  
hvor ordet "skole" korresponderer med _text.value_ i presentation:  
```xml
<text name="overskrift" value="Skole" plural="Skoler"/>
```  

###<a name="s4-planSystem-plugin"></a>s4-planSystem-plugin  
Only relevant in Denmark  
Viser ikon med link til plansystemets pdf for lokalplaner  
Inklud�r i profil:  
```xml
<tool module="s4" name="s4-planSystem-plugin" />
```  
  
###<a name="s4-odeum-plugin"></a>s4-odeum-plugin  
Only relevant in Denmark  
Viser ikon med link til ODEUM for lokalplaner. (Du viderestilles til Plansystem.dk, hvis Odeum ikke har lokalplanen)  
Inklud�r i profil:  
```xml
<tool module="s4" name="s4-odeum-plugin" />
```  
S�t f�lgende parameter for at pluginnet virker:  
```xml
<param name="s4.odeumClientName">odeumClientName</param>
```  
, hvor _odeumClientName_ er den del af urlen som bruges i ODEUM til din kommune. For url'en _http://plandk2.mapcentia.com/apps/custom/planurl/public/index.php/api/v1/url/horsens/lokalplaner.lpplandk2_join/xxx_ er det _horsens_.  
  
###<a name="s4-dkPlan-plugin"></a>s4-dkPlan-plugin  
Only relevant in Denmark  
Viser ikon med link til Niras' DKplan for lokalplaner. (OBS: Linket anvender plannr s� hvis du klikker p� en plan i en anden kommune s� vises _din_ plan med det plannr.)  
Inklud�r i profil:  
```xml
<tool module="s4" name="s4-dkPlan-plugin" />
```  
S�t f�lgende parameter for at pluginnet virker:  
```xml
<param name="s4.dkPlanClientName">dkPlanClientName</param>
```  
, hvor _dkPlanClientName_ er den del af urlen som bruges i din kommune. For url'en _http://silkeborglokalplaner.viewer.dkplan.niras.dk/dkplan/dkplan.aspx?LokalplanNr=xxx_ er det _silkeborglokalplaner_.    
  
###<a name="apidemo"></a>s4ApiDemo  
Tool which demonstrates the use of the S4 API. It's shown how you attach custom searchers to s4 and how you can listen to onSelect events. Read more about the API [https://github.com/Septima/spatialsuite-s4/wiki/S4-API]  
  

###<a name="#s4-details-nearest-plugin"></a>s4-details-nearest-plugin    
For an address; show the nearest three features of each type in your s4 index.  
  
To customize, copy to tools/custom and follow the instructions in the _Customize HERE_ sections.

Include in profile:  
```xml
	<tool module="s4" name="s4-details-nearest-plugin" />
```    

###<a name="#s4-details-spatialquery-plugin"></a>s4-details-spatialquery-plugin      
Perform a standard Spatial Suite spatial query against your _local_ datasources.  
  
To customize, copy to tools/custom and follow the instructions in the _Customize HERE_ sections.

Include in profile:  
```xml
	<tool module="s4" name="s4-details-spatialquery-plugin" />
```    

###<a name="#s4-details-themesForIndex-plugin"></a>s4-details-themesForIndex-plugin      
Show relevant themes for features from the s4 index.  

Include in profile:  
```xml
	<tool module="s4" name="s4-details-themesForIndex-plugin" />
```    

###<a name="#s4-details-s4index-plugin"></a>s4-details-s4index-plugin  
Show all columns from presentations used to build the s4 index.  

Include in profile:  
```xml
	<tool module="s4" name="s4-details-s4index-plugin" />
```    
  
###<a name="#s4-details-dawa-dagi-plugin"></a>s4-details-dawa-dagi-plugin  
Vis DAGI-information for adresse.  

Inkludér in profil:  
```xml
    <tool module="s4" name="s4-details-dawa-dagi-plugin" />
```    
  
###<a name="#s4-details-guides-plugin"></a>s4-details-guides-plugin  
Let your users search and discover your Spatial Map guides.  
  
Copy the tool to tools/custom.

Include in profile:  
```xml
	<tool dir="custom" name="s4-details-guides-plugin" />
```    
    
###<a name="#s4-details-help-plugin"></a>s4-details-help-plugin    
Let your users search and the built-in Spatial Map on-line help  
  
Copy the tool to tools/custom.

Include in profile:  
```xml
	<tool module="s4" name="s4-details-help-plugin" />
```   


