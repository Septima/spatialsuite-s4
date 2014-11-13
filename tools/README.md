#S4 - Septima Search for SpatialSuite  
##Tools included  
Please read the [general installation instructions](../../../#installation) before reading this  
Tools:
* [s4-plugin-dk-all (s4-plugin-all)](#s4-plugin-dk-all)  
* [s4-matrikel-plugin](#s4-matrikel-plugin)
* [s4-vejmidter-plugin](#s4-vejmidter-plugin)  
* [s4-eknap-plugin](#s4-eknap-plugin)  
* [s4ApiDemo](#apidemo)  
* [s4-requires](#s4-requires)  

  
###<a name="s4-plugin-dk-all"></a>s4-plugin-dk-all (s4-plugin-all)  
The main tool. Include this to enable search in Spatial Map  
* s4-plugin-dk-all includes some searchers only relevent in Denmark  
* s4-plugin-all is used used outside Denmark  
[Configuration instructions](../../../#s4customization)  

###<a name="s4-matrikel-plugin"></a>s4-matrikel-plugin  
Only relevant in Denmark  
Viser ikoner med links til BBR og SKAT for matrikler  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-matrikel-plugin" />
```  
  
###<a name="s4-vejmidter-plugin"></a>s4-vejmidter-plugin  
Only relevant in Denmark  
Dette er et tool, som understøtter søgning af veje uden husnumre (Understøttes ikke af geosearch), samt visning af vejgeometri når en vej er valgt i geosearch https://github.com/Septima/spatialsuite-s4/issues/45  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-vejmidter-plugin" />
```  
Sæt _streetNameHit_ til true i geosearcher-opsætningen i s4:  
```xml
geosearcher: {enabled: true, info: true, print: true, targets: ['adresser', 'stednavne', 'matrikelnumre', 'opstillingskredse', 'postdistrikter'], streetNameHit: true},
```  
Forbered en datasource:  
  
s4-vejmidter-plugin forventer, at der findes en datasource, som hedder _ds_s4_vejmidte_ med to commands:  
* read_search, som bliver kaldt med to parametre; [query] og [limit]. Skal returnere felterne heading og shape_wkt for veje uden husnumre. Returnér max [limit] veje.  
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
Vejmidtedata er genereret ud fra ”FOT Vejmidte brudt” hvor GST har lagt CPR-Vejkode på de fleste vejmidter (der er stumper af småveje der ikke er med).
Jeg har lavet et script i databasen, der aggregerer geometrien på baggrund af vejkoden og sætter attributten adresselos ved at teste vejkoden op i mod vores BBR-adressetabel. Dette script kører en gang i døgnet, så rettelser i vejmidten og test mod adresserne altid er ajour.
Scriptet deler jeg selvfølgeligt gerne, men det virker jo kun i SQL server.  

  
###<a name="s4-eknap-plugin"></a>s4-eknap-plugin  
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

###<a name="apidemo"></a>s4ApiDemo  
Tool which demonstrates the use of the S4 API. It's shown how you attach custom searchers to s4 and how you can listen to onSelect events. Read more about the API [https://github.com/Septima/spatialsuite-s4/wiki/S4-API]  

###<a name="s4-requires"></a>s4-requires  
Internal tool. Used by the other tools  



