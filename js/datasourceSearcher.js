Septima.Search.DatasourceSearcher = Septima.Class (Septima.Search.Searcher, {

    initialize: function (options) {
		if (options == undefined){
			throw "New Septima.Search.DatasourceSearcher(options): Options missing.";
		}
		
		options.usesGeoFunctions = true;
		
		if (typeof options.onSelect === 'undefined'){
			options.onSelect = s4Hit;
		}
		
        this.datasource = options.datasource;
        
		//default source
		this.source = this.datasource;
        if (options.source){
            this.source = options.source;
        }else{
            options.source = this.source;
        }
        
        //default type
        this.type = this.source;
        if (options.type){
            this.type = options.type;
        }
		
		this.Searcher(options);
		
        this.registerType(this.source, this.type);
        
        this.hyperLinkLabel = options.hyperLinkLabel;
		
	    this.iconURI = options.iconURI || null;
    },
    
    
    fetchData: function (query, caller) {
    	var limit = query.limit + 1;
    	var queryString = jQuery.trim(query.queryString);
    	if (queryString == ''){
    		queryString = '%';
    	}
    	var xhr = jQuery.ajax({
    		url: '/cbkort?page=s4SearchDatasource&outputformat=json',
            jsonp: 'json.callback',
            data:{sessionId: cbKort.sessionId, query: queryString, limit: limit, datasource: this.datasource},
	        dataType: 'jsonp',
            crossDomain : true,
            async:true,
            cache : false,
            timeout : 4000,
	        success : Septima.bind(function (caller, query, data, textStatus,  jqXHR) {
                data.query = query;
	        	this.success (caller, data, textStatus,  jqXHR);
	        },this, caller, query),
	        error : Septima.bind(function (caller, jqXHR, textStatus, errorThrown) {
	        	if (textStatus.toLowerCase() != 'abort' ){
		        	this.error (caller, jqXHR, textStatus, errorThrown);
	        	}
	        },this, caller)     
        });
    },
    
	success: function(caller, data, textStatus, jqXHR){
		if (jqXHR.status == 200){
			caller.fetchSuccess(this.getDataFromDatasource(data));
		}else{
			caller.fetchError(this, jqXHR.statusText);
		}
	},

	error: function(caller, jqXHR, textStatus, errorThrown){
		caller.fetchError(this, errorThrown);
	},

	getDataFromDatasource: function (data){
		var queryResult = this.createQueryResult();
		if (data.row[0]._class == 'rowlist'){
			var query = data.query;
	        var count = data.row[0].row.length;

	        if (count <= query.limit || query.type === 'list') {
	            for (var i = 0; i < count; i++){
	                var thisHit = data.row[0].row[i];
	                var resultGeometry = null;
	                if (thisHit.shape_wkt){
	                    resultGeometry = this.translateWktToGeoJsonObject(thisHit.shape_wkt);
	                }
                    var description = thisHit['description'] || "";
                    if (thisHit['url']){
                        if (typeof this.hyperLinkLabel === 'undefined'){
                            this.hyperLinkLabel = cbKort.getSession().getString('s4.DatasourceSearcher.hyperLinkLabel');
                        }
                    	description = description + " " + "<a href='" + thisHit['url'] + "' target='blank'>" + this.hyperLinkLabel + "</a>";
                    }
                    var result1 = queryResult.addResult(this.source, this.type, thisHit['heading'], description, resultGeometry, thisHit);
                    if (query.type == 'list') {
                        result1.image = this.iconURI;
                    }
	            }
	        } else {
	        	var result2 = queryResult.addNewQuery(this.source, this.type, this.type, null, query.queryString, null, null);
	        }
		}
	    return queryResult;
	},

    CLASS_NAME: 'Septima.Search.DatasourceSearcher'
    
});
