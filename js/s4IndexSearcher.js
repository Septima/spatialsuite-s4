Septima.Search.S4IndexSearcher = Septima.Class (Septima.Search.Searcher, {

    indexedDatasources: null,
    datasourcesToSearch: "*", 
    
    hasTarget: function (target) {
    	for (var i=0;i<this.indexedDatasources.length;i++){
    		if (target.toLowerCase() == this.indexedDatasources[i].featuretypesingle.toLowerCase() || target.toLowerCase() == this.indexedDatasources[i].featuretypeplural.toLowerCase()){
    			return true;
    		}
    	}
    	return false;
    },
    
    initialize: function (options) {
		this.Searcher(options);
		if (options == undefined){
			throw "New Septima.Search.S4IndexSearcher(options): Options missing.";
		}
	    this.indexProtocol = options.indexProtocol;
	    this.indexHost = options.indexHost;
	    this.indexPort = options.indexPort;
	    //this.indexedDatasources = [];
	    if (options.datasources == undefined){
		    this.datasourcesToSearch = "*";
	    }else{
		    this.datasourcesToSearch = options.datasources;
		    if (this.datasourcesToSearch == "" || this.datasourcesToSearch == " "){
			    this.datasourcesToSearch = "*";
		    }
	    }
    },
    
    getDatasources: function(postCall){
    	jQuery.ajax({
            url: this.indexProtocol + '//' + this.indexHost + ':' + this.indexPort + '/jsp/modules/s4/getDatasources.jsp',
	        dataType: 'json',
            cache : false,
            timeout : 2000,
            //crossDomain : true,
            //async:true,
            success:  Septima.bind(function(postCall, data, textStatus,  jqXHR){
            	this.indexedDatasources = [];
            	for (var i=0;i<data.results.length;i++){
            		var datasource = data.results[i].datasource;
            		if (datasource.featurecount > 0 && this.inDatasourcesToSearch(datasource.id)){
                		this.indexedDatasources.push(datasource);
            		}
            	}
            	if (postCall !== null){
            		postCall();
            	}
          }, this, postCall)
          });
    },
    
    inDatasourcesToSearch: function(datasource){
    	if (this.datasourcesToSearch == "*"){
    		return true;
    	}else{
        	var arrDatasourcesToSearch = this.datasourcesToSearch.split(" ");
        	for (var i=0;i<arrDatasourcesToSearch.length;i++){
        		if (arrDatasourcesToSearch[i].toLowerCase()==datasource.toLowerCase()){
        			return true;
        		}
        	}
    	}
    	return false;
    },
    
    getDatasourceIdFromTarget: function(target){
    	for (var i=0;i<this.indexedDatasources.length;i++){
    		if (target.toLowerCase() == this.indexedDatasources[i].featuretypesingle.toLowerCase() || target.toLowerCase() == this.indexedDatasources[i].featuretypeplural.toLowerCase()){
    			return this.indexedDatasources[i].id;
    		}
    	}
    	return "";
    },
    
    fetchData: function (query, caller) {
    	if (this.indexedDatasources == null){
    		var postCall = Septima.bind(function(query, caller){this.fetchData(query, caller);}, this, query, caller);
    	    this.getDatasources(postCall);
    	    return;
    	}

    	var datasources = this.datasourcesToSearch;

    	if (query.hasTarget){
    		if (this.hasTarget(query.target)){
        		datasources = this.getDatasourceIdFromTarget(query.target);
    		}
    	}
    	
    	this.request = jQuery.ajax({
            url: this.indexProtocol + '//' + this.indexHost + ':' + this.indexPort + '/jsp/modules/s4/queryIndex.jsp',
            data: {query:query.queryString, limit: query.limit, datasources: datasources},
	        dataType: 'jsonp',
            cache : false,
            //contentType: "application/x-www-form-urlencoded;charset=utf-8",
            timeout : 10000,
            crossDomain : true,
            async:true,
	        success : Septima.bind(function (caller, query, data, textStatus,  jqXHR) {
                data.query = query;
	        	this.success (caller, data, textStatus,  jqXHR);
	        },this, caller, query),
	        error : Septima.bind(function (caller, jqXHR, textStatus, errorThrown) {
	        	this.error (caller, jqXHR, textStatus, errorThrown);
	        },this, caller)     
          });
    },
    

	success : function(caller, data, textStatus, jqXHR) {
		if (caller.isActive()) {
			if (jqXHR.status == 200) {
				caller.fetchSuccess(this.parseResult(data));
			} else {
				caller.fetchError(this, jqXHR.statusText);
			}
		}

	},
    
    error: function(caller, jqXHR, textStatus, errorThrown){
        caller.fetchError(this, errorThrown);
    },
    
    parseResult: function (data) {
        var queryResult = this.createQueryResult();
        var query = data.query;

        if (!query.hasTarget) {
        	for (var i=0;i<this.indexedDatasources.length;i++){
        		if (this.indexedDatasources[i].featuretypesingle.toLowerCase().indexOf(query.queryString.toLowerCase()) == 0){
                    queryResult.addSuggestion( this.indexedDatasources[i].featuretypesingle, this.indexedDatasources[i].featuretypesingle + ':');
        		}
        	}
        }
        
        for (var i=0;i<data.results.length;i++){
        	var result = data.results[i];
        	var datasource = result.datasource;
        	if (result.type == 'DatasourceWithMatchingFeaturesIncluded'){
        		for (var j=0;j<result.features.length;j++){
        			var feature = result.features[j];
        	        if (query.hasTarget) {
                        queryResult.addResult(feature.title, feature.description + " " + this.getFeatureLinksAsHtml(feature), feature.wkt, feature);
        	        }else{
                        queryResult.addResult(feature.title, datasource.featuretypesingle + " " + feature.description + " " + this.getFeatureLinksAsHtml(feature), feature.wkt, feature);
        	        }
        		}
        	}else if (result.type == 'DatasourceWithMatchingFeatures'){
        		queryResult.addNewQuery(datasource.featuretypeplural +  " (" + datasource.featurecount + ")",  "Der er fundet " + datasource.featurecount + " " + datasource.featuretypeplural + " , der matcher <em>" + query.queryString + "</em>", datasource.featuretypesingle + ": " + query.queryString, null, null, null)
        	}
        }
        
        return queryResult;
    },
    
	onSelect: function(result){
        if (!result.newquery){
            this._onSelectCallback(result);
        }
	},
	
	getFeatureLinksAsHtml: function(feature){
    	var html = "";
    	for (var i=0;i<feature.pcol.row.length;i++){
    		var row = feature.pcol.row[i];
    		if (row.format == 'hyperlink'){
    			if (html.length>0){
    				html += " - ";
    			}
    			html += "<a href='" + row.value + "' target= '_blank'>" + row.label + "</a>";
    		}
    	}
        return html;
	},

    getCustomButtonDefs: function(result){
        if (!result.newquery){
        	var linkButtons = [];
        	for (var i=0;i<result.data.pcol.row.length;i++){
        		var row = result.data.pcol.row[i];
        		if (row.format == 'hyperlink'){
        			//linkButtons.push({"buttonText":row.label, "callBack": Septima.bind( this.openHyperLink, this)});
        		}
        	}
            return linkButtons.concat(this.customButtonDefs);
        }else{
            return [];
        }
    },
    
    openHyperLink: function(result){
    	window.open(result.data.pcol.row[i].value, "_blank");
    },

    CLASS_NAME: 'Septima.Search.S4IndexSearcher'
    	
});