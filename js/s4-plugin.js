var _s4View = null;
var _s4Params = null;
var _s4HoverOLids = [];

function s4_onPeak(result){
    cbKort.mapObj.deleteFeature(_s4HoverOLids);
    _s4HoverOLids = [];
    if (result !== null){
        var geojson = new OpenLayers.Format.GeoJSON();
        var olGeom;
        var wkt;
        if (result.route){
            olGeom = geojson.read(result.route.geometry, 'Geometry');
            wkt = olGeom.toString();
            _s4HoverOLids.push(cbKort.mapObj.drawWKT(wkt,
            null,
            {       styles: {
                    strokeColor: '#0470bd',
                    strokeWidth: 6,
                    strokeOpacity: 0.45
            }
            }));
        }
        if (result.geometry){
            olGeom = geojson.read(result.geometry, 'Geometry');
            wkt = olGeom.toString();
            _s4HoverOLids.push(cbKort.mapObj.drawWKT(wkt,
            null,
            {       styles: {
                    strokeColor: '#0470bd',
                    fillColor: '#0470bd',
                    fillOpacity: 0.5,
                    select_pointRadius: 10,
                    label: result.title
                    }
            }));
        }
    }
}

function s4_onInspect(result){
    cbKort.mapObj.deleteFeature(_s4HoverOLids);
    _s4HoverOLids = [];
    var geojson = new OpenLayers.Format.GeoJSON();
    var olGeom;
    var wkt;

    if (result.geometry){
        olGeom = geojson.read(result.geometry, 'Geometry');
        wkt = olGeom.toString();
        cbKort.dynamicLayers.addWKT ({name: _s4Params.view.dynamiclayer, wkt:wkt, clear:true});
    }
    
    if (result.route){
        olGeom = geojson.read(result.route.geometry, 'Geometry');
        wkt = olGeom.toString();
        cbKort.dynamicLayers.addWKT ({name: _s4Params.view.dynamiclayer, wkt:wkt, clear:false});
    }
    cbKort.dynamicLayers.zoomTo (_s4Params.view.dynamiclayer, _s4Params.view.zoomBuffer);
    
}

function s4_init (params){
    if (_s4View == null) {
        if (Septima.Log){
            Septima.Log.trace({
                eventCategory: 's4',
                eventAction: 's4_init',
                eventLabel: cbKort.getSession().getParam("s4.version") + "@" + cbKort.getSession().getParam("spatialmap.version")
            });
        }
    			
       		_s4Params = params;
       		var s4Locale = {
       		      "search": cbKort.getSession().getString('s4.search.placeholder'),
       		      "matches": cbKort.getSession().getString('s4.search.matches'),
       		      "close": cbKort.getSession().getString('s4.search.close'),
       		      "doDetails": cbKort.getSession().getString('s4.search.dodetails'),
                  "at_site": cbKort.getSession().getString('s4.search.at_site')
       		};
       		
            if (typeof _s4Params.view.placeholder !== 'undefined'){
                s4Locale.search = _s4Params.view.placeholder;
            }else{
                var placeHolder = cbKort.getSession().getParam("s4.search.placeholder");
                if (placeHolder !== "s4.search.placeholder"){
                    s4Locale.search = placeHolder;
                }
            }
            
       		Septima.Search.setLocale(s4Locale);
       		    
       		//Fix some defaults
       		if (typeof _s4Params.view.forcedblurOnSelect === 'undefined'){
       			_s4Params.view.forcedblurOnSelect = false;
       		}
    	
       		if (typeof _s4Params.view.zoomBuffer === 'undefined'){
       			_s4Params.view.zoomBuffer = '100';
       		}
       		
       		if (typeof _s4Params.view.marginToBottom === 'undefined'){
       			_s4Params.view.marginToBottom = 100;
       		}
       		
        	var searchIndexToken = null;
        	
        	if ((_s4Params.plansearcher && _s4Params.plansearcher.enabled) || (_s4Params.cvrsearcher && _s4Params.cvrsearcher.enabled)){
            	var searchIndexTokenParamName = 's4.searchchindex.token';
            	searchIndexToken = cbKort.getSession().getParam(searchIndexTokenParamName);
            	if (searchIndexToken === searchIndexTokenParamName){
            	    searchIndexTokenParamName = 's4.searchindex.token';
                    searchIndexToken = cbKort.getSession().getParam(searchIndexTokenParamName);
                    if (searchIndexToken === searchIndexTokenParamName){
                        //getParam returns paramName if param isn't defined
                        searchIndexToken = null;
                    }
            	}
        	}
        	
        	var sessionId = cbKort.sessionId;

            //Set up search input box
            var inputContainer = jQuery('<div id="s4box" class="inputcontainer"/>');
            var s4MenuItem = jQuery("li[id^=s4-plugin]");
        	if (jQuery("li[id^=s4-plugin]") && typeof params.panel !== 'undefined' && params.panel === 'tool' ){
        	    s4MenuItem.empty();
        	    s4MenuItem.addClass("inputcontainer-spacer");
        	    s4MenuItem.append(inputContainer);
        	}else{
                var panel = 'panel-brand';
                if (jQuery("#panel-brand").is(":visible") === false || jQuery("#panel-brand").height()<30) {
                    panel = 'panel-middle';
                }
                if (typeof params.panel !== 'undefined' && params.panel !== 'default') {
                    panel = params.panel;
                }

                s4MenuItem.remove();
                inputContainer.addClass('in-'+panel);
                
                if (panel === 'panel-brand'){
                    //Add spacer
                    jQuery("#panel-brand div.right").append('<div class="inputcontainer-spacer"></div>');
                    jQuery("#panel-brand div.right").append(inputContainer);
                } else if (panel === 'panel-middle'){
                    //Add spacer
                    jQuery('#panel-middle > .inner.right > .midnav').append('<li class="inputcontainer-spacer"></li>');
                    jQuery('#panel-middle > .inner.right').append(inputContainer);
                    
                    if (cbKort.themeSelector && cbKort.themeSelector.panels) {
                        var panel = cbKort.themeSelector.panels["panel-themes-headerleft"];
                        if (panel) {
                            var button = panel.getButton('theme_store_setting');
                            button.element.click(function () {
                                if (cbKort.themeSelector.editMode) {
                                    jQuery('.inputcontainer').hide();
                                } else {
                                    jQuery('.inputcontainer').show();
                                }
                            });
                        }
                    }                        
                } else if (panel === 'panel-top'){
                    jQuery('#panel-top > .inner.right > .topnav').append('<li class="inputcontainer-spacer"></li>');
                    jQuery('#panel-top > .inner.right').append(inputContainer);
                } else if (panel === 'menu'){
                    jQuery('#panel-middle > .inner.left > .midnav').append('<li class="inputcontainer-spacer"></li>');
                    jQuery('#panel-middle > .inner.left').append(inputContainer);
                }
        	}
            

            //Place inputcontainer according to the spacer
            inputContainer.offset(jQuery('.inputcontainer-spacer').offset());

            //Compensate for a delay in Chrome
            setTimeout(Septima.bind(function (inputContainer) {
                inputContainer.offset(jQuery('.inputcontainer-spacer').offset());
            }, this, inputContainer), 300);

            //onResize: Place inputcontainer according to the spacer
            jQuery(window).resize(Septima.bind(function (inputContainer) {
                setTimeout(Septima.bind(function (inputContainer) {
                    inputContainer.offset(jQuery('.inputcontainer-spacer').offset());
                }, this, inputContainer), 100);
            }, this, inputContainer));
            
            //Create controller
        	var blankBehavior = "search";
        	if (_s4Params.view.blankbehavior && _s4Params.view.blankbehavior == "none"){
        		blankBehavior = "none";
        	}
        	var controllerOptions = {blankBehavior: blankBehavior};
        	var controller = new Septima.Search.Controller([], controllerOptions);
        	controller.addOnPeakHandler(s4_onPeak);
            controller.addOnInspectHandler(s4_onInspect);
        	
        	//Set up the API
			//Create array of "OnSelect" listeners if not already created
			window["_s4OnSelect"] = window["_s4OnSelect"] || [];
			window["_s4Searchers"] = window["_s4Searchers"] || [];
			//Example:
			//window["_s4CustomButtons"].push({"buttonText":"xxxxx", "buttonImage": "url","callBack": function, "searcher": ["geosearcher"|"cvrsearcher"|"plansearcher"|"indexsearcher"|"themesearcher"|"profilesearcher"|"favoritesearcher"|"workspacesearcher"][, "target": ""]});
			window["_s4CustomButtons"] = window["_s4CustomButtons"] || [];

			
            if (_s4Params.dawasearcher && _s4Params.dawasearcher.enabled){
            	var dawaSearcherOptions = {onSelect: s4DawaHit};
            	if (_s4Params.municipality != "*"){
            		var municipalities = _s4Params.municipality.split(' ');
            		dawaSearcherOptions.kommunekode = municipalities.join('|');
            	}
            	if (typeof _s4Params.dawasearcher.minimumShowCount !== 'undefined'){
            		dawaSearcherOptions.minimumShowCount = _s4Params.dawasearcher.minimumShowCount;
            	}
            	var dawaSearcher = new Septima.Search.DawaSearcher(dawaSearcherOptions);
            	controller.addSearcher({"title": "Adresser", "searcher" : dawaSearcher});
                _s4Params.dawasearcher.searcher = dawaSearcher;
                
                _s4Params.adressSearcher = dawaSearcher;
            }
			
            //Collect searchers that have been pushed until now
            var _s4Searchers = window["_s4Searchers"];
            for (var i = 0;i<_s4Searchers.length;i++){
                var searcherReg = _s4Searchers[i];
                controller.addSearcher(searcherReg);
                if (searcherReg.info){
                    addInfoButtonToSearcher(searcherReg.searcher);
                }
                if (searcherReg.print){
                    addPrintButtonToSearcher(searcherReg.searcher);
                }
            }
            //Prepare for future pushes
            window["_s4Searchers"] = {
                    controller: controller,
                    push: function (searcherReg) {
                        this.controller.addSearcher(searcherReg);
                        if (searcherReg.info){
                            addInfoButtonToSearcher(searcherReg.searcher);
                        }
                        if (searcherReg.print){
                            addPrintButtonToSearcher(searcherReg.searcher);
                        }
                    }
            };
            
            if (_s4Params.indexsearcher && _s4Params.indexsearcher.enabled){
            	var s4IndexSearcherOptions = {onSelect: s4Hit, datasources: _s4Params.indexsearcher.datasources, allowDetails: _s4Params.indexsearcher.allowDetails};
                if (_s4Params.indexsearcher.blankbehavior){
                	s4IndexSearcherOptions.blankBehavior = _s4Params.indexsearcher.blankbehavior;
                }
            	var s4IndexSearcher = new Septima.Search.S4IndexSearcher(s4IndexSearcherOptions);
            	controller.addSearcher({title: "webgis", searcher: s4IndexSearcher});
                _s4Params.indexsearcher.searcher = s4IndexSearcher;
            }
        	
            if (_s4Params.geosearcher && _s4Params.geosearcher.enabled){
            	var gstAuthParams= s4_getGstAuthParams();
            	if (gstAuthParams != null){
                	var geoSearchOptions = {
                			targets: _s4Params.geosearcher.targets,
                			authParams: gstAuthParams,
                		    onSelect: s4GeoHit
                	};
                	if (_s4Params.municipality != "*"){
                	    geoSearchOptions.kommunekode = _s4Params.municipality;
                	}
                	var geoSearcher = new Septima.Search.GeoSearch(geoSearchOptions);
                	controller.addSearcher({"title": "geosearch", "searcher" : geoSearcher});
                    _s4Params.geosearcher.searcher = geoSearcher;
            	}
            }

            if (_s4Params.geostednavnesearcher && _s4Params.geostednavnesearcher.enabled){
                var gstAuthParams= s4_getGstAuthParams();
                var geoStednavnSearchOptions = {};
                if (gstAuthParams != null){
                    geoStednavnSearchOptions = {
                            authParams: gstAuthParams,
                            onSelect: s4GeoHit
                    };
                    if (_s4Params.municipality != "*"){
                        geoStednavnSearchOptions.kommunekode = _s4Params.municipality;
                    }
                    var geoStednavnSearcher = new Septima.Search.GeoStednavnSearcher(geoStednavnSearchOptions);
                    controller.addSearcher({"searcher" : geoStednavnSearcher});
                    _s4Params.geostednavnesearcher.searcher = geoStednavnSearcher;
                }
            }
            
            if (_s4Params.plansearcher && _s4Params.plansearcher.enabled && searchIndexToken !== null){
            	var planSearchOptions = {onSelect: s4Hit, searchindexToken: searchIndexToken};
            	if (_s4Params.municipality != "*"){
            		planSearchOptions.kommunekode = _s4Params.municipality
            	}
            	var planSearcher = new Septima.Search.PlanSearcher(planSearchOptions);
            	controller.addSearcher({"title": "Lokalplaner", "searcher" : planSearcher});
                _s4Params.plansearcher.searcher = planSearcher;
            }
        	
            if (_s4Params.cvrsearcher && _s4Params.cvrsearcher.enabled && searchIndexToken !== null){
            	var cvr_enhedSearchOptions = {onSelect: s4Hit, searchindexToken: searchIndexToken};
                if (_s4Params.municipality != "*"){
                    cvr_enhedSearchOptions.kommunekode = _s4Params.municipality
                }
            	var se = new Septima.Search.CVR_enhedSearcher(cvr_enhedSearchOptions);
            	controller.addSearcher({"title": "Virksomheder", "searcher" : se});
                _s4Params.cvrsearcher.searcher = se;
            }
        	
            if ((_s4Params.themesearcher && _s4Params.themesearcher.enabled) || (_s4Params.clientsearcher && _s4Params.clientsearcher.enabled)){
	            var themeSearcher = new Septima.Search.ThemeSearcher({onSelect: themeHit});
	            controller.addSearcher({"title": cbKort.getSession().getString('s4.themesearcher.themes'), "searcher" : themeSearcher});
                _s4Params.themesearcher.searcher = themeSearcher;
            }

            if (_s4Params.workspacesearcher && _s4Params.workspacesearcher.enabled && typeof workspace_init !== 'undefined'){
            	var workspaceSearcher = new Septima.Search.workspaceSearcher({
        			host: "",
        			onSelect: workspaceHit,
            		singular: cbKort.getSession().getString('s4.workspacesearcher.workspace'),
            		plural: cbKort.getSession().getString('s4.workspacesearcher.workspaces'),
            		sessionId: sessionId
        		});
            	controller.addSearcher({title: cbKort.getSession().getString('s4.workspacesearcher.workspaces'), searcher: workspaceSearcher});
                _s4Params.workspacesearcher.searcher = workspaceSearcher;
            }

            if (typeof(ProfileSelector) != 'undefined' && _s4Params.profilesearcher && _s4Params.profilesearcher.enabled){
            	var profileSearcher = new Septima.Search.ProfileSearcher({
        			host: "",
        			onSelect: profileHit,
            		singular: cbKort.getSession().getString('s4.profilesearcher.profile'),
            		plural: cbKort.getSession().getString('s4.profilesearcher.profiles'),
            		sessionId: sessionId
        		});
            	controller.addSearcher({title: cbKort.getSession().getString('s4.profilesearcher.profiles'), searcher: profileSearcher});
                _s4Params.profilesearcher.searcher = profileSearcher;
            }
            
            if (typeof(Favorites) != 'undefined' && _s4Params.favoritesearcher && _s4Params.favoritesearcher.enabled){
            	var favoriteSearcher = new Septima.Search.FavoriteSearcher({
        			host: "",
        			onSelect: favoriteHit,
            		singular: cbKort.getSession().getString('s4.favoritesearcher.favorite'),
            		plural: cbKort.getSession().getString('s4.favoritesearcher.favorites'),
            		sessionId: sessionId
        		});
        		controller.addSearcher({title: cbKort.getSession().getString('s4.favoritesearcher.favorites'), searcher: favoriteSearcher});
                _s4Params.favoritesearcher.searcher = favoriteSearcher;
            }

            //Collect custom buttons that have been pushed until now
			var _s4CustomButtons = window["_s4CustomButtons"];
			for (var i = 0;i<_s4CustomButtons.length;i++){
				var customButton = _s4CustomButtons[i];
				if (customButton.searcher && _s4Params[customButton.searcher] && _s4Params[customButton.searcher].searcher){
				    if (customButton.target){
	                    _s4Params[customButton.searcher].searcher.addCustomButtonDef(customButton, customButton.target);
				    }else{
	                    _s4Params[customButton.searcher].searcher.addCustomButtonDef(customButton);
				    }
				}
			}
			//Prepare for future pushes
			window["_s4CustomButtons"] = {
					push: function (customButton) {
						if (customButton.searcher && _s4Params[customButton.searcher] && _s4Params[customButton.searcher].searcher){
		                    if (customButton.target){
		                        _s4Params[customButton.searcher].searcher.addCustomButtonDef(customButton, customButton.target);
		                    }else{
		                        _s4Params[customButton.searcher].searcher.addCustomButtonDef(customButton);
		                    }
						}
					}
			};
        	
            //Create view 
        	_s4View = new Septima.Search.DefaultView({
        		input: inputContainer,
        		limit: _s4Params.view.limit,
        		controller: controller});
        	
        	s4SetMaxHeight();
        	
        	jQuery(window).resize(function() {
        		s4SetMaxHeight();
        	});
        	
        	if (typeof spm !== 'undefined' && typeof spm.getEvents !== 'undefined'){
                spm.getEvents().addListener("MAP_CLICKED", function() {
                    _s4View.blur(_s4Params.view.forcedblurOnSelect);
                });
        	}else{
                cbKort.mapObj.map.events.register("mousedown",cbKort.mapObj.map,function(e){
                    _s4View.blur(_s4Params.view.forcedblurOnSelect);
                }, true);
        	}
			
        	if (_s4Params.view.autofocus){
                setTimeout(Septima.bind(function (_s4View) {
            	_s4View.focus();
                }, this, _s4View),500);
        	}
            addS4SpatialMapTools(_s4Params.dawasearcher);
            addS4SpatialMapTools(_s4Params.geosearcher);
            addS4SpatialMapTools(_s4Params.geostednavnesearcher);
            addS4SpatialMapTools(_s4Params.cvrsearcher);
            addS4SpatialMapTools(_s4Params.plansearcher);
            addS4SpatialMapTools(_s4Params.indexsearcher);
    }
}

function s4SetMaxHeight(){
	if (_s4View != null && _s4View.top() !=null){
		_s4View.setMaxHeight(jQuery(window).height() - _s4View.top() - _s4Params.view.marginToBottom);
	}
}

function s4GeoHit(result){
    if (result.data && result.data.type){
        if (result.data.type != 'streetNameType' || (result.data.type == 'streetNameType' && _s4Params.streetNameHit)){
            s4Hit(result);
        }
    }
}

function s4DawaHit(result){
    if (result.data && result.data.type){
        if (result.data.type != 'vej' || (result.data.type == 'vej' && _s4Params.streetNameHit)){
            s4Hit(result);
        }
    }
}

function s4Hit(result, geometryBehavior){
	//geometryBehavior: ['zoom']
	//cbKort.events.fireEvent('S4', {type: 's4Hit', result: result});
    for (var i = 0; i < _s4OnSelect.length;i++){
		if (!_s4OnSelect[i](result)){
			return;
		}
	}
	if (result.geometry){
	    if (geometryBehavior !== 'undefined' && geometryBehavior == 'zoom'){
	        zoomToResultInMap(result);
	    }else{
	        showResultInMap(result);
	    }
	}
}

function zoomToResultInMap(result){
	if (result.geometry){
		var geojson = new OpenLayers.Format.GeoJSON();
	    var olGeom = geojson.read(result.geometry, 'Geometry');

	    cbKort.dynamicLayers.removeAll();
	    
	    var bounds = olGeom.getBounds();
	    var extent = 
        {  x1: bounds.left,
           y1: bounds.top,
           x2: bounds.right,
           y2: bounds.bottom
        };   
		
		cbKort.mapObj.zoomToExtent(extent, 100);
	}
    _s4View.blur(_s4Params.view.forcedblurOnSelect);
}

function s4SetMarkingGeometry(wkt, zoomTo, hide, buffer, callback){
    var mc = spm.getMapControl();
//    if(!mc._layers.markingLayer){
//        var markingLayer = mc._createImageVectorLayer();
//        mc._addLayer(markingLayer, "markingLayer");
//
//        markingLayer.setZIndex(11000);
//        markingLayer.setStyle(mc._getMarkingStyle());
//    }

    if (!wkt) {
        mc._layers.markingLayer.getSource().clear();
        return;
    }
    var feature = mc._wktFormatter.readFeature(wkt);
    mc._layers.markingLayer.getSource().clear();
    if (!hide)
        mc._layers.markingLayer.getSource().addFeature(feature);

    // zoom to fit
    if (zoomTo){
        var extent = feature.getGeometry().getExtent();
        mc.map.getView().fit(buffer != null ? ol.extent.buffer(extent, buffer) : extent, callback);
        mc._events.fireEvent("MARKING_CHANGED", wkt);
    }
}

function showResultInMap(result, callback){
	if (result.geometry){
	    var wktParser = Septima.Search.getWKTParser();
	    var wkt = wktParser.convert(result.geometry);
	    
	    if (typeof spm !== 'undefined' && typeof spm.dynamicLayers !== 'undefined'){
	        //SpS 4
	        
          var cb;
          if (typeof callback === 'undefined'){
              cb = function(){};
          }else{
              cb = callback;
          }
	        var sGeom = new SpatialServer.Geometry({wkt: wkt});
	        var mc = spm.getMapControl();
	        mc.setMarkingGeometry(sGeom, false, false, 50);
	        var feature = mc._wktFormatter.readFeature(wkt);
	        var extent = feature.getGeometry().getExtent();
	        mc.map.getView().fit(ol.extent.buffer(extent, 100), {callback: cb});
	        
	        
//	        s4SetMarkingGeometry(wkt, true, false, 50, cb)
//	        spm.dynamicLayers.destroy('userdatasource');
//	        spm.locateWKT ({dynamiclayer: 'userdatasource', wkt: wkt, buffer: 100, dontZoom:false});
//	        spm.dynamicLayers.destroy('userdatasource');
//	        spm.dynamicLayers.addWKT({
//	            name: 'userdatasource',
//	            wkt: wkt,
//	            clear: true,
//	            style:{}
//	        });
//	        spm.dynamicLayers.zoomTo('userdatasource', _s4Params.view.zoomBuffer);
//	        spm.dynamicLayers.show("userdatasource");
	    }else{
	        cbKort.dynamicLayers.addWKT ({name: _s4Params.view.dynamiclayer, wkt:wkt, clear:true});
	        cbKort.dynamicLayers.zoomTo (_s4Params.view.dynamiclayer, _s4Params.view.zoomBuffer);
	    }
	}
    _s4View.blur(_s4Params.view.forcedblurOnSelect);
}

function themeHit(result){
    _s4View.blur(_s4Params.view.forcedblurOnSelect);
    if (!result.data.theme.visible){
        result.searcher.toggleTheme(result);
    	cbKort.events.fireEvent('S4', {type: 'themeHit', theme: result.data});
    }
}

function favoriteHit(hit){
    _s4View.blur(_s4Params.view.forcedblurOnSelect);
	if (Favorites){
		Favorites.load(hit.data);
	}
	cbKort.events.fireEvent('S4', {type: 'favoriteHit', favorite: hit.data});
}

function profileHit(hit){
    _s4View.blur(_s4Params.view.forcedblurOnSelect);
	if (ProfileSelector){
		ProfileSelector.setProfile(hit.data);
	}
	cbKort.events.fireEvent('S4', {type: 'profileHit', profile: hit.data});
}

function workspaceHit(result){
    _s4View.blur(_s4Params.view.forcedblurOnSelect);
	result.searcher.showWorkSpace(result);
	cbKort.events.fireEvent('S4', {type: 'workspaceHit', workspace: result.data});
}


function s4DoInfo(result){
    showResultInMap(result);
    searchlast2.showDialog(result.title);
	cbKort.events.fireEvent('S4', {type: 's4DoInfo', result: result});
}

function s4DoPrint(result){
	if(typeof printObject !== 'undefined'){
		printObject.closeHandler();
	}
    showResultInMap(result, function(){
        print_getConfig(_s4Params.view.printconfig);
        }
    );
    //setTimeout(function(){print_getConfig(_s4Params.view.printconfig);}, 2000);
	
//	var freetext_print_input = jQuery('#' + _s4Params.view.printconfig + '_freetext_print_input');
//	if (freetext_print_input.length == 1){
//		freetext_print_input.val(result.title);
//	}else{
//		setTimeout(function(){jQuery('#' + _s4Params.view.printconfig + '_freetext_print_input').val(result.title);}, 500);
//	}
//	cbKort.events.fireEvent('S4', {type: 's4DoPrint', result: result});
}

function addS4SpatialMapTools(paramEntry){
    if (typeof paramEntry !== 'undefined' && typeof paramEntry.searcher !== 'undefined'){
        if (paramEntry.info){
            addInfoButtonToSearcher(paramEntry.searcher);
        }
        if (paramEntry.print){
            addPrintButtonToSearcher(paramEntry.searcher);
        }
    }
}

function addInfoButtonToSearcher(searcher){
    var s4InfoButtonCaption = cbKort.getSession().getString('s4.infobutton.caption');
    var _s4InfoUri = Septima.Search.s4Icons.infoIconUri;
    var s4InfoButtonDef = {"buttonText": s4InfoButtonCaption, "buttonImage": _s4InfoUri, "callBack": s4DoInfo};
    searcher.addCustomButtonDef(s4InfoButtonDef);
}

function addPrintButtonToSearcher(searcher){
    if (_s4Params.view.printconfig){
        var _s4PrintUri = Septima.Search.s4Icons.printIconUri;
        var s4PrintButtonCaption = "Print";
        var s4PrintButtonDef = {"buttonText": s4PrintButtonCaption, "buttonImage": _s4PrintUri,"callBack": s4DoPrint};  
        searcher.addCustomButtonDef(s4PrintButtonDef);
    }
}

function s4_getGstAuthParams(){
	var login = cbKort.getSession().getParam('s4.gst.login');
	var password = cbKort.getSession().getParam('s4.gst.password');
	return {login: login, password: password};
}

function Searchlast2()
{
    this.dialog;
    this.resultpage = 'spatialquery-getresult-html';
    this.defaultText = null;
    this.searchText = null;
}
Searchlast2.prototype.createDialog = function()
{
    if(!this.dialog)
    {
    	this.defaultText = cbKort.getSession().getString('spatialquery.lastdisplayed.hint');
        this.dialog = new Dialog(cbKort.getSession().getString('spatialquery.lastdisplayed.dialogtitle'));
        var h = '<table class="divtable" style="width:100%">' +
                '    <tr align="left">' +
                '        <td colspan="2" id="Searchlast2_searchtext">'+this.defaultText+'</td>' +
                '    </tr>' +
                '    <tr> ' +
                '      <td colspan="2"><span id="Searchlast2_options"></td>' +
                '    </tr>' +
                '    <tr style="height:5px"><td></td></tr>' +
                '    <tr align="right">' +
                '        <td colspan="2">' +
                '            <button class="menubutton" onclick="searchlast2.search();">'+cbKort.getSession().getString('standard.button.ok')+'</button>' +
                '        </td>' +
                '    </tr>' +
                '</table>';
        this.dialog.addContentHTML(h);
    }
    getElement('Searchlast2_options').innerHTML = spatialqueryoptions.getOptionDialogContent();
}
Searchlast2.prototype.showDialog = function(searchtext)
{
    this.createDialog();
    
	if (searchtext) {
		this.searchText = searchtext;
	    getElement('Searchlast2_searchtext').innerHTML = cbKort.getSession().getString('spatialquery.show_info_about')+' '+this.searchText;
	} else {
		this.searchText = null;
	    getElement('Searchlast2_searchtext').innerHTML = this.defaultText;
	}
        
    this.dialog.showDialog();
}
Searchlast2.prototype.closeDialog = function()
{
    if (this.dialog) {
        this.dialog.hideDialog();
    }
}
Searchlast2.prototype.search = function()
{
    try{
        showWaitingBox(cbKort.getSession().getString('standard.message.getting_data'));
    }catch (error){}
    
    this.closeDialog();
    
    var params = {
	    page: this.resultpage,
	    profilequery: 'userdatasource',
	    currentscale:cbKort.getCurrentScale(),
	    layers: cbKort.getLayers()
    };
    params = spatialqueryoptions.getOptionParams(params);
    
    for(var i=0;i < spatialquery_paramHandlers.length;i++)
    {
        var p = spatialquery_paramHandlers[i]();
        params[p.name] = p.value;
    }
    var url = cbKort.getUrl (params);
    
    var searchtext = (this.searchText || cbKort.getSession().getString('spatialquery.lastdisplayed.searchtext'));
    spatialquery_doQuery("userdatasource", url, searchtext, null);
    
    try{
        hideWaitingBox();
    }catch (error){}
}
var searchlast2 = new Searchlast2();

