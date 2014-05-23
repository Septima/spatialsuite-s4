var _s4View = null;
var _s4Params = null;

function s4_getDefaultParams(){
	return {
		municipality: '*', 
		view:{limit: 20, blankbehavior: "search", dynamiclayer: 'userdatasource', infoprofilequery: 'userdatasource'},
        adresssearcher:{enabled: false, info: true, apiKey: "FCF3FC50-C9F6-4D89-9D7E-6E3706C1A0BD", streetNameHit: false},
        geosearcher:{enabled: true, info: true, targets: ['adresser','stednavne', 'kommuner', 'matrikelnumre', 'opstillingskredse', 'politikredse', 'postdistrikter', 'regioner', 'retskredse'], streetNameHit: false},
        cvrsearcher:{enabled: true, info: true},
        plansearcher:{enabled: true, info: true},
        indexsearcher:{enabled: true, info: true, datasources: "*"},
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
                if (jQuery("#panel-brand div.right").length == 1){
                    if (jQuery("#panel-brand").is(":visible")){
                        jQuery("#panel-brand div.right").append(inputContainer);
                        var brandPanel = jQuery("#panel-brand");
                        inputContainer.css("top", "+=" + brandPanel.offset().top + "px");
                    } else{
                        jQuery("body").append(inputContainer);
                        inputContainer.addClass("nopanel");
                        var menuBar = jQuery("#panel-middle");
                        inputContainer.css("top", "+=" + menuBar.offset().top + "px");
                        
                        
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
                    }
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
            }
            
            if (_s4Params.geosearcher && _s4Params.geosearcher.enabled){
            	var kmsTicket = s4_getKMSTicket();
            	if (kmsTicket != null){
                	var geoSearchOptions = {
                			targets: _s4Params.geosearcher.targets,
                			authParams: {ticket: kmsTicket},
                		    onSelect: s4GeoHit, matchesPhrase: matchPhrase
                	    };
                	if (_s4Params.municipality != "*"){
                		geoSearchOptions.area = "muncode0" + _s4Params.municipality;
                	}
                	var geoSearcher = new Septima.Search.GeoSearch(geoSearchOptions);
                	controller.addSearcher({"title": "", "searcher" : geoSearcher});
                    if (_s4Params.geosearcher.info){
                    	geoSearcher.addCustomButtonDef(infoButtonDef);
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
				controller.addSearcher(_s4Searchers[i]);
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
            }
        	
            if (_s4Params.plansearcher && _s4Params.plansearcher.enabled){
            	var planSearchOptions = {onSelect: s4Hit, matchesPhrase: matchPhrase};
            	var planSearcher = new Septima.Search.PlanSearcher(planSearchOptions);
            	if (_s4Params.municipality != "*"){
            		planSearcher.filter = { 'komnr' : _s4Params.municipality };
            	}
            	controller.addSearcher({"title": "Lokalplaner", "searcher" : planSearcher});
                if (_s4Params.plansearcher.info){
                	planSearcher.addCustomButtonDef(infoButtonDef);
                }
            }
        	
            if (_s4Params.cvrsearcher && _s4Params.cvrsearcher.enabled){
            	var cvr_enhedSearchOptions = {onSelect: s4Hit, matchesPhrase: matchPhrase};
            	var se = new Septima.Search.CVR_enhedSearcher(cvr_enhedSearchOptions);
            	if (_s4Params.municipality != "*"){
                	se.filter = { 'kom_id_officiel' : _s4Params.municipality };
            	}
            	controller.addSearcher({"title": "Virksomheder", "searcher" : se});
                if (_s4Params.cvrsearcher.info){
                	se.addCustomButtonDef(infoButtonDef);
                }
            }

            if ((_s4Params.themesearcher && _s4Params.themesearcher.enabled) || (_s4Params.clientsearcher && _s4Params.clientsearcher.enabled)){
	            var themeSearcher = new Septima.Search.ThemeSearcher({});
	            controller.addSearcher({"title": cbInfo.getString('s4.themesearcher.themes'), "searcher" : themeSearcher});
            }

            if (_s4Params.workspacesearcher && _s4Params.workspacesearcher.enabled && typeof workspace_container !== 'undefined'){
            	controller.addSearcher({title: cbInfo.getString('s4.workspacesearcher.workspaces'), searcher: new Septima.Search.workspaceSearcher({
        			host: "",
        			onSelect: workspaceHit,
            		singular: cbInfo.getString('s4.workspacesearcher.workspace'),
            		plural: cbInfo.getString('s4.workspacesearcher.workspaces'),
            		sessionId: sessionId
        		})});
            }

            if (typeof(ProfileSelector) != 'undefined' && _s4Params.profilesearcher && _s4Params.profilesearcher.enabled){
            	controller.addSearcher({title: cbInfo.getString('s4.profilesearcher.profiles'), searcher: new Septima.Search.ProfileSearcher({
        			host: "",
        			onSelect: profileHit,
            		singular: cbInfo.getString('s4.profilesearcher.profile'),
            		plural: cbInfo.getString('s4.profilesearcher.profiles'),
            		sessionId: sessionId
        		})});
            }
            
            if (typeof(Favorites) != 'undefined' && _s4Params.favoritesearcher && _s4Params.favoritesearcher.enabled){
        		controller.addSearcher({title: cbInfo.getString('s4.favoritesearcher.favorites'), searcher: new Septima.Search.FavoriteSearcher({
        			host: "",
        			onSelect: favoriteHit,
            		singular: cbInfo.getString('s4.favoritesearcher.favorite'),
            		plural: cbInfo.getString('s4.favoritesearcher.favorites'),
            		sessionId: sessionId
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
    _s4View.blur();
	for (var i = 0; i < _s4OnSelect.length;i++){
		if (!_s4OnSelect[i](result)){
			return;
		}
	}
	if (result.geometry){
		var geojson = new OpenLayers.Format.GeoJSON();
	    var olGeom = geojson.read(result.geometry, 'Geometry');
		var wkt = olGeom.toString();
	    cbKort.dynamicLayers.addWKT ({name: _s4Params.view.dynamiclayer, wkt:wkt, clear:true});
	    cbKort.dynamicLayers.zoomTo (_s4Params.view.dynamiclayer, '100');
	}
}


function favoriteHit(hit){
    _s4View.blur();
	if (Favorites){
		Favorites.load(hit.data);
	}
}

function profileHit(hit){
    _s4View.blur();
	if (ProfileSelector){
		ProfileSelector.setProfile(hit.data);
	}
}

function workspaceHit(hit){
    _s4View.blur();
	var workspaceId = hit.data.wrkspcid;
	if (typeof workspace_container !== 'undefined' ){
		if (workspace_container === null) {
            require([cbInfo.getParam('cbkort.module.workspace.js'),'/js/standard/color.js'], Septima.bind(function(workspaceId) {
                workspace_container = new Workspace ({name:'standard'});
                s4ShowWorkSpace(workspaceId);
            }, this, workspaceId));
        }else{
            s4ShowWorkSpace(workspaceId);
        }
	}
}

function s4ShowWorkSpace(workspaceId){
    var options = {id: workspaceId};
    if (jQuery.isFunction( workspace_init )){
    	options.hideDialog = false;
    }else{
    	options.hideDialog = true;
    }
    workspace_container.start (options);
}

function s4DoInfo(result){
	s4Hit(result);
    searchlast2.showDialog(result.title);
}

function s4_getKMSTicket(){
	var ticket = null;
	var cbHttp = new CBhttp ();    	
 	try{  
	     var pcomp = cbHttp.executeUrl ('/cbkort?page=s4getkmsticket', false);
	   	 var col = pcomp.get(0);
	   	 if(col != null){
	   		 ticket = col.getValue();
	   	 }
   }catch(e){
 		return ticket;
 	}
	return ticket;
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


 
