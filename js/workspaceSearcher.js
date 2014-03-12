Septima.Search.workspaceSearcher = Septima.Class (Septima.Search.DataSearcher, {

    initialize: function (options) {
    	this.iconUri =       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB80lEQVR4XqWMO2tUURhF13fmkipoFDSFYrCxiZBgbNTSJn9AnEL9AYJB7U1hlXRmUASFCCJCXgYEMzh5gRJtUhhMK0RRMIqFyGQycx/bc89FBiURwQWbc1h8e5sk/gdrzLDi4HTJQIIkAwTOQXDs7jLjFdvTqFZ9qsr4kl4uTEubt6RPFdXmZr1b3tG9mJ/yrqKG79KYQvo4pJtXjuvEmfMaudonvUZaQTeH+r0r/+H61H/qnOZm7yp+glwGsF3jxuV1Lg1+pvruLKPVQdiLd2+4MLjJ3C/Xlbs1Lvq7R8+bOAf27TEbnR30dERAiUCWQpwS6PDOHGRZkcgVdwi+N3gP0AsMXBu+r+vD95T/d8sOd71oFkYrk4zdeaCx2+MaGZtA0xBPQssnnoLERzP53US4y+M7oRs9bFY53N2khEMScepYPfaB7WZGkibESUqWJGRZi0PxBpGVAEiJyLv2rFrDTKAAR3qOWqsZ04oT0jQJI2mS+jcfihGpDBCYZETORMCseJDMiZIPElkGMmE+knDOwmsQnB8wCoJh/e0ahQr+tz8SXfv2I9pE5hztvlEul0/yF+YXFleR2p3FpWUKkJlhnq9fNnFhuE2WZRw42I0KAAwgamxttdeCNjo791Cv/8AsGCQFt1Wvg4TYmYEibf7l7if3nz3WIn/amwAAAABJRU5ErkJggg==";
    	this.folderIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QoeDSAHmzq/DgAAAepJREFUOMulks1LVFEYh5/33Ht1aJwZQ2dcNDMGRS7KSAzs1tREtCmw/yBsEQTt5u6rXbgKF9G6iBIj6MNVmotqIbQwBQkRs00xo31g4Exl1/O2mDGGokW3Bw4cfhye84P3FYBSqXTRGDOsqm0AF3pH2ZksiyOgCqEFFIwBR0D5e+YGQXAP2AckRASA7kSZZ9ses1Buoy//mULvOwgNk3M5Firt9OU//ZEdyH3k6P4yju/7YyKSpokT2Wl6+tNM3L/ByOgH1pafUsjdZFfrGBNTc4zcXWVtebIpm+XanQrd+d04vu9fka1qDY5np/HSXyj2v+bbRifj80dYWU9R6F+iOFChtpFmfP4wq+spCgeXKA6sUPvewZPZPUgQBLYhrFprz4dhOHX50PWZZKtmW1zAqX9iN+HHZv3e4oAYsLZ+XNN4p+ButVLVGVXt8DxvcXgmaCcC1Wr1ebPwgeM4Z4FIMlUlFovdMgDW2oqqvlTVHiLieS1Ya1+4gAVuG2NOAamowkQiQSzW+tYF3qjqIxEZ+33a/0I2l+Xc0FBoVPWhMeaYiOyIKovH43RlugAwwCJwmujYfL4bx3V/CZMisvc/hKvpTAbHqS+sEZGTwPbI9ax9ZYCvtRpQX+zOqDJVfW+MuTp4ZvDSVvYTL263cceuAc8AAAAASUVORK5CYII=";
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