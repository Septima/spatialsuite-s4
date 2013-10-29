Septima.Search.workspaceSearcher = Septima.Class (Septima.Search.DataSearcher, {

    initialize: function (options) {
    	this.workspaceRowList = {row: []};
		options.searchableData =  new Septima.Search.SearchableRowList({
    		data: Septima.bind(function(){return this.workspaceRowList;}, this),
    		singular: options.singular,
    		plural: options.plural,
    		searchProperties: ['owner','name'],
    		getDisplayname: function (row){return row.name +' ('+ row.owner +')';}
    	});
    	Septima.Search.DataSearcher.prototype.initialize.apply(this, [options]);

    	jQuery.ajax({
    		url: options.host + '/cbkort?page=workspace.getlist&outputformat=json',
            jsonp: 'json.callback',
            data:{sessionId: options.sessionId},
	        dataType: 'jsonp',
            crossDomain : true,
            async:true,
            cache : false,
            timeout : 4000,
            success:  Septima.bind(function(data, textStatus,  jqXHR){
            	this.workspaceRowList = data.row[0];
          }, this)
          });
    },
    
    CLASS_NAME: 'Septima.Search.workspaceSearcher'

});