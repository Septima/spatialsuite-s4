Septima.Search.ProfileSearcher = Septima.Class (Septima.Search.DataSearcher, {

    initialize: function (options) {
    	this.iconURI = Septima.Search.s4Icons.profileSearcher.iconURI;
    	this.profileRowList = {row: []};
		options.searchableData =  new Septima.Search.SearchableRowList({
    		data: Septima.bind(function(){return this.profileRowList;}, this),
    		singular: options.singular,
    		plural: options.plural,
    		searchProperties: ['name', 'displayname'],
    		displaynameProperty: 'displayname'
    	});
    	Septima.Search.DataSearcher.prototype.initialize.apply(this, [options]);
		this.profileOnUri = Septima.Search.s4Icons.profileSearcher.profileOnUri;;
    	this.currentProfile = cbKort.getProfile();

    	jQuery.ajax({
    		url: options.host + '/cbkort?page=profileselector_get_profiles&outputformat=json',
            jsonp: 'json.callback',
            data:{sessionId: options.sessionId},
	        dataType: 'jsonp',
            crossDomain : true,
            async:true,
            cache : false,
            timeout : 4000,
            success:  Septima.bind(function(data, textStatus,  jqXHR){
            	if (data.row[0]._class == 'rowlist'){
                	var profileRowList = data.row[0];
                	for (var i=0;i<profileRowList.row.length;i++){
                		if (profileRowList.row[i].hidden == 'false'){
                			this.profileRowList.row.push(profileRowList.row[i]);
                		}
                	}
            	}
          }, this)
          });
    },
    
    getCustomButtonDefs: function(result){
        if (result.isNewQuery()){
            return [];
        }else{
        	if (result.data.name === this.currentProfile){
        		//return [{"buttonText": this.showPhrase, "buttonImage": this.profileOnUri}];
        		result.image = this.profileOnUri;
                return [];
        	}else{
                return [];
        	}
        }
    },

    CLASS_NAME: 'Septima.Search.ProfileSearcher'
    
});
