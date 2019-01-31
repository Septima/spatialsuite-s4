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
    	var inputPlaceHolder = cbKort.getSession().getString('s4.input.placeholder');
    	var matchPhrase = cbKort.getSession().getString('s4.list.matchphrase');

    	var searchIndexToken = null;
    	
    	if ((this.options.cvrsearcher && this.options.cvrsearcher.enabled) || (this.options.plansearcher && this.options.plansearcher.enabled)){
        	var searchIndexTokenParamName = 's4.searchindex.token';
        	searchIndexToken = cbKort.getSession().getParam(searchIndexTokenParamName);
        	if (searchIndexToken === searchIndexTokenParamName){
        		searchIndexToken = null;
        	}
    	}
    	
    	var gstAuthParams = null;
    	
        if ((this.options.geosearcher && this.options.geosearcher.enabled) || (this.options.geostednavnesearcher && this.options.geostednavnesearcher.enabled)){
            gstAuthParams = s4_getGstAuthParams();
        }

        if (this.options.dawasearcher && this.options.dawasearcher.enabled){
            var dawaSearcherOptions = {onSelect: this.options.onSelect};
            if (this.options.municipality != "*"){
                var municipalities = this.options.municipality.split(' ');
                dawaSearcherOptions.kommunekode = municipalities.join('|');
            }
            if (typeof this.options.dawasearcher.minimumShowCount !== 'undefined'){
                dawaSearcherOptions.minimumShowCount = this.options.dawasearcher.minimumShowCount;
            }
            var dawaSearcher = new Septima.Search.DawaSearcher(dawaSearcherOptions);
            searchers.push({"searcher" : dawaSearcher});
        }
    	
    	
        if (this.options.geosearcher && this.options.geosearcher.enabled && gstAuthParams != null){
        	var geoSearchOptions = {
        			targets: this.options.geosearcher.targets,
        			authParams: s4_getGstAuthParams(),
        		    onSelect: this.options.onSelect
        	    };
        	if (this.options.municipality != "*"){
        		geoSearchOptions.area = this.options.municipality;
        	}
        	var geoSearcher = new Septima.Search.GeoSearch(geoSearchOptions);
        	searchers.push({"searcher" : geoSearcher});
        }

        if (this.options.geostednavnesearcher && this.options.geostednavnesearcher.enabled && gstAuthParams != null){
            var geoStednavnSearchOptions = {
                        authParams: s4_getGstAuthParams(),
                        onSelect: this.options.onSelect
                };
            
            if (this.options.municipality != "*"){
                geoStednavnSearchOptions.kommunekode = this.options.municipality;
            }
            var geoStednavnSearcher = new Septima.Search.GeoStednavnSearcher(geoStednavnSearchOptions);
            searchers.push({"searcher" : geoStednavnSearcher});
        }
        
        if (this.options.indexsearcher && this.options.indexsearcher.enabled){
        	var s4IndexSearcherOptions = {onSelect: this.options.onSelect, datasources: this.options.indexsearcher.datasources, matchesPhrase: matchPhrase, allowDetails: false};
        	var s4IndexSearcher = new Septima.Search.S4IndexSearcher(s4IndexSearcherOptions);
        	searchers.push({searcher: s4IndexSearcher});
        }
    	
        if (this.options.cvrsearcher && this.options.cvrsearcher.enabled && searchIndexToken !== null){
            var cvr_enhedSearchOptions = {
                    onSelect: this.options.onSelect,
                    searchindexToken: searchIndexToken
                   };
            if (this.options.municipality != "*"){
                cvr_enhedSearchOptions.kommunekode = this.options.municipality;
            }
            var se = new Septima.Search.CVR_enhedSearcher(cvr_enhedSearchOptions);
            searchers.push({"searcher" : se});
        }

        
        if (this.options.plansearcher && this.options.plansearcher.enabled && searchIndexToken !== null){
            var planSearchOptions = {onSelect: this.options.onSelect, matchesPhrase: matchPhrase, searchindexToken: searchIndexToken};
            if (this.options.municipality != "*"){
                planSearchOptions.kommunekode = this.options.municipality;
            }
            var planSearcher = new Septima.Search.PlanSearcher(planSearchOptions);
            searchers.push({"searcher" : planSearcher});
        }
        
    	var controllerOptions = {};
    	var controller = new Septima.Search.Controller(searchers, controllerOptions);

    	var container;
		if (this.options.div instanceof jQuery){
			container = this.options.div;
		}else{
			container = jQuery('#'+this.options.div);
		}
		container.addClass("s4control");

    	this.view = new Septima.Search.DefaultView({input: container, placeholder: this.options.placeHolder, limit: this.options.view.limit, controller: controller});
    	
    },
    
    showFixedText: function (text, hideCallback){
    	this.view.showFixedText(text, hideCallback);
    },
    
    clear: function(){
    	this.view.doTextSearch("");
    },
	
	
	CLASS_NAME: 'Septima.Search.S4Control'

});
