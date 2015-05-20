Septima.Search.workspaceSearcher = Septima.Class (Septima.Search.DataSearcher, {

    initialize: function (options) {
    	this.iconURI =       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB80lEQVR4XqWMO2tUURhF13fmkipoFDSFYrCxiZBgbNTSJn9AnEL9AYJB7U1hlXRmUASFCCJCXgYEMzh5gRJtUhhMK0RRMIqFyGQycx/bc89FBiURwQWbc1h8e5sk/gdrzLDi4HTJQIIkAwTOQXDs7jLjFdvTqFZ9qsr4kl4uTEubt6RPFdXmZr1b3tG9mJ/yrqKG79KYQvo4pJtXjuvEmfMaudonvUZaQTeH+r0r/+H61H/qnOZm7yp+glwGsF3jxuV1Lg1+pvruLKPVQdiLd2+4MLjJ3C/Xlbs1Lvq7R8+bOAf27TEbnR30dERAiUCWQpwS6PDOHGRZkcgVdwi+N3gP0AsMXBu+r+vD95T/d8sOd71oFkYrk4zdeaCx2+MaGZtA0xBPQssnnoLERzP53US4y+M7oRs9bFY53N2khEMScepYPfaB7WZGkibESUqWJGRZi0PxBpGVAEiJyLv2rFrDTKAAR3qOWqsZ04oT0jQJI2mS+jcfihGpDBCYZETORMCseJDMiZIPElkGMmE+knDOwmsQnB8wCoJh/e0ahQr+tz8SXfv2I9pE5hztvlEul0/yF+YXFleR2p3FpWUKkJlhnq9fNnFhuE2WZRw42I0KAAwgamxttdeCNjo791Cv/8AsGCQFt1Wvg4TYmYEibf7l7if3nz3WIn/amwAAAABJRU5ErkJggg==";
    	this.workspaceRowList = {row: []};
    	this.lastUpdated = null;
    	this.host = options.host;
    	this.sessionId = options.sessionId;
		options.searchableData =  new Septima.Search.SearchableRowList({
    		data: Septima.bind(function(){return this.workspaceRowList;}, this),
    		singular: options.singular,
    		plural: options.plural,
    		searchProperties: ['owner','name'],
    		getDisplayname: function (row){return row.name +' ('+ row.owner +')';}
    	});
		
    	Septima.Search.DataSearcher.prototype.initialize.apply(this, [options]);

        cbKort.events.addListener ('WORKSPACE_CHANGED', Septima.bind(function(event, favorite){
        	this.readWorkspaces();
        }, this));
    },

    fetchData: function (query, caller) {
        var now = new Date().getTime();
    	if (this.lastUpdated == null || (now - this.lastUpdated) > 60 * 1000){
        	this.readWorkspaces(Septima.bind(function(query, caller){
        		Septima.Search.DataSearcher.prototype.fetchData.apply(this, [query, caller]);
        	}, this, query, caller));
    	}else{
    		Septima.Search.DataSearcher.prototype.fetchData.apply(this, [query, caller]);
    	}
    },
    
    readWorkspaces: function(success){
    	jQuery.ajax({
    		url: this.host + '/cbkort?page=workspace.getlist&outputformat=json',
            jsonp: 'json.callback',
            data:{sessionId: this.sessionId},
	        dataType: 'jsonp',
            crossDomain : true,
            async:true,
            cache : false,
            timeout : 4000,
            success:  Septima.bind(function(success, data, textStatus,  jqXHR){
            	if (data.row[0]._class == 'rowlist'){
                	var workspaceRowList = data.row[0];
            		this.workspaceRowList = workspaceRowList;
                    var now = new Date().getTime();
            		this.lastUpdated = now;
            	}else{
            		this.workspaceRowList = {row: []};
            	}
            	if (typeof success !== 'undefined' && success != null && jQuery.isFunction(success)){
            		success();
            	}
          }, this, success)
          });
    },

    CLASS_NAME: 'Septima.Search.workspaceSearcher'

});