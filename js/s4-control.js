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
        
        //Set up adress searcher
        if (this.options.adresssearcher && this.options.adresssearcher.enabled){
        	var adressSearchOptions = {apiKey: this.options.adresssearcher.apiKey, onSelect: this.options.onSelect};
        	if (this.options.municipality != "*"){
        		adressSearchOptions.area = "muncode0" + this.options.municipality;
        	}
        	var adressSearcher = new Septima.Search.AddressSearcher(adressSearchOptions);
        	searchers.push({"title": "Adresser", "searcher" : adressSearcher});
        }
        
        if (this.options.geosearcher && this.options.geosearcher.enabled){
        	var kmsTicket = s4_getKMSTicket();
        	if (kmsTicket != null){
            	var geoSearchOptions = {
            			targets: this.options.geosearcher.targets,
            			authParams: {ticket: kmsTicket},
            		    onSelect: this.options.onSelect
            	    };
            	if (this.options.municipality != "*"){
            		geoSearchOptions.area = "muncode0" + this.options.municipality;
            	}
            	var geoSearcher = new Septima.Search.GeoSearch(geoSearchOptions);
            	searchers.push({"title": "", "searcher" : geoSearcher});
        	}
        }
        
        if (this.options.cvrsearcher && this.options.cvrsearcher.enabled){
        	var cvr_enhedSearchOptions = {onSelect: this.options.onSelect};
        	var se = new Septima.Search.CVR_enhedSearcher(cvr_enhedSearchOptions);
        	if (this.options.municipality != "*"){
            	se.filter = { 'kom_id_officiel' : this.options.municipality };
        	}
        	searchers.push({"title": "Virksomheder", "searcher" : se});
        }

        if (this.options.plansearcher && this.options.plansearcher.enabled){
        	var planSearchOptions = {onSelect: this.options.onSelect};
        	var planSearcher = new Septima.Search.PlanSearcher(planSearchOptions);
        	if (this.options.municipality != "*"){
        		planSearcher.filter = { 'komnr' : this.options.municipality };
        	}
        	searchers.push({"title": "Lokalplaner", "searcher" : planSearcher});
        }
    	
        if (this.options.indexsearcher && this.options.indexsearcher.enabled){
        	var s4IndexSearcherOptions = {onSelect: this.options.onSelect, datasources: this.options.indexsearcher.datasources};
        	var s4IndexSearcher = new Septima.Search.S4IndexSearcher(s4IndexSearcherOptions);
        	searchers.push({title: "Objekter", searcher: s4IndexSearcher});
        }
    	
    	this.view = new Septima.Search.DefaultView({input:this.options.div, placeholder:this.options.placeHolder, limit: this.options.view.limit});
    	
    	var controllerOptions = {};
    	var controller = new Septima.Search.Controller(searchers, this.view, controllerOptions);
    	controller.go ();
    	
    },
    
    showFixedText: function (text, hideCallback){
    	this.view.showFixedText(text, hideCallback);
    },
    
    clear: function(){
    	this.view.doTextSearch("");
    },
	
	
	CLASS_NAME: 'Septima.Search.S4Control'

});
