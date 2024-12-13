var _s4View = null;
var _s4Params = null;
var _s4HoverOLids = [];
var _s4WktParser = null;
var _s4InputContainer
var _s4_projection_epsg_code = "epsg:25832";
var _s4Controller

function s4_getResult(source, type, id) {
    return _s4Controller.get(source, type, id)
}

function s4_showResult(result) {
    _s4Controller.onSelect(result, _s4View);
}

function s4_getVisible() {
    return !_s4InputContainer.hasClass("s4Hidden");
}

function s4_setVisible(visible) {
    if (visible)
        _s4InputContainer.removeClass("s4Hidden");
    else
        _s4InputContainer.addClass("s4Hidden");
}

function s4_onDetailItemHover(detailItem){
    s4_clearHoverLayer();

    if (detailItem !== null && detailItem.valueformat == 'geometry' && detailItem.value) {
        s4_addDetailItemToHoverLayer(detailItem);
    }
}


function s4_onDetailItemFocus(detailItem){
    s4_clearHoverLayer();

    if (detailItem !== null && detailItem.valueformat == 'geometry' && detailItem.value) {
        s4_setMarkingGeometry(detailItem.value);
    }
}

function s4_onResultHover(result, infoItems){
    s4_clearHoverLayer();
    
    if (result !== null && result.geometry) {
        s4_addResultToHoverLayer(result);
        if (infoItems) {
            let itemsWithGeometry = s4_getItemsWithGeometry(infoItems);
            for (var i = 0; i < itemsWithGeometry.length; i++ ) {
                var itemWithGeometry = itemsWithGeometry[i];
                s4_addDetailItemToHoverLayer(itemWithGeometry);
            }
        }
    }
}

function s4_getItemsWithGeometry(infoItems) {
    let itemsWithGeometry = [];
    for (var i = 0; i < infoItems.length; i++) {
        infoItem = infoItems[i];
        if (infoItem.valueformat == 'geometry' && infoItem.value)
            itemsWithGeometry.push(infoItem)
    }
    return itemsWithGeometry;
}

function s4_addDetailItemToHoverLayer(detailItem) {
    if (detailItem !== null && detailItem.valueformat == 'geometry' && detailItem.value) {
        var feature = s4_SSGeomToFeature(detailItem.value)
        
        if (detailItem.type == 'labelvalue' && detailItem.label)
            feature.attributes.label = detailItem.label;
        s4_getHoverLayer().addFeature(feature);
    }
}

function s4_addResultToHoverLayer(result) {
    if (result.geometry) {
        var feature = s4_SSGeomToFeature(result.geometry)
        feature.attributes = {type: 'result', geometryType: result.geometry.type};

        if (result.title)
            feature.attributes.label = result.title;
        
        s4_getHoverLayer().addFeature(feature, true, true);
    }
}

function s4_onResultFocus(result){
    s4_clearHoverLayer();

    if (result !== null) {
        s4_setMarkingGeometry(result.geometry);
    }
}

function s4_processDetailItem(orgDetailItem) {
    if (orgDetailItem.valueformat == "geometry") {
      return {
        type: "labelvalue",
        label: orgDetailItem.label,
        value: orgDetailItem.label,
        onHover: s4_onDetailItemHover,
        onFocus: s4_onDetailItemFocus,
        focusIcon: Septima.Search.icons.globe
      }
    } else {
      return orgDetailItem
    }
}

function s4_clearHoverLayer() {
    s4_getHoverLayer().clearFeatures();
}

function showResultInMap(result, callback){
    if (result.geometry){
        s4_setMarkingGeometry(result.geometry);
        if (typeof callback != 'undefined'){
            callback();
        }
    }
    _s4View.blur(_s4Params.view.forcedblurOnSelect);
}

//Tegnefunktioner
function s4_setMarkingGeometry(geometry) {
    if (geometry) {
        var wkt = s4_SSGeomToWkt(geometry);
        var mc = spm.getMapControl();
        mc.setMarkingGeometry(wkt, true, false, _s4Params.view.zoomBuffer);
    }
}

function s4_getHoverLayer(){
    if (typeof this.hoverLayer == 'undefined'){
        var resultFill = new ol.style.Fill({
            color: 'rgba(0,81,162,0.6)'
        });
        var resultStroke = new ol.style.Stroke({
            color: 'rgba(0,81,162,0.8)',
            width: 2
        });
        var resultCircle = new ol.style.Circle({
            fill: resultFill,
            stroke: resultStroke,
            radius: 8
        });
        var otherFill = new ol.style.Fill({
            color: 'rgba(255,150,0,0.6)'
        });
        var otherStroke = new ol.style.Stroke({
            color: 'rgba(255,150,0,0.8)',
            width: 3
        });
        var otherCircle = new ol.style.Circle({
            fill: otherFill,
            stroke: otherStroke,
            radius: 8
        });
        
        this.hoverLayer = new MiniMap.Gui.Draw.DrawLayer({
            minimap: spm,
            features: [],
            allowMultiGeometries:true
        });
        
        this.hoverLayer.olSetStyle(
            function (feature){
                var styleDef = {
                        fill: otherFill,
                        stroke: otherStroke,
                        image: otherCircle};
                
                if (feature && feature.attributes){
                    if (feature.attributes.type && feature.attributes.type === 'result'){
                        styleDef = {
                                fill: resultFill,
                                stroke: resultStroke,
                                image: resultCircle};
                    }
                    if (feature.attributes.label){
                        var labelStyleDef = {
                            font: 'bold 14px sans-serif',
                            offsetY: -20,
                            offsetX: -20,
                            text: feature.attributes.label,
                            fill: new ol.style.Fill({
                                color: 'rgba(255,150,0,1)'})
                        };
                        if (feature.attributes.type && feature.attributes.type === 'result' && feature.attributes.geometryType && feature.attributes.geometryType.indexOf('Polygon') == -1){
                            labelStyleDef.fill = new ol.style.Fill({color: 'rgba(0,81,162,1)'});
                        } else {
                            labelStyleDef.fill = new ol.style.Fill({color: 'rgba(255,150,0,1)'});
                        }
                        
                        styleDef.text = new ol.style.Text(labelStyleDef);
                    }
                    
                }

                return [ new ol.style.Style(styleDef) ];
            }
        );
    
    }
    return this.hoverLayer;    
}


//Detail Header
function s4_getZoomToDetailsButton(result, detailItems) {
    //return extrahHeader = { icon, text, onClick, onHover}
    var geoDetailItems = {
            results: [],
            items: []
    };
    for (var i = 0; i < detailItems.length; i++) {
        var detailItem = detailItems[i];
        if (detailItem.type == 'result' && detailItem.result.geometry)
            geoDetailItems.results.push(detailItem.result)
        if (detailItem.valueformat && detailItem.valueformat == 'geometry') {
            geoDetailItems.items.push(detailItem);
        }
    }
    if (geoDetailItems.results.length + geoDetailItems.items.length > 0)
        return {
          icon: Septima.Search.s4Icons.zoomToExtentIcon,
          text: spm.getSession().getString('s4.sq.header.text'),
          onHover: s4_onZoomToDetailsButtonHover.bind(this, geoDetailItems),
          onClick: s4_zoomToDetailItems.bind(this, geoDetailItems)
        }
    else
        return {}
}

function s4_SSGeomToWkt(ssGeom) {
    var ssGeomInCorrectProjection = Septima.Search.reproject.reproject(ssGeom, null, _s4_projection_epsg_code)
    return _s4WktParser.convert(ssGeomInCorrectProjection);
}

function s4_SSGeomToFeature(ssGeom) {
    //var olGeom = s4_SSGeomToOlGeom(result.geometry);
    //olGeom.
    var wkt = s4_SSGeomToWkt(ssGeom);
    return {wkt: wkt, attributes: {}};
}

function s4_SSGeomToOlGeom(ssGeom) {
    var mc = spm.getMapControl();
    var feature = mc._wktFormatter.readFeature(s4_SSGeomToWkt(ssGeom))
    return feature.getGeometry();
}

function s4_zoomToDetailItems(geoDetailItems, result, detailItems) {
    if (geoDetailItems.results.length + geoDetailItems.items.length > 0){
        var mc = spm.getMapControl();
        if (geoDetailItems.extent) {
            mc.map.getView().fit(geoDetailItems.extent);
        } else {
            var olGeoms = [];
            if (result) {
                var olGeom = s4_SSGeomToOlGeom(result.geometry);                
                olGeoms.push(olGeom);
            }
            for (var i=0;i < geoDetailItems.results.length;i++){
                var olGeom = s4_SSGeomToOlGeom(geoDetailItems.results[i].geometry)                
                olGeoms.push(olGeom);
            }
            for (var i=0;i < geoDetailItems.items.length;i++){
                var olGeom = s4_SSGeomToOlGeom(geoDetailItems.items[i].value)                
                olGeoms.push(olGeom);
            }
            var g = new ol.geom.GeometryCollection(olGeoms);
            var extent = ol.extent.buffer(g.getExtent(), 100);
            geoDetailItems.extent = extent
            mc.map.getView().fit(extent);
        }
        
    }
}

function s4_onZoomToDetailsButtonHover(geoDetailItems, result, detailItems) {
    if (detailItems) {
        if (geoDetailItems.results.length + geoDetailItems.items.length > 0){
            var olGeoms = [];
            for (var i=0;i < geoDetailItems.results.length;i++){
                s4_addResultToHoverLayer(geoDetailItems.results[i]);
            }
            for (var i=0;i < geoDetailItems.items.length;i++){
                s4_addDetailItemToHoverLayer(geoDetailItems.items[i]);
            }
        }
    } else {
        s4_clearHoverLayer();
    }
}

function s4_init (params){
    if (_s4View == null) {
    			
       		_s4Params = params;
       		
       		//Locale
       		var s4Locale = {
       		      "search": spm.getSession().getString('s4.search.placeholder'),
       		      "matches": spm.getSession().getString('s4.search.matches'),
       		      "close": spm.getSession().getString('s4.search.close'),
       		      "doDetails": spm.getSession().getString('s4.search.dodetails'),
                  "at_site": spm.getSession().getString('s4.search.at_site'),
                  "noResults": spm.getSession().getString('s4.search.noresults')
       		};
       		
            if (typeof _s4Params.view.placeholder !== 'undefined'){
                s4Locale.search = _s4Params.view.placeholder;
            }else{
                var placeHolder = spm.getSession().getParam("s4.search.placeholder");
                if (placeHolder !== null && placeHolder !== "s4.search.placeholder"){
                    s4Locale.search = placeHolder;
                }
            }
            
       		Septima.Search.setLocale(s4Locale);
       		
       		//Projection
       		if (typeof _s4Params.projection_epsg !== 'undefined') {
                Septima.Search.reproject.registerCrs(_s4Params.projection_epsg.code, _s4Params.projection_epsg.def);
                _s4_projection_epsg_code = _s4Params.projection_epsg.code;
       		} else {
                var cbInfoMapCrs = spm.getSession().getParam("cbinfo.map.srs");
                if (cbInfoMapCrs == '25832') {
                    _s4_projection_epsg_code = "epsg:25832";
                    Septima.Search.reproject.registerCrs("epsg:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
                } else {
                    throw "S4 projection_epsg could not be found. Please define projection_epsg in your custom tool";
                }
       		    
       		}
       		 
       		//Set global vars
       		_s4WktParser = Septima.Search.getWKTParser();
       		
       		//Fix some defaults
       		if (typeof _s4Params.view.forcedblurOnSelect === 'undefined'){
       			_s4Params.view.forcedblurOnSelect = false;
       		}
    	
       		if (typeof _s4Params.view.zoomBuffer === 'undefined' || isNaN(parseInt(_s4Params.view.zoomBuffer))){
       			_s4Params.view.zoomBuffer = 100;
       		}else{
       		 _s4Params.view.zoomBuffer = parseInt(_s4Params.view.zoomBuffer);
       		}
       		
       		if (typeof _s4Params.view.marginToBottom === 'undefined'){
       			_s4Params.view.marginToBottom = 100;
       		}
       		
        	var sessionId = cbKort.sessionId;

            //Set up search input box
        	_s4InputContainer = jQuery('<div id="s4box" class="inputcontainer"/>');
            var s4MenuItem = jQuery("li[id^=s4-plugin]");
        	if (jQuery("li[id^=s4-plugin]") && typeof params.panel !== 'undefined' && params.panel === 'tool' ){
        	    // Place as tool
        	    s4MenuItem.empty();
        	    s4MenuItem.addClass("inputcontainer-spacer");
        	    s4MenuItem.append(_s4InputContainer);
        	}else{
        	    //Place in correct panel
                var panel = 'map-top-right'; //default
                if (typeof params.panel !== 'undefined' && params.panel !== 'default') {
                    panel = params.panel;
                    if (panel === 'panel-brand' && (jQuery("#panel-brand").is(":visible") === false || jQuery("#panel-brand").height()<30)) {
                        //remove from panel-brand if panel-brand is not visible or high enough
                        panel = 'map-top-right';
                    }
                }

                s4MenuItem.remove();
                _s4InputContainer.addClass('in-'+panel);
                
                if (panel === 'panel-brand'){
                    //Add spacer
                    jQuery("#panel-brand div.right").append('<div class="inputcontainer-spacer"></div>');
                    jQuery("#panel-brand div.right").append(_s4InputContainer);
                } else if (panel === 'panel-middle'){
                    //Add spacer
                    jQuery('#panel-middle > .inner.right > .midnav').append('<li class="inputcontainer-spacer"></li>');
                    jQuery('#panel-middle > .inner.right').append(_s4InputContainer);
                } else if (panel === 'panel-top'){
                    jQuery('#panel-top > .inner.right > .topnav').append('<li class="inputcontainer-spacer"></li>');
                    jQuery('#panel-top > .inner.right').append(_s4InputContainer);
                } else if (panel === 'menu'){
                    jQuery('#panel-middle > .inner.left > .midnav').append('<li class="inputcontainer-spacer"></li>');
                    jQuery('#panel-middle > .inner.left').append(_s4InputContainer);
                } else if (panel === 'map-top-right'){
                    jQuery('#mapcontainer_innerContenttopright').append('<li class="inputcontainer-spacer"></li>');
                    jQuery('#mapcontainer_innerContenttopright').append(_s4InputContainer);
                }
        	}

            //Place inputcontainer according to the spacer

            //Create controller
        	var blankBehavior = "search";
        	if (_s4Params.view.blankbehavior && _s4Params.view.blankbehavior == "none"){
        		blankBehavior = "none";
        	}
        	var controllerOptions = {blankBehavior: blankBehavior};

        	if (_s4Params.view.maxResults){
        		controllerOptions.singleSourceResultsLimit = _s4Params.view.maxResults;
        	}

        	_s4Controller = new Septima.Search.Controller([], controllerOptions);
            var controller = _s4Controller
        	
        	//Set up the API
			//Create array of "OnSelect" listeners if not already created
			window["_s4OnSelect"] = window["_s4OnSelect"] || [];
			window["_s4Searchers"] = window["_s4Searchers"] || [];
			//Example:
			//window["_s4CustomButtons"].push({"buttonText":"xxxxx", "buttonImage": "url","callBack": function, "searcher": ["geosearcher"|"cvrsearcher"|"plansearcher"|"indexsearcher"|"themesearcher"|"profilesearcher"|"favoritesearcher"|"workspacesearcher"][, "target": ""]});
			window["_s4CustomButtons"] = window["_s4CustomButtons"] || [];

            //Etablér offentligeKortLinksProvider
            var offentlige_kortlinks = ["skraafoto_dataforsyningen", "sdfekort", "plankort"]
            if (_s4Params.offentlige_kortlinks)
                offentlige_kortlinks = _s4Params.offentlige_kortlinks
            var offentligeKortLinksProvider = new Septima.Search.OffentligeLinksProvider({more: false, links: offentlige_kortlinks, buttonText: "Offentlige kort", buttonImage: Septima.Search.icons.exlink});

            //Etablér skraaFotoProvider
            var skraaFotoProvider
            if (_s4Params.skraafototoken) {
                skraaFotoProvider = new Septima.Search.ComposedDetailsHandler({
                    buttonText: "Skråfoto"
                });
                var linksHandler = new Septima.Search.OffentligeLinksProvider({more: false, links: ["skraafoto_dataforsyningen"]})
                skraaFotoProvider.addDetailsHandler(linksHandler);
                var skraaFotoProvider_real = new Septima.Search.SkraafotoProvider({token: _s4Params.skraafototoken})
                skraaFotoProvider.addDetailsHandler(skraaFotoProvider_real);
            }
    
            if (_s4Params.dawasearcher && _s4Params.dawasearcher.enabled){
            	var dawaSearcherOptions = {onSelect: s4DawaHit};
            	if (_s4Params.municipality != "*"){
            		var municipalities = _s4Params.municipality.split(' ');
            		dawaSearcherOptions.kommunekode = municipalities.join('|');
            	}
                if (typeof _s4Params.dawasearcher.minimumShowCount != 'undefined'){
                    dawaSearcherOptions.minimumShowCount = _s4Params.dawasearcher.minimumShowCount;
                }
                if (typeof _s4Params.dawasearcher.showMinimumOnBlank != 'undefined'){
                    dawaSearcherOptions.showMinimumOnBlank = _s4Params.dawasearcher.showMinimumOnBlank;
                }
            	var dawaSearcher = new Septima.Search.DawaSearcher(dawaSearcherOptions);
            	controller.addSearcher(dawaSearcher);
                _s4Params.dawasearcher.searcher = dawaSearcher;
                _s4Params.adressSearcher = dawaSearcher;
                if (skraaFotoProvider && _s4Params.dawasearcher.skraafoto)
                    dawaSearcher.addDetailHandlerDef(skraaFotoProvider);
            }
			
            if (_s4Params.s3searcher && _s4Params.s3searcher.enabled){
                var s3SearcherOptions = {
                        onSelect: s4Hit,
                        host: _s4Params.s3searcher.host,
                        organisation: _s4Params.s3searcher.organisation,
                        configuration: _s4Params.s3searcher.configuration,
                        service: _s4Params.s3searcher.service,
                        showLinkToWeb: _s4Params.s3searcher.showLinkToWeb
                    };
                if (_s4Params.s3searcher.token) {
                    s3SearcherOptions.authorization = {Bearer: {token: _s4Params.s3searcher.token} };
                }
                
                var s3searcher = new Septima.Search.S3Searcher(s3SearcherOptions);
                controller.addSearcher(s3searcher);
                _s4Params.s3searcher.searcher = s3searcher;
            }
            
            if (_s4Params.indexsearcher && _s4Params.indexsearcher.enabled){
            	var s4IndexSearcherOptions = {
            	        onSelect: s4Hit,
            	        datasources: _s4Params.indexsearcher.datasources,
            	        allowDetails: _s4Params.indexsearcher.allowDetails,
            	        sessionId: sessionId};
                if (_s4Params.indexsearcher.blankbehavior){
                	s4IndexSearcherOptions.blankBehavior = _s4Params.indexsearcher.blankbehavior;
                }
            	var s4IndexSearcher = new Septima.Search.S4IndexSearcher(s4IndexSearcherOptions);
            	controller.addSearcher( s4IndexSearcher );
                _s4Params.indexsearcher.searcher = s4IndexSearcher;
                if (skraaFotoProvider && _s4Params.indexsearcher.skraafoto)
                    s4IndexSearcher.addDetailHandlerDef(skraaFotoProvider);
                if (_s4Params.indexsearcher.offentligelinks)
                    s4IndexSearcher.addDetailHandlerDef(offentligeKortLinksProvider);
            }
        	
            if (_s4Params.geosearcher && _s4Params.geosearcher.enabled){
            	var gstAuthParams= s4_getGstAuthParams();
            	if (gstAuthParams != null){
                	var geoSearchOptions = {
                			targets: _s4Params.geosearcher.targets,
                			authParams: gstAuthParams,
                		    onSelect: s4Hit
                	};
                	if (_s4Params.municipality != "*"){
                	    geoSearchOptions.kommunekode = _s4Params.municipality;
                	}
                	var geoSearcher = new Septima.Search.GeoSearch(geoSearchOptions);
                	controller.addSearcher(geoSearcher);
                    _s4Params.geosearcher.searcher = geoSearcher;
                    if (skraaFotoProvider && _s4Params.geosearcher.skraafoto)
                        geoSearcher.addDetailHandlerDef(skraaFotoProvider);
                }
            }

            if (_s4Params.geostednavnesearcher && _s4Params.geostednavnesearcher.enabled){
                var gstAuthParams= s4_getGstAuthParams();
                var geoStednavnSearchOptions = {};
                if (gstAuthParams != null){
                    geoStednavnSearchOptions = {
                            authParams: gstAuthParams,
                            onSelect: s4Hit
                    };
                    if (_s4Params.municipality != "*"){
                        geoStednavnSearchOptions.kommunekode = _s4Params.municipality;
                    }
                    var geoStednavnSearcher = new Septima.Search.GeoStednavnSearcher(geoStednavnSearchOptions);
                    controller.addSearcher( geoStednavnSearcher);
                    _s4Params.geostednavnesearcher.searcher = geoStednavnSearcher;

                    if (skraaFotoProvider && _s4Params.geostednavnesearcher.skraafoto)
                        geoStednavnSearcher.addDetailHandlerDef(skraaFotoProvider); 
                    if (_s4Params.geostednavnesearcher.offentligelinks)
                        geoStednavnSearcher.addDetailHandlerDef(offentligeKortLinksProvider);
                }
            }
            
            if (_s4Params.plansearcher && _s4Params.plansearcher.enabled){
            	var planSearchOptions = {onSelect: s4Hit};
            	if (_s4Params.municipality != "*"){
            		planSearchOptions.kommunekode = _s4Params.municipality;
            	}
            	if (_s4Params.plansearcher.targets) {
            	    planSearchOptions.targets = _s4Params.plansearcher.targets; 
            	} else {
                    planSearchOptions.targets = ['vedtagetlokalplan']; 
            	}
            	var planSearcher = new Septima.Search.PlanSystemSearcher(planSearchOptions);
            	controller.addSearcher(planSearcher);
                _s4Params.plansearcher.searcher = planSearcher;

                if (skraaFotoProvider && _s4Params.plansearcher.skraafoto)
                    planSearcher.addDetailHandlerDef(skraaFotoProvider); 

            }
        	
            if (_s4Params.cvrsearcher && _s4Params.cvrsearcher.enabled){
            	var cvrSearcherOptions = {
            	        onSelect: s4Hit,
            	        fetcher: new Septima.Search.DataApi.Fetcher(),
                        goal: "produktionsenhed",
            	        resultTypes: {
                            produktionsenhed: {
                            "singular": "Virksomhed",
                            plural: "Virksomheder"}
                        }
            	};
                if (_s4Params.municipality != "*"){
                    cvrSearcherOptions.kommunekode = _s4Params.municipality
                }
            	var cvrsearcher = new Septima.Search.DataApi.CvrSearcher(cvrSearcherOptions);
            	controller.addSearcher(cvrsearcher);
                _s4Params.cvrsearcher.searcher = cvrsearcher;
                if (skraaFotoProvider && _s4Params.cvrsearcher.skraafoto)
                    cvrsearcher.addDetailHandlerDef(skraaFotoProvider); 
                if (_s4Params.cvrsearcher.offentligelinks)
                    cvrsearcher.addDetailHandlerDef(offentligeKortLinksProvider);
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
            
            if ((_s4Params.themesearcher && _s4Params.themesearcher.enabled) || (_s4Params.clientsearcher && _s4Params.clientsearcher.enabled)){
	            var themeSearcher = new Septima.Search.ThemeSearcher({onSelect: themeHit});
	            controller.addSearcher(themeSearcher);
                _s4Params.themesearcher.searcher = themeSearcher;
            }

            if (_s4Params.workspacesearcher && _s4Params.workspacesearcher.enabled && typeof workspace_init !== 'undefined'){
                var workspaceSearcher = s4CreateWorkspaceSearcher({
                    host: "",
                    onSelect: workspaceHit,
                    singular: spm.getSession().getString('s4.workspacesearcher.workspace'),
                    plural: spm.getSession().getString('s4.workspacesearcher.workspaces'),
                    sessionId: sessionId
                });
                
            	controller.addSearcher( workspaceSearcher);
                _s4Params.workspacesearcher.searcher = workspaceSearcher;
            }

            if (typeof(ProfileSelector) != 'undefined' && _s4Params.profilesearcher && _s4Params.profilesearcher.enabled){
                
                var profileSearcher = s4CreateProfileSearcher({
                    host: "",
                    onSelect: profileHit,
                    singular: spm.getSession().getString('s4.profilesearcher.profile'),
                    plural: spm.getSession().getString('s4.profilesearcher.profiles'),
                    sessionId: sessionId
                });
                
            	controller.addSearcher(profileSearcher);
                _s4Params.profilesearcher.searcher = profileSearcher;
            }
            
            if (typeof(Favorites) != 'undefined' && _s4Params.favoritesearcher && _s4Params.favoritesearcher.enabled){
                
                var favoriteSearcher = s4CreateFavoriteSearcher({
                    host: "",
                    onSelect: favoriteHit,
                    singular: spm.getSession().getString('s4.favoritesearcher.favorite'),
                    plural: spm.getSession().getString('s4.favoritesearcher.favorites'),
                    sessionId: sessionId
                });
                
        		controller.addSearcher( favoriteSearcher);
                _s4Params.favoritesearcher.searcher = favoriteSearcher;
            }
            
            
            if (_s4Params.historysearcher && _s4Params.historysearcher.enabled){
                var store;
                var storeOptions = {
                        source: "historik",
                        sortMode: "filter",
                        maxLength: 20};
                
                if (_s4Params.historysearcher.persist && _s4Params.historysearcher.persist == true)
                    store = new Septima.Search.LocalstorageResultStore(storeOptions);
                else
                    store = new Septima.Search.MemoryResultStore(storeOptions);
                
                var resultType = new Septima.Search.ResultType({
                    id: "historik",
                    singular: "Historik",
                    plural: "Historik"});
                
                var searcherOptions = {
                        resultType: resultType,
                        store: store,
                        controller: controller
                };
                
                var historySearcher = new Septima.Search.HistorySearcher(searcherOptions);
                    
                controller.addSearcher( historySearcher);
                _s4Params.historysearcher.searcher = historySearcher;
                
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
        		input: _s4InputContainer[0],
        		limit: _s4Params.view.limit,
        		controller: controller,
        		onHover: s4_onResultHover,
        		onFocus: s4_onResultFocus,
        		focusIcon: Septima.Search.icons.globe,
        	    onDetailItem: s4_processDetailItem,
                onDetailHeader: s4_getZoomToDetailsButton
        		});
        	
        	s4SetMaxHeight();
        	
            //Hide for a second until gui is settled
        	_s4InputContainer.hide();
            
            if (typeof spm !== 'undefined' && typeof spm.getEvents !== 'undefined'){
                spm.getEvents().addListener("SPATIALMAP_READY", function() {
                    setTimeout(function () {
                        // Show inputcontainer again
                        _s4InputContainer.show();
                        _s4InputContainer.offset(jQuery('.inputcontainer-spacer').offset());
                        if (_s4Params.historysearcher && _s4Params.historysearcher.searcher && _s4Params.historysearcher.promote) {
                            setTimeout(Septima.bind(function (_s4View) {
                                _s4View.promote("historik", "historik");
                                }, this, _s4View), 500);
                        }
                    }.bind(this), 1000);
                }.bind(this));
                
                spm.getEvents().addListener("MAP_CLICKED", function() {
                    _s4View.blur(_s4Params.view.forcedblurOnSelect);
                });

            }else{
                // Show inputcontainer again
                setTimeout(Septima.bind(function () {
                    _s4InputContainer.show();
                    _s4InputContainer.offset(jQuery('.inputcontainer-spacer').offset());
                }, this), 100);
                
                cbKort.mapObj.map.events.register("mousedown",cbKort.mapObj.map,function(e){
                    _s4View.blur(_s4Params.view.forcedblurOnSelect);
                }, true);
            }
            
            jQuery(window).resize(function () {
                setTimeout(function (inputContainer) {
                    //Place inputcontainer according to the spacer
                    _s4InputContainer.offset(jQuery('.inputcontainer-spacer').offset());
                    s4SetMaxHeight();
                }.bind(this), 100);
            }.bind(this));
            

            var options = {
                inputContainer: _s4InputContainer,
                left: jQuery('.inputcontainer-spacer').offset().left
            };
            
            setInterval(function (options) {
                if (options.left !== jQuery('.inputcontainer-spacer').offset().left) {
                    options.left = jQuery('.inputcontainer-spacer').offset().left;
                    options.inputContainer.offset(jQuery('.inputcontainer-spacer').offset());
                    s4SetMaxHeight();
                }
            }.bind(this, options), 100);
        	
            
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
            addS4SpatialMapTools(_s4Params.s3searcher);
    }
}

function s4SetMaxHeight(){
	if (_s4View != null && _s4View.top() !=null){
		_s4View.setMaxHeight(jQuery(window).height() - _s4View.top() - _s4Params.view.marginToBottom);
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
    for (var i = 0; i < _s4OnSelect.length;i++){
		if (!_s4OnSelect[i](result)){
			return;
		}
	}
	if (result.geometry){
        showResultInMap(result);
	}
}

function themeHit(result){
    _s4View.blur(_s4Params.view.forcedblurOnSelect);
    if (!result.data.theme.isVisible()){
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
        if (typeof spm.getTool === 'undefined') {
            print_getConfig(_s4Params.view.printconfig);
            
        } else {
            let tryTool = "print_" + _s4Params.view.printconfig.replace("rotatet", "rotated")
            spm.getTool(tryTool).loadLazyRequires(function () {
                let tryConfig = _s4Params.view.printconfig.replace("rotated", "rotatet")
                print_getConfig(tryConfig);
            });
        }
    });
    
	var freetext_print_input = jQuery('#' + _s4Params.view.printconfig + '_freetext_print_input');
	if (freetext_print_input.length == 1){
		freetext_print_input.val(result.title);
	}else{
		setTimeout(function(){jQuery('#' + _s4Params.view.printconfig + '_freetext_print_input').val(result.title);}, 500);
	}
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
    var s4InfoButtonCaption = spm.getSession().getString('s4.infobutton.caption');
    var _s4InfoUri = Septima.Search.s4Icons.infoIconUri;
    var s4InfoButtonDef = {"buttonText": s4InfoButtonCaption, "buttonImage": _s4InfoUri, "callBack": s4DoInfo, "isApplicable": function(result){return result.geometry !== null;}};
    searcher.addCustomButtonDef(s4InfoButtonDef);
}

function addPrintButtonToSearcher(searcher){
    if (_s4Params.view.printconfig){
        var _s4PrintUri = Septima.Search.s4Icons.printIconUri;
        var s4PrintButtonCaption = "Print";
        var s4PrintButtonDef = {"buttonText": s4PrintButtonCaption, "buttonImage": _s4PrintUri,"callBack": s4DoPrint, "isApplicable": function(result){
            return result.geometry !== null;}
        };  
        searcher.addCustomButtonDef(s4PrintButtonDef);
    }
}

function s4_getGstAuthParams(){
    var token = spm.getSession().getParam('s4.gst.token');
    if (token) {
        return {token: token}
    } else {
        var login = spm.getSession().getParam('s4.gst.login');
        var password = spm.getSession().getParam('s4.gst.password');
        return {login: login, password: password};
    }
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
    	this.defaultText = spm.getSession().getString('spatialquery.lastdisplayed.hint');
        this.dialog = new Dialog(spm.getSession().getString('spatialquery.lastdisplayed.dialogtitle'));
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
                '            <button class="menubutton" onclick="searchlast2.search();">'+spm.getSession().getString('standard.button.ok')+'</button>' +
                '        </td>' +
                '    </tr>' +
                '</table>';
        this.dialog.addContentHTML(h);
    }
    //getElement('Searchlast2_options').innerHTML = spatialqueryoptions.getOptionDialogContent();
    jQuery('#Searchlast2_options').html(spatialqueryoptions.getOptionDialogContent());
}
Searchlast2.prototype.showDialog = function(searchtext)
{
    this.createDialog();
    
	if (searchtext) {
		this.searchText = searchtext;
		jQuery('#Searchlast2_searchtext').html(spm.getSession().getString('spatialquery.show_info_about') + ' ' + this.searchText);
	} else {
		this.searchText = null;
		jQuery('#Searchlast2_searchtext').html(this.defaultText);
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
        showWaitingBox(spm.getSession().getString('standard.message.getting_data'));
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
    
    var searchtext = (this.searchText || spm.getSession().getString('spatialquery.lastdisplayed.searchtext'));
    spatialquery_doQuery("userdatasource", url, searchtext, null);
    
    try{
        hideWaitingBox();
    }catch (error){}
}
var searchlast2 = new Searchlast2();

