Septima.Search.ProfileSearcher = Septima.Class (Septima.Search.Searcher, {
    
    host: '/cbkort',
    page: 'profileselector_get_profiles',
    profiles: null,
    
    initialize: function (options) {
        this.Searcher(options);
        if (options.host) {
            this.host = options.host;
        }
    },
    
    getCustomButtonDefs: function(result){
        if (!result.newquery){
            return this.customButtonDefs;
        }else{
            return [];
        }
    },
    
    fetchData: function (query, caller) {
    	if (this.profiles !== null) {
        	var data = {
        		query: query,
        		profiles: this.match(query, this.profiles)
        	}
            this.success (caller, data, 'OK', {status: 200});
    	} else {
	        $.ajax({
	            url: this.host,
	            data: {
	                page: this.page,
	                'cbinfo.output': 'json',
	                outputformat: 'json'
	            },
	            jsonp: 'json.callback',
	            dataType: 'jsonp',
	            cache : false,
	            timeout : 10000,
	            crossDomain : true,
	            success : Septima.bind(function (caller, query, data, textStatus,  jqXHR) {
	            	this.profiles = data.row[0].row;
	            	var data = {
	            		query: query,
	            		profiles: this.match(query, this.profiles)
	            	}
	                this.success (caller, data, textStatus,  jqXHR);
	            },this, caller, query),
	            error : Septima.bind(function (caller, jqXHR, textStatus, errorThrown) {
	                this.error (caller, jqXHR, textStatus, errorThrown);
	            },this,caller)
	        });
    	}
    },
    
    match: function (query, profiles) {
    	var returnProfiles = [];
		var patt=new RegExp(query.queryString,'i');
    	for (var i=0;i<profiles.length;i++) {
    		if (profiles[i].displayname != '' && (patt.test(profiles[i].displayname) || patt.test(profiles[i].name))) {
    			returnProfiles.push(profiles[i]);
    		}
    	}
    	return returnProfiles;
    },
    
    success: function(caller, data, textStatus, jqXHR){
        if (jqXHR.status == 200){
            caller.fetchSuccess(this.transformSqResultToList(data));
        }else{
            caller.fetchError(this, jqXHR.statusText);
        }
    },
    
    error: function(caller, jqXHR, textStatus, errorThrown){
        caller.fetchError(this, errorThrown);
    },
    
    transformSqResultToList: function(result){
        var queryResult = this.createQueryResult();
        var profiles = result.profiles;
        for (var i=0;i<profiles.length;i++){
        	queryResult.addResult(profiles[i].displayname, '', null, profiles[i]);
        }
        return queryResult;
    },

    CLASS_NAME: 'Septima.Search.ProfileSearcher'
    
});
