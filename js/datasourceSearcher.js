Septima.Search.DatasourceSearcher = Septima.Class (Septima.Search.Searcher, {

    initialize: function (options) {
		if (options == undefined){
			throw "New Septima.Search.DatasourceSearcher(options): Options missing.";
		}
		
		options.usesGeoFunctions = true;
		if (options.matchesPhrase === undefined){
			options.matchesPhrase = cbInfo.getString('s4.list.matchphrase');
		}
		
		if (options.onSelect === undefined){
			options.onSelect = s4Hit;
		}
		this.Searcher(options);
		//Options
	    this.datasource = options.datasource;
	    this.hyperLinkLabel = options.hyperLinkLabel || cbInfo.getString('s4.DatasourceSearcher.hyperLinkLabel');
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
    	
	    caller.registerOnCancelHandler ( Septima.bind(function (xhr) {
	    	if (xhr && xhr.readystate != 4){
	    		xhr.abort();
	    	}
	    },this, xhr));
    },
    
	success: function(caller, data, textStatus, jqXHR){
		if (caller.isActive()){
			if (jqXHR.status == 200){
				caller.fetchSuccess(this.getDataFromDatasource(data));
			}else{
				caller.fetchError(this, jqXHR.statusText);
			}
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

	        if (count <= query.limit || query.type == 'list.force') {
	            for (var i = 0; i < count; i++){
	                var thisHit = data.row[0].row[i];
	                var resultGeometry = null;
	                if (thisHit.shape_wkt){
	                    resultGeometry = this.translateWktToGeoJsonObject(thisHit.shape_wkt);
	                }
                    var description = thisHit['description'] || "";
                    if (thisHit['url']){
                    	description = description + " " + "<a href='" + thisHit['url'] + "' target='blank'>" + this.hyperLinkLabel + "</a>";
                    }
                    var result1 = queryResult.addResult(thisHit['heading'], description, resultGeometry, thisHit);
                    if (query.type == 'list') {
                        result1.image = this.iconURI;
                    }
	            }
	        } else {
				var description = null;
				if (query.queryString.length > 0){
					description = this.title + ", som " + this.getMatchesPhrase() +" <em>" + query.queryString + "</em>";
				}
	        	
	        	var result2 = queryResult.addNewQuery(this.title, description, query.queryString, null, null);
				if (query.queryString.length > 0 || this.iconURI == null){
		            result2.image = this.folderIconURI;
				}else{
		            result2.image = this.iconURI;
				}
	        }
		}
	    return queryResult;
	},

    CLASS_NAME: 'Septima.Search.DatasourceSearcher'
    
});
