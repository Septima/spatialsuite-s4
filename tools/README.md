#S4 - Septima Search for SpatialSuite  
##Tools included  
Please read the [general installation instructions](../../../#installation) before reading this  
Tools:
* [s4-plugin-dk-all (s4-plugin-all)](#s4-plugin-dk-all)  
* [s4-vejmidter-plugin](#s4-vejmidter-plugin)  
* [s4-eknap-plugin](#s4-eknap-plugin)  
* [s4ApiDemo](#apidemo)  
* [s4-requires](#s4-requires)  

  
###<a name="s4-plugin-dk-all"></a>s4-plugin-dk-all (s4-plugin-all)  
The main tool. Include this to enable search in Spatial Map  
* s4-plugin-dk-all includes some searchers only relevent in Denmark  
* s4-plugin-all is used used outside Denmark  
[Configuration instructions](../../../#s4customization)  

###<a name="s4-vejmidter-plugin">s4-vejmidter-plugin  
Only relevant in Denmark  
Dette er et tool, som understøtter søgning af veje uden husnumre (Understøttes ikke af gst), samt visning af vejgeometri når en vej er valgt i geosearch https://github.com/Septima/spatialsuite-s4/issues/45  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-vejmidter-plugin" />
```  
Forventer, at der findes en datasource, som hedder _ds_s4_vejmidte_ med to commands:  
* read_search, som bliver kaldt med to parametre; [query] og [limit]. Skal returnere felterne heading og shape_wkt for veje uden husnumre. Returnér max [limit] veje.  
* read_geometry, som bliver kaldt med parameteren [vejkode]. Skal returnere shape_wkt for vej.  
  
Eksempel:  
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
  
###<a name="s4-eknap-plugin ">s4-eknap-plugin  
Only relevant in Denmark  
Viser et E-Knap ikon for adresser og matrikler returneret fra geosearch  
Inkludér i profil:  
```xml
<tool module="s4" name="s4-eknap-plugin" />
```  
Hvis du ønsker E-Knap for andre typer søgeresultatere skal du kopiere toolet til tools/custom, tilpasse det, samt inkludere det i profil:  
Inkludér i profil:  
```xml
<tool dir="custom" name="s4-eknap-plugin" />
```  

###<a name="apidemo">s4ApiDemo  
Tool which demonstrates the use of the S4 API. It's shown how you attach custom searchers to s4 and how you can listen to onSelect events. Read more about the API [https://github.com/Septima/spatialsuite-s4/wiki/S4-API]  

###<a name="s4-requires">s4-requires  
Internal tool. Used by the other tools  



