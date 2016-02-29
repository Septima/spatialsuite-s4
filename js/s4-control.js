Septima.Search.S4Control = Septima.Class ({
	view: null,
	
    initialize: function (options) {
    	this.options = options;
//        {div:'',
//    	  placeHolder:''
//        onSelect: function,
//        municipality: '101',
//        view:{limit: 20},
//        adresssearcher:{enabled: false, apiKey: "FCF3FC50-C9F6-4D89-9D7E-6E3706C1A0BD"},
//        geosearcher:{enabled: true, targets: ['*']},
//        // Full set of geosearcher targets is targets: ['adresser','stednavne', 'kommuner', 'matrikelnumre', 'opstillingskredse', 'politikredse', 'postdistrikter', 'regioner', 'retskredse']
//        cvrsearcher:{enabled: true},
//        plansearcher:{enabled: true},
//        indexsearcher:{enabled: true, datasources: "*"}};
    	
    	var searchers = [];
    	
    	//Get localized strings
    	var inputPlaceHolder = cbInfo.getString('s4.input.placeholder');
    	var matchPhrase = cbInfo.getString('s4.list.matchphrase');

    	var searchIndexToken = null;
    	
    	if ((this.options.cvrsearcher && this.options.cvrsearcher.enabled) || (this.options.plansearcher && this.options.plansearcher.enabled)){
        	var searchIndexTokenParamName = 's4.searchchindex.token';
        	searchIndexToken = cbInfo.getParam(searchIndexTokenParamName);
        	if (searchIndexToken === searchIndexTokenParamName){
        		//getParam returns paramName if param isn't defined
        		searchIndexToken = null;
        	}
    	}
    	
        if (this.options.geosearcher && this.options.geosearcher.enabled){
        	var geoSearchOptions = {
        			targets: this.options.geosearcher.targets,
        			authParams: s4_getGstAuthParams(),
        		    onSelect: this.options.onSelect
        	    };
        	if (this.options.municipality != "*"){
        		var municipalities = this.options.municipality.split(' ');
        		for (var i=0;i<municipalities.length;i++){
        			municipalities[i] = "muncode0" + municipalities[i]; 
        		}
        		geoSearchOptions.area = municipalities.join();
        	}
        	var geoSearcher = new Septima.Search.GeoSearch(geoSearchOptions);
        	searchers.push({"title": "", "searcher" : geoSearcher});
        }
        
        if (this.options.cvrsearcher && this.options.cvrsearcher.enabled && searchIndexToken !== null){
        	var cvr_enhedSearchOptions = {onSelect: this.options.onSelect, matchesPhrase: matchPhrase, searchindexToken: searchIndexToken};
        	if (this.options.municipality != "*"){
        		var municipalities = this.options.municipality.split(' ');
        		cvr_enhedSearchOptions.filter = { 'beliggenhedsadresse_kommune_kode' : municipalities };
        	}
        	var se = new Septima.Search.CVR_enhedSearcher(cvr_enhedSearchOptions);
        	searchers.push({"title": "Virksomheder", "searcher" : se});
        }

        
        if (this.options.plansearcher && this.options.plansearcher.enabled && searchIndexToken !== null){
        	var planSearchOptions = {onSelect: this.options.onSelect, matchesPhrase: matchPhrase, searchindexToken: searchIndexToken};
        	if (this.options.municipality != "*"){
        		var municipalities = this.options.municipality.split(' ');
        		planSearchOptions.filter = { 'komnr' : municipalities };
        	}
        	var planSearcher = new Septima.Search.PlanSearcher(planSearchOptions);
        	searchers.push({"title": "Lokalplaner", "searcher" : planSearcher});
        }
        
        if (this.options.indexsearcher && this.options.indexsearcher.enabled){
        	var s4IndexSearcherOptions = {onSelect: this.options.onSelect, datasources: this.options.indexsearcher.datasources, matchesPhrase: matchPhrase, allowDetails: false};
        	var s4IndexSearcher = new Septima.Search.S4IndexSearcher(s4IndexSearcherOptions);
        	searchers.push({title: "Objekter", searcher: s4IndexSearcher});
        }
    	
    	var controllerOptions = {};
    	var controller = new Septima.Search.Controller(searchers, controllerOptions);

    	this.view = new Septima.Search.DefaultView({input:this.options.div, placeholder:this.options.placeHolder, limit: this.options.view.limit, controller: controller});
    	
    },
    
    showFixedText: function (text, hideCallback){
    	this.view.showFixedText(text, hideCallback);
    },
    
    clear: function(){
    	this.view.doTextSearch("");
    },
	
	
	CLASS_NAME: 'Septima.Search.S4Control'

});
