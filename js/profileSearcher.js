Septima.Search.ProfileSearcher = Septima.Class (Septima.Search.DataSearcher, {

    initialize: function (options) {
    	this.iconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTIxLDE2LjVDMjEsMTYuODggMjAuNzksMTcuMjEgMjAuNDcsMTcuMzhMMTIuNTcsMjEuODJDMTIuNDEsMjEuOTQgMTIuMjEsMjIgMTIsMjJDMTEuNzksMjIgMTEuNTksMjEuOTQgMTEuNDMsMjEuODJMMy41MywxNy4zOEMzLjIxLDE3LjIxIDMsMTYuODggMywxNi41VjcuNUMzLDcuMTIgMy4yMSw2Ljc5IDMuNTMsNi42MkwxMS40MywyLjE4QzExLjU5LDIuMDYgMTEuNzksMiAxMiwyQzEyLjIxLDIgMTIuNDEsMi4wNiAxMi41NywyLjE4TDIwLjQ3LDYuNjJDMjAuNzksNi43OSAyMSw3LjEyIDIxLDcuNVYxNi41TTEyLDQuMTVMMTAuMTEsNS4yMkwxNiw4LjYxTDE3Ljk2LDcuNUwxMiw0LjE1TTYuMDQsNy41TDEyLDEwLjg1TDEzLjk2LDkuNzVMOC4wOCw2LjM1TDYuMDQsNy41TTUsMTUuOTFMMTEsMTkuMjlWMTIuNThMNSw5LjIxVjE1LjkxTTE5LDE1LjkxVjkuMjFMMTMsMTIuNThWMTkuMjlMMTksMTUuOTFaIiAvPjwvc3ZnPg==";
    	this.profileRowList = {row: []};
		options.searchableData =  new Septima.Search.SearchableRowList({
    		data: Septima.bind(function(){return this.profileRowList;}, this),
    		singular: options.singular,
    		plural: options.plural,
    		searchProperties: ['name', 'displayname'],
    		displaynameProperty: 'displayname'
    	});
    	Septima.Search.DataSearcher.prototype.initialize.apply(this, [options]);
		this.profileOnUri = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTIsMTAuOTZDMS41LDEwLjY4IDEuMzUsMTAuMDcgMS42Myw5LjU5TDMuMTMsN0MzLjI0LDYuOCAzLjQxLDYuNjYgMy42LDYuNThMMTEuNDMsMi4xOEMxMS41OSwyLjA2IDExLjc5LDIgMTIsMkMxMi4yMSwyIDEyLjQxLDIuMDYgMTIuNTcsMi4xOEwyMC40Nyw2LjYyQzIwLjY2LDYuNzIgMjAuODIsNi44OCAyMC45MSw3LjA4TDIyLjM2LDkuNkMyMi42NCwxMC4wOCAyMi40NywxMC42OSAyMiwxMC45NkwyMSwxMS41NFYxNi41QzIxLDE2Ljg4IDIwLjc5LDE3LjIxIDIwLjQ3LDE3LjM4TDEyLjU3LDIxLjgyQzEyLjQxLDIxLjk0IDEyLjIxLDIyIDEyLDIyQzExLjc5LDIyIDExLjU5LDIxLjk0IDExLjQzLDIxLjgyTDMuNTMsMTcuMzhDMy4yMSwxNy4yMSAzLDE2Ljg4IDMsMTYuNVYxMC45NkMyLjcsMTEuMTMgMi4zMiwxMS4xNCAyLDEwLjk2TTEyLDQuMTVWNC4xNUwxMiwxMC44NVYxMC44NUwxNy45Niw3LjVMMTIsNC4xNU01LDE1LjkxTDExLDE5LjI5VjEyLjU4TDUsOS4yMVYxNS45MU0xOSwxNS45MVYxMi42OUwxNCwxNS41OUMxMy42NywxNS43NyAxMy4zLDE1Ljc2IDEzLDE1LjZWMTkuMjlMMTksMTUuOTFNMTMuODUsMTMuMzZMMjAuMTMsOS43M0wxOS41NSw4LjcyTDEzLjI3LDEyLjM1TDEzLjg1LDEzLjM2WiIgLz48L3N2Zz4=";
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
        if (typeof result.newquery !== 'undefined'){
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
