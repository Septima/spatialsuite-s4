function s4CreateFavoriteSearcher(options) {
    
    s4LoadFavoriteRowList(options.sessionId);
    
    options.searchableData =  new Septima.Search.SearchableData({
        data: S4GetFavoriteRowList,
        singular: options.singular,
        plural: options.plural,
        searchProperties: ['description', 'displayname'],
        displaynameProperty: 'displayname',
        descriptionProperty: 'description'
    });

    if (typeof spm !== 'undefined' && typeof spm.getEvents !== 'undefined'){
        spm.getEvents().addListener("FAVORITE_SAVED", s4LoadFavoriteRowList.bind(this, options.sessionId));
        spm.getEvents().addListener("FAVORITE_DELETED", s4LoadFavoriteRowList.bind(this, options.sessionId));
    }else{
        cbKort.events.addListener ('FAVORITE_SAVED', s4LoadFavoriteRowList.bind(this, options.sessionId));
        cbKort.events.addListener ('FAVORITE_DELETED', s4LoadFavoriteRowList.bind(this, options.sessionId));
    }
    
    var favoriteSearcher = new Septima.Search.DataSearcher(options);
    
    return favoriteSearcher;

}

S4FavoriteRowList = {row: []};

function S4GetFavoriteRowList() {
    return S4FavoriteRowList.row;
}

function s4LoadFavoriteRowList(sessionId) {
    jQuery.ajax({
        url: '/cbkort?page=favorite.read.list&outputformat=json',
        jsonp: 'json.callback',
        data:{sessionId: sessionId},
        dataType: 'jsonp',
        crossDomain : true,
        async:true,
        cache : false,
        timeout : 4000,
        success:  function(data, textStatus,  jqXHR){
            if (data.row[0]._class == 'rowlist'){
                var favoriteRowList = data.row[0];
                S4FavoriteRowList = favoriteRowList;
            }else{
                this.favoriteRowList = {row: []};
            }
      }
      });
}

Septima.Search.FavoriteSearcher_org = Septima.Class (Septima.Search.DataSearcher, {

    initialize: function (options) {
    	this.iconURI = Septima.Search.s4Icons.favoriteSearcher.iconURI;
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
		
        Septima.Search.Searcher.prototype.constructor.apply(this, [options]);
        Septima.Search.DataSearcher.prototype.constructor.apply(this, [options]);

        if (typeof spm !== 'undefined' && typeof spm.getEvents !== 'undefined'){
            spm.getEvents().addListener("FAVORITE_SAVED", Septima.bind(function(event, favorite){
                this.readFavorites();
            }, this));
            spm.getEvents().addListener("FAVORITE_DELETED", Septima.bind(function(event, favorite){
                this.readFavorites();
            }, this));
        }else{
            cbKort.events.addListener ('FAVORITE_SAVED', Septima.bind(function(event, favorite){
                this.readFavorites();
            }, this));
            cbKort.events.addListener ('FAVORITE_DELETED', Septima.bind(function(event, favorite){
                this.readFavorites();
            }, this));
        }

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
