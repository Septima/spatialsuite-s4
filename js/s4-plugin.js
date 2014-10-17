var _s4View = null;
var _s4Params = null;

function s4_getDefaultParams(){
	return {
		municipality: '*', 
		view:{limit: 20, blankbehavior: "search", autofocus: true, dynamiclayer: 'userdatasource', infoprofilequery: 'userdatasource', printconfig: 'rotatet_contact'},
        adresssearcher:{enabled: false, info: true, print: true, apiKey: "FCF3FC50-C9F6-4D89-9D7E-6E3706C1A0BD", streetNameHit: false},
        geosearcher:{enabled: true, info: true, print: true, targets: ['adresser','stednavne', 'kommuner', 'matrikelnumre', 'opstillingskredse', 'politikredse', 'postdistrikter', 'regioner', 'retskredse'], streetNameHit: false},
        cvrsearcher:{enabled: true, info: true, print: true},
        plansearcher:{enabled: true, info: true, print: true},
        indexsearcher:{enabled: true, info: true, print: true, datasources: "*"},
        themesearcher:{enabled: true},
        profilesearcher:{enabled: true},
        favoritesearcher:{enabled: true},
        workspacesearcher:{enabled: true}};
}

function s4_init (params){
    if (_s4View == null) {
    			
        	if (params == undefined){
        		_s4Params = s4_getDefaultParams();
        	}else{
        		_s4Params = params;
        	}
    	
        	//Get localized strings
        	var infoButtonCaption = cbInfo.getString('s4.infobutton.caption');
        	var printButtonCaption = "Print";
        	var inputPlaceHolder = cbInfo.getString('s4.input.placeholder');
        	var matchPhrase = cbInfo.getString('s4.list.matchphrase');
        	
        	var sessionId = cbKort.sessionId;

            //Set up search input box
            var button = null;
            if (typeof Gui !== 'undefined') {
                button = Gui.getButton('s4');
            }
            
            var inputContainer = jQuery('<div type="text" id="s4box" name="s4box" class="inputcontainer"/>');
            if (button === null) {
                if (jQuery("#panel-brand div.right").length > 0){
                    
                    var panel = 'panel-brand';
                    if (jQuery("#panel-brand").is(":visible") === false || jQuery("#panel-brand").height()<30) {
                        panel = 'panel-middle';
                    }
                    if (typeof params.panel !== 'undefined' && params.panel !== 'default') {
                        panel = params.panel;
                    }

                    //Append the inputcontainer to <body>
                    //jQuery("body").append(inputContainer);
                    inputContainer.addClass('in-'+panel);
                    
                    if (panel === 'panel-brand'){
                        //Add spacer
                        jQuery("#panel-brand div.right").append('<div class="inpucontainer-spacer"></div>');
                        jQuery("#panel-brand div.right").append(inputContainer);
                    } else if (panel === 'panel-middle'){
                        //Add spacer
                        jQuery('#panel-middle > .inner.right > .midnav').append('<li class="inpucontainer-spacer"></li>');
                        jQuery('#panel-middle > .inner.right').append(inputContainer);
                        
                        if (cbKort.themeSelector && cbKort.themeSelector.panels) {
                            var panel = cbKort.themeSelector.panels["panel-themes-headerleft"];
                            if (panel) {
                                var button = panel.getButton('theme_store_setting');
                                button.element.click(function () {
                                    if (cbKort.themeSelector.editMode) {
                                        jQuery('#s4box').hide();
                                    } else {
                                        jQuery('#s4box').show();
                                    }
                                });
                            }
                        }                        
                    } else if (panel === 'panel-top'){
                        jQuery('#panel-top > .inner.right > .topnav').append('<li class="inpucontainer-spacer"></li>');
                        jQuery('#panel-top > .inner.right').append(inputContainer);
                    } else if (panel === 'menu'){
                        jQuery('#panel-middle > .inner.left > .midnav').append('<li class="inpucontainer-spacer"></li>');
                        jQuery('#panel-middle > .inner.left').append(inputContainer);
                    }else {
                    	if (panel.indexOf('panel-middle') > -1){
                            jQuery(panel).append('<li class="inpucontainer-spacer"></li>');
                    	}else{
                            jQuery(panel).append('<div class="inpucontainer-spacer"></div>');
                    	}
                    	jQuery(panel).append(inputContainer);
                    }
                    
                    //Place inputcontainer according to the spacer
                    inputContainer.offset(jQuery('.inpucontainer-spacer').offset());
                    //Compensate for a delay in Chrome
                    setTimeout(function () {
                        jQuery('#s4box').offset(jQuery('.inpucontainer-spacer').offset());
                    },500);

                    //onResize: Place inputcontainer according to the spacer
                    jQuery(window).resize(function () {
                        setTimeout(function () {
                            jQuery('#s4box').offset(jQuery('.inpucontainer-spacer').offset());
                        },100);
                    });

                }else{
                    jQuery("body").append(inputContainer);
                    inputContainer.addClass("v263");
                }
            } else {
                button.element.empty();
                button.element.removeClass('toolbar').addClass('toolspacer-notxt');
                button.element.append('<div type="text" id="s4box" name="s4box" class="inputcontainer s4-static"/>');
            }

        	_s4View = new Septima.Search.DefaultView({input:"s4box", placeholder:inputPlaceHolder, limit: _s4Params.view.limit});
        	
        	var blankBehavior = "search";
        	if (_s4Params.view.blankbehavior && _s4Params.view.blankbehavior == "none"){
        		blankBehavior = "none";
        	}
        	var controllerOptions = {blankBehavior: blankBehavior};
        	var controller = new Septima.Search.Controller([], _s4View, controllerOptions);
        	
        	var _s4InfoUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhpJREFUeNqMk02IUmEUhs91pBzB/EXR1IXuxppB2kQQzCIIhAayuii4sk3b2jbUUHcxJIgL0YVMRkhQtO4HahNEixCUsoU4bRUCCcXxX3vP5V65ogMdeLjnfPc7L+937v2E+XxOoijeIKLj6XT6C9BkMqF6vU6NRoM08RYIQKewP5vNfnBCaDrv9XpvIt1SdwcCAbJarVqBA/AYHAE92CFFiQWEdDot+Xy+KMqQ2hEOh8lisajlTwW9wp+FACzLz0wm8xROlkT8fr/WxWVwD9TAxxUBjmw2+wRObiO9wLXZbNYKSMAAHqgLKwIc+Xz+ACJ3MOCLXIdCC0PXwK52r9w4Ho+XBDgKhcIj2BeRbptMJnX5G/j+XwIcxWJxH05EONn2eDy8dAb5Of70DCnTPFWAo1QqPYzFYjrsETqdzqVut7v0XhXY0C4OBoOTSCTyrN1uD9U1QRBCwWCwWqlUaOUIaJCfaPibSqXeGAwGYyKRuNLv999jwIf44w5h+dU6h3LjcDjUczOsvsjlcu+q1epxPB6/iuHtwvLZXq932gkXAhvRaPRlrVZ7PhqNPsDFp01EMpncQ73FAq1Wi5rNJrlcrgVy8DTtdvtdsON2u8nhcJDNZrtVLpd/o/EEX+E+aloH9+oUkSNQ5VsINzzUr5IkfTYajZtOpzMAF7QOebiKA7nAsHigco7mPdyL67jWr1F+WXd+DJn+CTAAeWoNKVBP6T4AAAAASUVORK5CYII=";
            var infoButtonDef = {"buttonText":infoButtonCaption, "buttonImage": _s4InfoUri,"callBack": s4DoInfo};
            
            if (_s4Params.view.printconfig){
            	//http://dopiaza.org/tools/datauri/index.php
            	var _s4PrintUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMkE3MEU5MTE5MjA2ODExODgwN0FGOUZDM0NFRkE4MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBMkMwNzY3Mzk1RjIxMUUxODREMEM4N0I2MDFGREQyQSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBMkMwNzY3Mjk1RjIxMUUxODREMEM4N0I2MDFGREQyQSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI0QTcwRTkxMTkyMDY4MTE4ODA3QUY5RkMzQ0VGQTgwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIyQTcwRTkxMTkyMDY4MTE4ODA3QUY5RkMzQ0VGQTgwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wYGX3QAAADNQTFRFVlZW////qqqqgICA1dXV39/fi4uLysrKgYGBv7+/YWFhdnZ2dXV1YGBgwMDA1NTU////aY/EbQAAABF0Uk5T/////////////////////wAlrZliAAAAb0lEQVR42oyPWQ6AMAgFWbq3Kvc/rdDSRP3yJU3I0MAA8gnoi4lnUnRQyVPRQINHmkCAV8I/QLhCE0iHgEtBex11rfYcsJbmQSaU9T/jEuNLC0q1xQ2ygXFE3GCoNkOes/y4Usq5ZhsQ95irbgEGAHZ1Bwk/T1uMAAAAAElFTkSuQmCC";
                var printButtonDef = {"buttonText":printButtonCaption, "buttonImage": _s4PrintUri,"callBack": s4DoPrint};
            }
            
            //Set up adress searcher
            if (_s4Params.adresssearcher && _s4Params.adresssearcher.enabled){
            	var adressSearchOptions = {apiKey: _s4Params.adresssearcher.apiKey, onSelect: s4AdressHit, matchesPhrase: matchPhrase};
            	if (_s4Params.municipality != "*"){
            		adressSearchOptions.area = "muncode0" + _s4Params.municipality;
            	}
            	var adressSearcher = new Septima.Search.AddressSearcher(adressSearchOptions);
            	controller.addSearcher({"title": "Adresser", "searcher" : adressSearcher});
                if (_s4Params.adresssearcher.info){
                	adressSearcher.addCustomButtonDef(infoButtonDef);
                }
                if (_s4Params.view.printconfig && _s4Params.adresssearcher.print){
                	adressSearcher.addCustomButtonDef(printButtonDef);
                }
            }
            
            if (_s4Params.geosearcher && _s4Params.geosearcher.enabled){
            	var gstAuthParams= s4_getGstAuthParams();
            	if (gstAuthParams != null){
                	var geoSearchOptions = {
                			targets: _s4Params.geosearcher.targets,
                			authParams: gstAuthParams,
                		    onSelect: s4GeoHit, matchesPhrase: matchPhrase
                	    };
                	if (_s4Params.municipality != "*"){
                		var municipalities = _s4Params.municipality.split(' ');
                		for (var i=0;i<municipalities.length;i++){
                			municipalities[i] = "muncode0" + municipalities[i]; 
                		}
                		geoSearchOptions.area = municipalities.join();
                	}
                	var geoSearcher = new Septima.Search.GeoSearch(geoSearchOptions);
                	controller.addSearcher({"title": "", "searcher" : geoSearcher});
                    if (_s4Params.geosearcher.info){
                    	geoSearcher.addCustomButtonDef(infoButtonDef);
                    }
                    if (_s4Params.view.printconfig && _s4Params.geosearcher.print){
                    	geoSearcher.addCustomButtonDef(printButtonDef);
                    }
            	}
            }
            
            //Collect searchers that have been pushed until now
			var _s4Searchers = window["_s4Searchers"] || [];
			
			for (var i = 0;i<_s4Searchers.length;i++){
				var searcherReg = _s4Searchers[i];
                if (searcherReg.info && searcherReg.info == true){
                	searcherReg.searcher.addCustomButtonDef(infoButtonDef);
                }
                if (_s4Params.view.printconfig && searcherReg.print && searcherReg.print == true){
                	searcherReg.searcher.addCustomButtonDef(printButtonDef);
                }
				controller.addSearcher(searcherReg);
			}
			window["_s4Searchers"] = {
					controller: controller,
					push: function (searcherReg) {
						this.controller.addSearcher(searcherReg);
					}
			};
            
            if (_s4Params.indexsearcher && _s4Params.indexsearcher.enabled){
            	var s4IndexSearcherOptions = {onSelect: s4Hit, datasources: _s4Params.indexsearcher.datasources, matchesPhrase: matchPhrase};
            	var s4IndexSearcher = new Septima.Search.S4IndexSearcher(s4IndexSearcherOptions);
            	controller.addSearcher({title: "", searcher: s4IndexSearcher});
                if (_s4Params.indexsearcher.info){
                	s4IndexSearcher.addCustomButtonDef(infoButtonDef);
                }
                if (_s4Params.view.printconfig && _s4Params.indexsearcher.print){
                	s4IndexSearcher.addCustomButtonDef(printButtonDef);
                }
            }
        	
            if (_s4Params.plansearcher && _s4Params.plansearcher.enabled){
            	var planSearchOptions = {onSelect: s4Hit, matchesPhrase: matchPhrase};
            	var planSearcher = new Septima.Search.PlanSearcher(planSearchOptions);
            	if (_s4Params.municipality != "*"){
            		var municipalities = _s4Params.municipality.split(' ');
            		planSearcher.filter = { 'komnr' : municipalities };
            	}
            	controller.addSearcher({"title": "Lokalplaner", "searcher" : planSearcher});
                if (_s4Params.plansearcher.info){
                	planSearcher.addCustomButtonDef(infoButtonDef);
                }
                if (_s4Params.view.printconfig && _s4Params.plansearcher.print){
                	planSearcher.addCustomButtonDef(printButtonDef);
                }
            }
        	
            if (_s4Params.cvrsearcher && _s4Params.cvrsearcher.enabled){
            	var cvr_enhedSearchOptions = {onSelect: s4Hit, matchesPhrase: matchPhrase};
            	var se = new Septima.Search.CVR_enhedSearcher(cvr_enhedSearchOptions);
            	if (_s4Params.municipality != "*"){
            		var municipalities = _s4Params.municipality.split(' ');
                	se.filter = { 'kom_id_officiel' : municipalities };
            	}
            	controller.addSearcher({"title": "Virksomheder", "searcher" : se});
                if (_s4Params.cvrsearcher.info){
                	se.addCustomButtonDef(infoButtonDef);
                }
                if (_s4Params.view.printconfig && _s4Params.cvrsearcher.print){
                	se.addCustomButtonDef(printButtonDef);
                }
            }

            if ((_s4Params.themesearcher && _s4Params.themesearcher.enabled) || (_s4Params.clientsearcher && _s4Params.clientsearcher.enabled)){
	            var themeSearcher = new Septima.Search.ThemeSearcher({onSelect: themeHit, matchesPhrase: matchPhrase});
	            controller.addSearcher({"title": cbInfo.getString('s4.themesearcher.themes'), "searcher" : themeSearcher});
            }

            if (_s4Params.workspacesearcher && _s4Params.workspacesearcher.enabled && typeof workspace_container !== 'undefined'){
            	controller.addSearcher({title: cbInfo.getString('s4.workspacesearcher.workspaces'), searcher: new Septima.Search.workspaceSearcher({
        			host: "",
        			onSelect: workspaceHit,
            		singular: cbInfo.getString('s4.workspacesearcher.workspace'),
            		plural: cbInfo.getString('s4.workspacesearcher.workspaces'),
            		sessionId: sessionId,
            		matchesPhrase: matchPhrase
        		})});
            }

            if (typeof(ProfileSelector) != 'undefined' && _s4Params.profilesearcher && _s4Params.profilesearcher.enabled){
            	controller.addSearcher({title: cbInfo.getString('s4.profilesearcher.profiles'), searcher: new Septima.Search.ProfileSearcher({
        			host: "",
        			onSelect: profileHit,
            		singular: cbInfo.getString('s4.profilesearcher.profile'),
            		plural: cbInfo.getString('s4.profilesearcher.profiles'),
            		sessionId: sessionId,
            		matchesPhrase: matchPhrase
        		})});
            }
            
            if (typeof(Favorites) != 'undefined' && _s4Params.favoritesearcher && _s4Params.favoritesearcher.enabled){
        		controller.addSearcher({title: cbInfo.getString('s4.favoritesearcher.favorites'), searcher: new Septima.Search.FavoriteSearcher({
        			host: "",
        			onSelect: favoriteHit,
            		singular: cbInfo.getString('s4.favoritesearcher.favorite'),
            		plural: cbInfo.getString('s4.favoritesearcher.favorites'),
            		sessionId: sessionId,
            		matchesPhrase: matchPhrase
        		})});
            }
            
			//Ceate array of "OnSelect" listeners if not allready created
			window["_s4OnSelect"] = window["_s4OnSelect"] || [];
			
        	controller.go ();
        	
        	if (_s4View.top() !=null){
        		_s4View.setMaxHeight(jQuery(window).height() - _s4View.top() - 100);
        	}
        	
        	jQuery(window).resize(function() {
        		if (_s4View != null && _s4View.top() !=null){
        			_s4View.setMaxHeight(jQuery(window).height() - _s4View.top() - 100);
        		}
        	});
			cbKort.mapObj.map.events.register("mousedown",cbKort.mapObj.map,function(e){
				_s4View.blur();
			}, true);
			
        	if (_s4Params.view.autofocus){
                setTimeout(Septima.bind(function (_s4View) {
            	_s4View.focus();
                }, this, _s4View),500);
        	}
    }
}

function s4AdressHit(result){
	if (result.data.type != 'streetNameType' || (result.data.type == 'streetNameType' && _s4Params.adresssearcher.streetNameHit)){
		s4Hit(result);
	}
}

function s4GeoHit(result){
	if (result.data.type != 'streetNameType' || (result.data.type == 'streetNameType' && _s4Params.geosearcher.streetNameHit)){
		s4Hit(result);
	}
}

function s4Hit(result){
	cbKort.events.fireEvent('S4', {type: 's4Hit', result: result});
    for (var i = 0; i < _s4OnSelect.length;i++){
		if (!_s4OnSelect[i](result)){
			return;
		}
	}
    showResultInMap(result);
}

function showResultInMap(result){
	if (result.geometry){
		var geojson = new OpenLayers.Format.GeoJSON();
	    var olGeom = geojson.read(result.geometry, 'Geometry');
		var wkt = olGeom.toString();
	    cbKort.dynamicLayers.addWKT ({name: _s4Params.view.dynamiclayer, wkt:wkt, clear:true});
	    cbKort.dynamicLayers.zoomTo (_s4Params.view.dynamiclayer, '100');
	}
    _s4View.blur();
}

function themeHit(hit){
    _s4View.blur();
	if (hit.data.theme.visible){
		cbKort.setThemeVisibility(hit.data.theme.name, false, true);
	}else{
		cbKort.setThemeVisibility(hit.data.theme.name, true, true);
	}
	cbKort.events.fireEvent('S4', {type: 'themeHit', theme: hit.data});
}

function favoriteHit(hit){
    _s4View.blur();
	if (Favorites){
		Favorites.load(hit.data);
	}
	cbKort.events.fireEvent('S4', {type: 'favoriteHit', favorite: hit.data});
}

function profileHit(hit){
    _s4View.blur();
	if (ProfileSelector){
		ProfileSelector.setProfile(hit.data);
	}
	cbKort.events.fireEvent('S4', {type: 'profileHit', profile: hit.data});
}

function workspaceHit(hit){
    _s4View.blur();
	var workspaceId = hit.data.wrkspcid;
	if (typeof workspace_container !== 'undefined' ){
		if (typeof workspace_controls == 'undefined' ){
			//Workspace version2
			if (workspace_container === null) {
				var workspacejs = cbInfo.getParam('cbkort.module.workspace.js');
				if (workspacejs === ""){
					workspacejs = cbInfo.getParam('module.workspace.js');
				}
	            require([workspacejs,'/js/standard/color.js'], Septima.bind(function(workspaceId) {
	                workspace_container = new Workspace ({name:'standard'});
	                s4ShowWorkSpace2(workspaceId);
	            }, this, workspaceId));
	        }else{
	            s4ShowWorkSpace2(workspaceId);
	        }
		}else{
			//Workspace version3
            if (workspace_container === null) {
				var workspacejs = cbInfo.getParam('module.workspace.js');
				var spatialmapVersion = cbInfo.getParam('spatialmap.version');
	            require([workspacejs + '?ver=' + spatialmapVersion, '/js/standard/color.js'], Septima.bind(function(workspaceId) {
	                workspace_container = new Workspace ({name:'standard', controlList: workspace_controls});
		            s4ShowWorkSpace3(workspaceId);
	            }, this, workspaceId));
	        } else {
	            s4ShowWorkSpace3(workspaceId);
	        }
		}
		cbKort.events.fireEvent('S4', {type: 'workspaceHit', workspace: hit.data});
	}
}

function s4ShowWorkSpace2(workspaceId){
    var options = {id: workspaceId};
    if (jQuery.isFunction( workspace_init )){
    	options.hideDialog = false;
    }else{
    	options.hideDialog = true;
    }
    workspace_container.start (options);
}

function s4ShowWorkSpace3(workspaceId){
    var options = {id: workspaceId};
    if (jQuery.isFunction( workspace_init )){
    	options.hideDialog = false;
    }else{
    	options.hideDialog = true;
    }
    workspace_container.startDrawing (options);
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
	
    showResultInMap(result);
	
	print_getConfig(_s4Params.view.printconfig);
	var freetext_print_input = jQuery('#' + _s4Params.view.printconfig + '_freetext_print_input');
	if (freetext_print_input.length == 1){
		freetext_print_input.val(result.title);
	}else{
		setTimeout(function(){jQuery('#' + _s4Params.view.printconfig + '_freetext_print_input').val(result.title);}, 500);
	}
	cbKort.events.fireEvent('S4', {type: 's4DoPrint', result: result});
}


function s4_getGstAuthParams(){
//	var ticket = null;
//	var cbHttp = new CBhttp ();    	
//	cbHttp.setMethod('get');
// 	try{  
//	     var pcomp = cbHttp.executeUrl ('/cbkort?page=s4getkmsticket&ts=' + Math.floor((Math.random() * 100) + 1) , false);
//	   	 var col = pcomp.get(0);
//	   	 if(col != null){
//	   		 ticket = col.getValue();
//	   	 }
//   }catch(e){
// 		return null;
// 	}
//	return {ticket: ticket};

	var login = cbInfo.getParam('s4.gst.login');
	var password = cbInfo.getParam('s4.gst.password');
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
    	this.defaultText = cbInfo.getString('spatialquery.lastdisplayed.hint');
        this.dialog = new Dialog(cbInfo.getString('spatialquery.lastdisplayed.dialogtitle'));
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
                '            <button class="menubutton" onclick="searchlast2.search();">'+cbInfo.getString('standard.button.ok')+'</button>' +
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
	    getElement('Searchlast2_searchtext').innerHTML = cbInfo.getString('spatialquery.show_info_about')+' '+this.searchText;
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
    showWaitingBox(cbInfo.getString('standard.message.getting_data'));
    
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
    
    var searchtext = (this.searchText || cbInfo.getString('spatialquery.lastdisplayed.searchtext'));
    spatialquery_doQuery("userdatasource", url, searchtext, null);
    
    hideWaitingBox();
}
var searchlast2 = new Searchlast2();


 
