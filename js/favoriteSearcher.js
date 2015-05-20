Septima.Search.FavoriteSearcher = Septima.Class (Septima.Search.DataSearcher, {

    initialize: function (options) {
    	this.iconURI =       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QodDw4fkmBV9AAAAiVJREFUOMu9lN9LU3EYxj9fd862sx/pHG40w2mlRkwzo4LCwCSE7qPbuqiuvQu6qMvsrouwC+nCQuiimyAUbWlSFFIiMxsFqfkrNn+cbe1sZ7qdb39AQwdBz+XL8z68PM/7vlABki+q5eJwjayEK/YjxON9srHYgFML8yU3Rlv74z17qvYT1BOT2JsvYTXUU7X98d8mXPp0S3o9J1CbW7Hjx/o+RaoYJ9Q2ICoSNOYeyZXtV+hpFZfLgZZdp/H4TXbDdSiZIkpxk+WpQda0ZoK+FHphl9PHrkyLQ9fOlhUcG2qS3ZcHSBurCPMHmiOEVhfmt7mGVwuQzmWx59bRzRRudxBVDTM7cY/zV+dEWQ87Dp5hcrQfl4xT6wNxQEHPxnCZBjK7gk38xPTWEvI6cIocM6O3Oepp39vDufEncuPXHbq7LoLaimXqCGcMoTqhEAEhkcYSb99NU9d0l0jPdbFvKPHRPpncGOZkRxcefzUlPUWVs4kSq8hihtnPk/j8N2jpfSgqWhu3vxN7ycKlFDC3ZlDUDXby75GleURBYuVq0WoulE1ZKVdU9QkCLgMbCTRbmoK5gLRqsHu9kP9GwJdEbr6sXHBt+TmRlhxmfp6FJSf6thubsoPPl6AhtEV90CL2dbzyS0kmDBweP9E3BvpuL4fPDXKkc0jfzPcQ/WAhHRrpTIaKsJOKnYo+iMjo/YBcef3sr4ewOP5UjvQH5Uh/h+R/4A8/jtrQ12jiCQAAAABJRU5ErkJggg==";
    	this.favoriteRowList = {row: []};
    	this.lastUpdated = null;
    	this.host = options.host;
    	this.sessionId = options.sessionId;
		options.searchableData =  new Septima.Search.SearchableRowList({
    		data: Septima.bind(function(){return this.favoriteRowList;}, this),
    		singular: options.singular,
    		plural: options.plural,
    		searchProperties: ['description', 'displayname'],
    		displaynameProperty: 'displayname',
    		descriptionProperty: 'description'
    	});
		
    	Septima.Search.DataSearcher.prototype.initialize.apply(this, [options]);

        cbKort.events.addListener ('FAVORITE_SAVED', Septima.bind(function(event, favorite){
        	this.readFavorites();
        }, this));
        
        cbKort.events.addListener ('FAVORITE_DELETED', Septima.bind(function(event, favorite){
        	this.readFavorites();
        }, this));
        
    },
    
    
    fetchData: function (query, caller) {
        var now = new Date().getTime();
    	if (this.lastUpdated == null || (now - this.lastUpdated) > 60 * 1000){
        	this.readFavorites(Septima.bind(function(query, caller){
        		Septima.Search.DataSearcher.prototype.fetchData.apply(this, [query, caller]);
        	}, this, query, caller));
    	}else{
    		Septima.Search.DataSearcher.prototype.fetchData.apply(this, [query, caller]);
    	}
    },
    
    readFavorites: function(success){
    	jQuery.ajax({
    		url: this.host + '/cbkort?page=favorite.read.list&outputformat=json',
            jsonp: 'json.callback',
            data:{sessionId: this.sessionId},
	        dataType: 'jsonp',
            crossDomain : true,
            async:true,
            cache : false,
            timeout : 4000,
            success:  Septima.bind(function(success, data, textStatus,  jqXHR){
            	if (data.row[0]._class == 'rowlist'){
                	var favoriteRowList = data.row[0];
            		this.favoriteRowList = favoriteRowList;
                    var now = new Date().getTime();
            		this.lastUpdated = now;
            	}else{
            		this.favoriteRowList = {row: []};
            	}
            	if (typeof success !== 'undefined' && success != null && jQuery.isFunction(success)){
            		success();
            	}
          }, this, success)
          });
    },

    CLASS_NAME: 'Septima.Search.FavoriteSearcher'
    
});
