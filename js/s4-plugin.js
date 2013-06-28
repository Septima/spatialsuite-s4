var _s4View = null;
var _s4Params = null;
var _s4InfoUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUU1QTJEM0ZENEE1MTFFMTlCQThDRkE0RUFCRDJCNjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUU1QTJENDBENEE1MTFFMTlCQThDRkE0RUFCRDJCNjkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFRTVBMkQzREQ0QTUxMUUxOUJBOENGQTRFQUJEMkI2OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFRTVBMkQzRUQ0QTUxMUUxOUJBOENGQTRFQUJEMkI2OSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pkcb7MAAAAC1SURBVHja7JOxDcMgEEUhSgU1S8AQULMAMzCWSwvX9CzBEq5NezFRgmQJMKTOb7g70NPxOTAAoJaO4wBKKUY3wi3IsizgvX/H1lqklGrCHq2NLyArhJAXmIZorUsspfztOln7vgMhBJ2+lPPDEOfcpcgY63ryrBW3bbvkQogMgVYnVU/WdcWc85L3rtw1dkZ/yCAkxggppZLn+KzNTawxBhpPX53aKiR3UoN8ZgdP/Z1RvQQYAMW3TIu2nixeAAAAAElFTkSuQmCC";

function s4_getDefaultParams(){
	return {
		municipality: '*', 
		view:{limit: 20, dynamiclayer: 'userdatasource', infoprofilequery: 'userdatasource'},
        adresssearcher:{enabled: false, info: true, apiKey: "FCF3FC50-C9F6-4D89-9D7E-6E3706C1A0BD"},
        geosearcher:{enabled: true, info: true, targets: ['adresser','stednavne', 'kommuner', 'matrikelnumre', 'opstillingskredse', 'politikredse', 'postdistrikter', 'regioner', 'retskredse']},
        cvrsearcher:{enabled: true, info: true},
        plansearcher:{enabled: true, info: true},
        indexsearcher:{enabled: true, info: true, datasources: "*"},
        clientsearcher:{enabled: true}};
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

        	//Set up search input box
        	if (jQuery("#panel-brand div.right").length == 1){
                jQuery("#panel-brand div.right").append('<div type="text" id="s4box" name="s4box" class="inputcontainer"/>');
        	}else{
                jQuery("body").append('<div type="text" id="s4box" name="s4box" class="inputcontainer v263"/>');
        	}

        	var searchers = [];
            var infoButtonDef = {"buttonText":infoButtonCaption, "buttonImage": _s4InfoUri,"callBack": s4DoInfo};
            
            //Set up adress searcher
            if (_s4Params.adresssearcher && _s4Params.adresssearcher.enabled){
            	var adressSearchOptions = {apiKey: _s4Params.adresssearcher.apiKey, onSelect: s4Hit};
            	if (_s4Params.municipality != "*"){
            		adressSearchOptions.area = "muncode0" + _s4Params.municipality;
            	}
            	var adressSearcher = new Septima.Search.AddressSearcher(adressSearchOptions);
            	searchers.push({"title": "Adresser", "searcher" : adressSearcher});
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
                		    onSelect: s4Hit
                	    };
                	if (_s4Params.municipality != "*"){
                		geoSearchOptions.area = "muncode0" + _s4Params.municipality;
                	}
                	var geoSearcher = new Septima.Search.GeoSearch(geoSearchOptions);
                	searchers.push({"title": "", "searcher" : geoSearcher});
                    if (_s4Params.geosearcher.info){
                    	geoSearcher.addCustomButtonDef(infoButtonDef);
                    }
            	}
            }
            
            if (_s4Params.cvrsearcher && _s4Params.cvrsearcher.enabled){
            	var cvr_enhedSearchOptions = {onSelect: s4Hit};
            	var se = new Septima.Search.CVR_enhedSearcher(cvr_enhedSearchOptions);
            	if (_s4Params.municipality != "*"){
                	se.filter = { 'kom_id_officiel' : _s4Params.municipality };
            	}
            	searchers.push({"title": "Virksomheder", "searcher" : se});
                if (_s4Params.cvrsearcher.info){
                	se.addCustomButtonDef(infoButtonDef);
                }
            }

            if (_s4Params.plansearcher && _s4Params.plansearcher.enabled){
            	var planSearchOptions = {onSelect: s4Hit};
            	var planSearcher = new Septima.Search.PlanSearcher(planSearchOptions);
            	if (_s4Params.municipality != "*"){
            		planSearcher.filter = { 'komnr' : _s4Params.municipality };
            	}
            	searchers.push({"title": "Lokalplaner", "searcher" : planSearcher});
                if (_s4Params.plansearcher.info){
                	planSearcher.addCustomButtonDef(infoButtonDef);
                }
            }
        	
            if (_s4Params.indexsearcher && _s4Params.indexsearcher.enabled){
            	var s4IndexSearcherOptions = {indexProtocol: location.protocol, indexHost: location.hostname, indexPort: location.port, onSelect: s4Hit, datasources: _s4Params.indexsearcher.datasources};
            	var s4IndexSearcher = new Septima.Search.S4IndexSearcher(s4IndexSearcherOptions);
            	searchers.push({title: "Objekter", searcher: s4IndexSearcher});
                if (_s4Params.indexsearcher.info){
                	s4IndexSearcher.addCustomButtonDef(infoButtonDef);
                }
            }
        	
            if (_s4Params.clientsearcher && _s4Params.clientsearcher.enabled){
	            var themeSearcher = new Septima.Search.ThemeSearcher({});
	          	searchers.push({"title": "Temaer", "searcher" : themeSearcher});
            }
        	
        	_s4View = new Septima.Search.DefaultView({input:"s4box", placeholder:inputPlaceHolder, limit: _s4Params.view.limit});
        	
        	var controllerOptions = {};
        	var controller = new Septima.Search.Controller(searchers, _s4View, controllerOptions);
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

function s4Hit(result){
	var wkt = result.geometry;
    cbKort.dynamicLayers.addWKT ({name: _s4Params.view.dynamiclayer, wkt:wkt, clear:true});
    cbKort.dynamicLayers.zoomTo (_s4Params.view.dynamiclayer, '100');
    _s4View.blur();
}

function s4DoInfo(result){
	var wkt = result.geometry;
	s4Hit(result);
    //spatialquery_markAndQuery (wkt, 2, _s4Params.view.infoprofilequery, false, _s4Params.view.dynamiclayer, result.title, false);
    searchlast2.showDialog(result.title);
    //searchlast.init();
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


 
