--drop view s4.es
 CREATE OR REPLACE VIEW s4.es AS
 select
 a2.datasource,
 a1.featuretypesingle,
 a1.featuretypeplural,
 a2.title,
 a2.description,
 a3.searchstring,
 a2.wkt,
 st_geometryfromtext(wkt) as geom
 from s4.datasource a1 
 JOIN
 s4.feature a2 ON (a1.id = a2.datasource)
 JOIN
 (SELECT featureid, array_to_string(array_agg(term), ' ') as searchstring FROM s4.featureterm GROUP BY featureid) a3 ON (a2.featureid = a3.featureid)