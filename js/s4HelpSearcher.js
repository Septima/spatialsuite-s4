Septima.Search.HelpSearcher = Septima.Class (Septima.Search.Searcher, {

    initialize: function (options) {
    	this.helpEntries =  [];
    	options.searchableData =  new Septima.Search.SearchableData({
    		data: Septima.bind(function(){return this.helpEntries;}, this),
    		singular: options.singular,
    		plural: options.plural,
    		searchProperties: ['title', 'description', 'tekst'],
    		displaynameProperty: 'title'
    	});
        Septima.Search.DataSearcher.prototype.initialize.apply(this, [options]);
		this.iconURI = Septima.Search.s4Icons.helpSearcher.iconURI;

		this.registerType(options.plural, options.singular);
		
    	this.currentProfile = cbKort.getProfile();
    	this.addDetailHandlerDef({
    		"buttonText": "",
    		"buttonImage": this.iconURI,
    		"handler": function(result, detailsContent){
                var promise = new Promise(function(resolve, reject){
                    resolve([{type: 'textarea', icon: result.image, text: result.data.text}]);
                });
                return promise;
    		},
    		more: true
    	});

    	setTimeout(Septima.bind(function (){
        	var params = {
        			skinpath: Gui.SKIN_PATH,
        			skin: Gui.SKIN,
        			profile: this.currentProfile,
        			page: 'help',
        			sessionid: cbKort.sessionId
        		};
        	jQuery.ajax({
        		url:  '/spatialmap?',
                data: params,
    	        dataType: 'html',
                crossDomain : true,
                async:true,
                cache : false,
                timeout : 4000,
                success:  Septima.bind(function(data, textStatus,  jqXHR){
                	var a= jQuery(data);
                	//var entries = a.find('.helpEntry');
                	var th = cbInfo.getString('standard.misc.themeselector');
                    var currentMenu = '';
                    var entries = [];
                    var themeSelectorCorrectEntry = a.find(".helpEntry .helpH3:contains('" + th + "')");
                    if (themeSelectorCorrectEntry.length === 1){
                        entries = a.find('.helpEntry');
                        for (var i = 0; i < entries.length - 1; i++){
                            thisEntry = entries[i];
                            entry = jQuery(entries[i]);
                            //var h3 = entry.find('h3').text().replace(/'/g, "").replace(/Menuen /g, "").trim();
                            var h3 = entry.find('h3').text().replace(/'/g, "").trim();
                            if (h3 !== ""){
                                currentMenu = h3 + " -> ";
                            } else{
                                var topic = entry.find('h4').text();
                                var text = entry.find('p').text();
                                var img = entry.find('img').prop('src');
                                var imgUri;
                                if (currentMenu.indexOf("->") > 0){
                                    imgUri = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ3OC4xMzggNDc4LjEzOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDc4LjEzOCA0NzguMTM4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPGc+Cgk8Zz4KCQk8Zz4KCQkJPHBvbHlnb24gcG9pbnRzPSIwLDIwOC42NzYgMCwyNjkuNTI3IDI1NC41MzUsMjY5LjUyNyAyNDAuOTQ2LDIwOC42NzYgICAgIiBmaWxsPSIjMDAwMDAwIi8+CgkJCTxwYXRoIGQ9Ik0wLDM3My4wMDJ2NjAuODczaDQwOS44MjN2LTU2Ljk0N2MtMy45OTEtMC44Mi03LjgwOS0yLjI0My0xMS41NjItMy45NjlMMCwzNzMuMDAyTDAsMzczLjAwMnoiIGZpbGw9IiMwMDAwMDAiLz4KCQkJPHBvbHlnb24gcG9pbnRzPSIyNDIuNzU4LDU1LjI2NCAzMjguMzcyLDEwNS4xNTggNDA5LjgyMywxMDUuMTU4IDQwOS44MjMsNDQuMjYzIDAsNDQuMjYzIDAsMTA1LjE1OCAyMTcuODIyLDEwNS4xNTggICAgICAyMTEuODA0LDc4LjEyOSAgICAiIGZpbGw9IiMwMDAwMDAiLz4KCQkJPHBhdGggZD0iTTI0NC4yNjgsODQuNDA2bC01LjI0MiwzLjk0N2w1OC45NTMsMjY0LjAwNWw0Ny41NjQtODAuNDM3bDUwLjQ3Niw2OS4wMDVjOS41OTksMTMuMDI5LDI2LjU1NCwxNi43ODIsMzguMDI5LDguMzkxICAgICBjMTEuMzg5LTguMzY5LDEzLjAwNy0yNS42NDgsMy40NTEtMzguNjc2bC01MC40OTctNjkuMDA1bDkxLjEzNy0yMS4wNzVMMjQ0LjI2OCw4NC40MDZ6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPC9nPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";
                                }else{
                                    imgUri = this.iconURI;
                                }

                                if (typeof img !== 'undefined' && img !== ''){
                                    var imgUri = img;
                                }
                                this.helpEntries.push({title: topic, iconUri: imgUri, description: text, text: currentMenu + topic});
                            }
                        }
                    }else{
                        var themeSelectorWorkAroundEntry = a.find(".helpH3:contains('" + th + "')");
                        entries = themeSelectorWorkAroundEntry.prevAll('.helpEntry');
                        if (entries.length === 0){
                            entries = themeSelectorWorkAroundEntry.parent().prevAll('.helpEntry');
                        }
                        for (var i = entries.length -1; i>-1;i--){
                            thisEntry = entries[i];
                            entry = jQuery(entries[i]);
                            //var h3 = entry.find('h3').text().replace(/'/g, "").replace(/Menuen /g, "").trim();
                            var h3 = entry.find('h3').text().replace(/'/g, "").trim();
                            if (h3 !== ""){
                                currentMenu = h3 + " -> ";
                            } else{
                                var topic = entry.find('h4').text();
                                var text = entry.find('p').text();
                                var img = entry.find('img').prop('src');
                                var imgUri;
                                if (currentMenu.indexOf("->") > 0){
                                    imgUri = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ3OC4xMzggNDc4LjEzOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDc4LjEzOCA0NzguMTM4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPGc+Cgk8Zz4KCQk8Zz4KCQkJPHBvbHlnb24gcG9pbnRzPSIwLDIwOC42NzYgMCwyNjkuNTI3IDI1NC41MzUsMjY5LjUyNyAyNDAuOTQ2LDIwOC42NzYgICAgIiBmaWxsPSIjMDAwMDAwIi8+CgkJCTxwYXRoIGQ9Ik0wLDM3My4wMDJ2NjAuODczaDQwOS44MjN2LTU2Ljk0N2MtMy45OTEtMC44Mi03LjgwOS0yLjI0My0xMS41NjItMy45NjlMMCwzNzMuMDAyTDAsMzczLjAwMnoiIGZpbGw9IiMwMDAwMDAiLz4KCQkJPHBvbHlnb24gcG9pbnRzPSIyNDIuNzU4LDU1LjI2NCAzMjguMzcyLDEwNS4xNTggNDA5LjgyMywxMDUuMTU4IDQwOS44MjMsNDQuMjYzIDAsNDQuMjYzIDAsMTA1LjE1OCAyMTcuODIyLDEwNS4xNTggICAgICAyMTEuODA0LDc4LjEyOSAgICAiIGZpbGw9IiMwMDAwMDAiLz4KCQkJPHBhdGggZD0iTTI0NC4yNjgsODQuNDA2bC01LjI0MiwzLjk0N2w1OC45NTMsMjY0LjAwNWw0Ny41NjQtODAuNDM3bDUwLjQ3Niw2OS4wMDVjOS41OTksMTMuMDI5LDI2LjU1NCwxNi43ODIsMzguMDI5LDguMzkxICAgICBjMTEuMzg5LTguMzY5LDEzLjAwNy0yNS42NDgsMy40NTEtMzguNjc2bC01MC40OTctNjkuMDA1bDkxLjEzNy0yMS4wNzVMMjQ0LjI2OCw4NC40MDZ6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPC9nPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgoJPGc+Cgk8L2c+Cgk8Zz4KCTwvZz4KCTxnPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";
                                }else{
                                    imgUri = this.iconURI;
                                }

                                if (typeof img !== 'undefined' && img !== ''){
                                    var imgUri = img;
                                }
                                this.helpEntries.push({title: topic, iconUri: imgUri, description: text, text: currentMenu + topic});
                            }
                        }
                    }
              }, this)
              });
    	}, this), 200);

    },

    fetchData: function (query, caller) {
    	
        var queryResult = this.createQueryResult();
        
        var hits = this.searchableData.query(query.queryString);
        
        var count = hits.length;

        var listStrategy = this.getListStrategy(query, count)
		if (count > 0) {
			if (listStrategy.show){
	    		for (var i=0;i<listStrategy.count;i++) {
	    			var hit = hits[i].object;
	    			//Hit: {title: topic, iconUri: imgUri, description: currentMenu + topic, text: text}
	    			var displayname = hit.title;
	    			if (listStrategy.isMixed){
	    				displayname += " (" + this.searchableData.singular + ")";
	    			}
	    			var description = hit.description;
	    			var result = queryResult.addResult(this.source, this.type, hit.title, hit.description, " ", hit);
	    			result.image = hit.iconUri;
	    		}
			}else{
		        var result2 = queryResult.addNewQuery(this.source, this.type, this.searchableData.plural + " (" + count + ")", null, query.queryString, null, null);
			}
		}
    	setTimeout(Septima.bind(function (caller, queryResult){caller.fetchSuccess(queryResult);}, this, caller, queryResult), 100);
    },
    CLASS_NAME: 'Septima.Search.HelpSearcher'
    
});
