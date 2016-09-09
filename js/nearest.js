    	var s4NearestHoverOLids = [];
    	
    	function createNearestHandlerDef(searchers, options){
    		var sqDetailsHandlerBuilderOptions = {
				searchers: searchers,
				distanceFilter: 'all',
				limit: options.limit ? options.limit : 3,
				title: options.title ? options.title : cbInfo.getString('s4.nearest.caption'),
	    		selectButtonCaption: cbInfo.getString('s4.showinmap.caption'),
	    		header: {
	   				button: {
	   					buttonText: cbInfo.getString('s4.sq.header.text'),
	   					buttonImage: Septima.Search.s4Icons.zoomToExtentIcon,
	   					callBack: function(sqInfo){
	   						if (sqInfo.hitResults.length > 0){
		   						var geojson = new OpenLayers.Format.GeoJSON();
		   						var components = [];
		   						for (var i=0;i < sqInfo.hitResults.length;i++){
		   							components.push(geojson.read(sqInfo.hitResults[i].geometry, 'Geometry'));
		   						}
		   						components.push(geojson.read(sqInfo.mainResult.geometry, 'Geometry'));
		   						var collection = new OpenLayers.Geometry.Collection(components);
		   						collection.calculateBounds();
		   						var bounds = collection.getBounds();
							    var extent = 
						        {  x1: bounds.left,
						           y2: bounds.top,
						           x2: bounds.right,
						           y1: bounds.bottom
						        };   
								cbKort.mapObj.zoomToExtent(extent, 100);
	   						}
	   					}
	   				}
	    		},
	   			noResults:{
	   				icon: Septima.Search.icons.infoRed,
	    			caption: cbInfo.getString('s4.sq.noresults.caption'),
	    			text:  cbInfo.getString('s4.sq.noresults.text')
	   			},
				imageUri: _s4Params.indexsearcher.searcher.iconsMapPointGrey
    		}
    		if (options.proxySearcher && options.proxySearcher !== null){
    			sqDetailsHandlerBuilderOptions.geometryPreProcessor = Septima.bind(function(proxySearcher, result){
					var deferred = jQuery.Deferred();
					var resultWKT = result.searcher.translateGeoJsonObjectToWkt(result.geometry);
					proxySearcher.sq({limit: 1, wkt: resultWKT}).done(Septima.bind(function(deferred, result, sqResult){
						var results = sqResult.getAllResults();
						if (results.length > 0){
							deferred.resolve({queryGeometry: results[0].geometry, distGeometry: result.geometry});
						}else{
							deferred.resolve(null);
						}
					}, this, deferred, result));
					return deferred.promise();
				}, this, options.proxySearcher);
    		}else{
    			sqDetailsHandlerBuilderOptions.geometryPreProcessor = function(result){
					var deferred = jQuery.Deferred();
					deferred.resolve({queryGeometry: null, distGeometry: result.geometry});
					return deferred.promise();
				};
    		}
    		
			var sqDHB = new Septima.Search.SqDetailsHandlerBuilder(sqDetailsHandlerBuilderOptions);
			if (options.showRoute){
				var routeApiKey = cbInfo.getParam("module.route.token");
				if (routeApiKey !== "module.route.token"){
					var routeProfile = "car";
					if (options.routeProfile){
						routeProfile = options.routeProfile;
					}
					require(['https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.12/proj4.js'], Septima.bind(function (sqDHB, proj4) {
						sqDHB.addResultsProcessor(function(sqInfo){
							//{mainResult: mainResult, hitResults: allResults};
							var deferred = jQuery.Deferred();
							var crs25832 = {"type": "name", "properties": {"name": "EPSG:25832"}};
							var result = sqInfo.mainResult;
							result.geometry.crs = crs25832;
							var hitResults = sqInfo.hitResults;
							var featureCollection = {"type": "FeatureCollection", "crs": crs25832, "features": []};
							for (var i = 0; i < hitResults.length; i++){
								featureCollection.features.push({"type": "Feature", "geometry": hitResults[i].geometry});
							}
							var RouteCalculator = new Septima.Search.RouteCalculator({
							    fromResult: result,
								toFeatureCollection: featureCollection,
								apikey: routeApiKey,
								proj4: proj4,
								profile: routeProfile});
							
							RouteCalculator.calculate().done(Septima.bind(function(hitResults, deferred, featureCollection){
								for (var i =0;i < hitResults.length;i++){
									if (featureCollection.features[i].route){
										hitResults[i].route = featureCollection.features[i].route;
										hitResults[i].distance = featureCollection.features[i].route.dist;
									}
								}
								deferred.resolve();
							}, this, hitResults, deferred));
							
							return deferred.promise();
						});
		    		}, this, sqDHB));
				}
			}
    			
			return sqDHB.buildHandlerDef();
    	}