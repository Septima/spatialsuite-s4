Septima.Search.ThemeSearcher = Septima.Class (Septima.Search.Searcher, {

	themeOffUri: null,
	themeOnUri: null,
	onCustomButtonDef: null,
	offCustomButtonDef: null,
	themePhrase: null,
	themesPhrase: null,
	showPhrase: null,
	hidePhrase: null,
	groups: [],
	
    initialize: function (options) {
		this.Searcher(options);
		this.visibleThemesPhrase = cbInfo.getString('s4.themesearcher.visiblethemes');
		this.toolsPhrase = cbInfo.getString('s4.themesearcher.tools');
    	this.themePhrase = cbInfo.getString('s4.themesearcher.theme');
    	this.themesPhrase = cbInfo.getString('s4.themesearcher.themes');
    	this.showPhrase = cbInfo.getString('s4.themesearcher.show');
    	this.hidePhrase = cbInfo.getString('s4.themesearcher.hide');
    	this.showLockedPhrase = cbInfo.getString('s4.themesearcher.show_locked');
    	this.hideLockedPhrase = cbInfo.getString('s4.themesearcher.hide_locked');
    	
		this.themeOffUri = Septima.Search.s4Icons.themeSearcher.themeOffUri;
		this.themeOffLockUri = Septima.Search.s4Icons.themeSearcher.themeOffLockUri;
		this.themeOnUri = Septima.Search.s4Icons.themeSearcher.themeOnUri;
		this.themeOnLockUri = Septima.Search.s4Icons.themeSearcher.themeOnLockUri;
		this.toolsIconURI = Septima.Search.s4Icons.themeSearcher.toolsIconURI;
		this.defaultThemeIconURI = Septima.Search.s4Icons.themeSearcher.defaultThemeIconURI;
		this.iconURI = Septima.Search.s4Icons.themeSearcher.iconURI;
        this.themeGroupIconURI = Septima.Search.s4Icons.themeSearcher.themeGroupIconURI;
		this.onCustomButtonDef= [{"buttonText": this.hidePhrase, "buttonImage": this.themeOnUri, "callBack": Septima.bind( this.toggleTheme, this)}];
		this.offCustomButtonDef= [{"buttonText": this.showPhrase, "buttonImage": this.themeOffUri, "callBack": Septima.bind( this.toggleTheme, this)}];
		this.onLockCustomButtonDef= [{"buttonText": this.hideLockedPhrase, "buttonImage": this.themeOnLockUri, "callBack": Septima.bind( this.toggleTheme, this)}];
		this.offLockCustomButtonDef= [{"buttonText": this.showLockedPhrase, "buttonImage": this.themeOffLockUri, "callBack": Septima.bind( this.toggleTheme, this)}];

    	this.groups = [];
    	this.datasources = {};
        this.getLocalThemesDeferred = jQuery.Deferred();
        this.indexDone = false;
        
    },
    
    cmpVersions: function (cmpVersion, refVersion) {
        var i, diff;
        var regExStrip0 = /(\.0+)+$/;
        var segmentsCmpVersion = cmpVersion.replace(regExStrip0, '').split('.');
        var segmentsRrefVersion = refVersion.replace(regExStrip0, '').split('.');
        var l = Math.min(segmentsCmpVersion.length, segmentsRrefVersion.length);

        for (i = 0; i < l; i++) {
            diff = parseInt(segmentsCmpVersion[i], 10) - parseInt(segmentsRrefVersion[i], 10);
            if (diff) {
                return diff;
            }
        }
        return segmentsCmpVersion.length - segmentsRrefVersion.length;
    },
    
    doIndex: function(){
        for (var i=0;i<cbKort.themeContainer.elements.length;i++){
            var group = cbKort.themeContainer.elements[i];
            this.doIndexForGroup(group, null);
        }
        
        this.registerTarget(this.visibleThemesPhrase);
        
        //Sort groups
        this.groups.sort(function(g1, g2){
            return (g1.displayname.localeCompare(g2.displayname));
        });
        
        this.getLocalDatasources().done(Septima.bind(function(localDatasources){
            localThemesArray = [];
            localThemesString = "";
            for (var i=0;i<localDatasources.length;i++){
                var localDatasource = localDatasources[i];
                if (typeof this.datasources[localDatasource] !== "undefined"){
                    var themesArray = this.datasources[localDatasource];
                    for (var j=0;j<themesArray.length;j++){
                        localThemesArray.push(themesArray[j].name);
                    }
                }
            }
            localThemesString = localThemesArray.join(" ");
            this.getLocalThemesDeferred.resolve(localThemesString);
        }, this));
    },
    
    doIndexForGroup: function(group, parentGroup){
            var groupHasThemes = false;
            var themes = [];
            for (var j=0;j<group.elements.length;j++){
                var element = group.elements[j];
                if (element.type === "Theme"){
                    var theme = element;
                    if (theme.selectable=="true"){
                        for (l=0;l<theme.layers.length;l++){
                            var layer = theme.layers[l];
                            if (layer.datasource){
                                if (typeof this.datasources[layer.datasource] === 'undefined'){
                                    this.datasources[layer.datasource] = [];
                                }
                                this.datasources[layer.datasource].push(theme);
                            }
                        }
                        groupHasThemes = true;
                        var themeDescription = this.getThemeDescription(theme);
                        var terms = (theme.displayname + " " + themeDescription).split(" ");
                        var termsToSearch = [];
                        for (var k=0;k<terms.length;k++){
                            term = terms[k];
                            if (term.length > 1){
                                termsToSearch.push(term.toLowerCase());
                            }
                        }
                        themes.push({"group": group, "theme": theme, "termsToSearch": termsToSearch, "description": themeDescription, "image": this.getThemeImage(theme), "displayname": theme.displayname});
                    }
                }else{
                    var thisGroup = element;
                    this.doIndexForGroup(thisGroup, group);
                }
            }
            if (groupHasThemes){
                //sort themes
                themes.sort(function(t1, t2){
                    return (t1.displayname.localeCompare(t2.displayname));
                });
                this.groups.push({"group": group, "themes": themes, "displayname": group.displayname.replace(/:/g, "")});
                this.registerTarget(group.displayname.replace(/:/g, ""))
            }
    },
    
    getThemesForDatasource: function(datasource){
        var queryResult = this.createQueryResult();
		if (typeof this.datasources[datasource.id] !== 'undefined'){
			for (var i=0;i<this.datasources[datasource.id].length;i++){
				var theme = this.datasources[datasource.id][i];
				var description = null;
				if (typeof theme.description !== 'undefined' && theme.description !== null){
					description = theme.description;
				}
        		var result = queryResult.addResult(theme.displayname + " (" + this.themePhrase + ")", description, null, {theme: theme});
        		result.image = this.getThemeImage(theme);
			}
		}
		return queryResult;
    },
    
    getLocalthemes: function(){
    	return this.getLocalThemesDeferred.promise();
    },
    
    getVisibleThemes: function(){
    	var visibleThemes = [];
    	for (var i=0;i<this.groups.length;i++){
    		var group = this.groups[i];
    		for (var j=0;j<group.themes.length;j++){
    			var theme = group.themes[j];
    			if (theme.theme.visible){
    				visibleThemes.push(theme);
    			}
    		}
    	}
    	return visibleThemes;
    },
    
    toggleTheme: function(result){
    	var scale = cbKort.getState().map.scale;
    	var theme = result.data.theme;
    	if (theme.visible){
    		cbKort.setThemeVisibility(theme.name, false, true);
        	if (typeof cbKort.themeSelector.setSpatialMapState !== 'undefined'){
            	cbKort.themeSelector.setSpatialMapState();
        	}
        	if ((theme.maxscale != null && scale > theme.maxscale) || (theme.minscale != null && scale < theme.minscale)) {
            	return this.offLockCustomButtonDef[0];
        	}else{
            	return this.offCustomButtonDef[0];
        	}
    	}else{
    		cbKort.setThemeVisibility(theme.name, true, true);
        	if (typeof cbKort.themeSelector.setSpatialMapState !== 'undefined'){
            	cbKort.themeSelector.setSpatialMapState();
        	}
        	if ((theme.maxscale != null && scale > theme.maxscale) || (theme.minscale != null && scale < theme.minscale)) {
        		return this.onLockCustomButtonDef[0];
        	}else{
        		return this.onCustomButtonDef[0];
        	}
    	}
    },
    
    getThemeDescription: function(theme){
    	for (var i=0;i<theme.copyright.length;i++){
    		if (theme.copyright[i].name == "metadata.text"){
    			return theme.copyright[i].value;
    		}
    	}
    	return "";
    },
    
    getThemeImage: function(theme){
    	if (typeof theme.img !== 'undefined' && theme.img !== null && theme.img !== ""){
    		return theme.img; 
    	}
    	for (var i=0;i<theme.copyright.length;i++){
    		if (theme.copyright[i].name == "img"){
    			return theme.copyright[i].value;
    		}
    	}
    	return this.defaultThemeIconURI;
    },
    
    fetchData: function (query, caller) {
        if (this.indexDone){
            this.fetchIndexedData(query, caller);
        }else{
            this.indexDone = true;
            if ((this.cmpVersions(cbInfo.getParam('spatialmap.version'), '3.12.0') > 0) &&
                    cbKort.themeSelector &&
                    cbKort.themeSelector.createThemeStore &&
                    !cbKort.themeSelector.storeInitialized){
                cbKort.themeSelector.createThemeStore(Septima.bind(function(query, caller){
                    this.doIndex();
                    this.fetchIndexedData(query, caller);
                }, this, query, caller));
            }else{
                this.doIndex();
                this.fetchIndexedData(query, caller);
            }
        }
    },
    
    fetchIndexedData: function (query, caller) {
    	var groupName = "*";

        var queryResult = this.createQueryResult();
        
    	if (query.hasTarget){
    		if (this.hasTarget(query.target)){
    			groupName = query.target;
    		}else{
    			var result = queryResult.addNewQuery(this.visibleThemesPhrase, this.visibleThemesPhrase, this.visibleThemesPhrase + ":", null, null, null);
    			result.image = Septima.Search.s4Icons.themeSearcher.themeOnUri;
	        }
    	}
    	
        if (groupName == this.visibleThemesPhrase){
        	var visibleThemes = this.getVisibleThemes();
        	for (var i=0;i<visibleThemes.length;i++){
        		var theme = visibleThemes[i];
        		var result = queryResult.addResult(theme.theme.displayname, theme.description, " ", theme);
        		result.image = theme.image;
        	}
        }else{
            var matchingGroups = [];
        	    matchingGroups = this.getMatchingGroups(query.queryString, groupName);
        		var totalThemeCount = 0;
        		for (var i=0;i<matchingGroups.length;i++){
        			totalThemeCount += matchingGroups[i].themes.length;
        		}
                if (query.type == "list.force"){
        			var themesToShow = [];
                    for (var i=0;i<matchingGroups.length;i++){
                        if (matchingGroups[i].themes.length > 0 && !(groupName === '*' && query.queryString === '')){
                            themesToShow = themesToShow.concat(matchingGroups[i].themes);
                        }else{
                            var target = matchingGroups[i].group.displayname.replace(/:/g, "");
                            var result3 = queryResult.addNewQuery(matchingGroups[i].group.displayname, null, target + ":", null, null, null)
                            result3.image = this.themeGroupIconURI;
                        }
                    }
        			themesToShow.sort(function(a, b){
    					if (a.score == b.score){
    						return a.theme.displayname.localeCompare(b.theme.displayname)
    					}else{
        					return b.score - a.score;
    					}
    				});
    				for (var j=0;j<themesToShow.length;j++){
    					theme = themesToShow[j];
    					var result1;
    					if (query.hasTarget){
        					result1 = queryResult.addResult(theme.theme.displayname, theme.description, " ", theme);
    					}else{
        					result1 = queryResult.addResult(theme.theme.displayname + " (" + this.themePhrase + ")", theme.description, " ", theme);
    					}
                        result1.image = theme.image;
    				}
        		}else if (query.type == "list"){
            		var freeSlots = query.limit - matchingGroups.length;
            		if (matchingGroups.length > freeSlots && !query.hasTarget){
            			var description = null;
    					var result3 = queryResult.addNewQuery(this.title + " (" + totalThemeCount + ")", description, query.queryString, null, null, null);
            		}else{
            			for (var i=0;i<matchingGroups.length;i++){
            				var group = matchingGroups[i];
            				if (group.themes.length==0){
                                var target = group.group.displayname.replace(/:/g, "");
                                var result3 = queryResult.addNewQuery(group.group.displayname, null, target + ":", null, null, null)
                                result3.image = this.themeGroupIconURI;
            				}else if (group.themes.length==1 || group.themes.length<freeSlots){
            					//TODO: list all themes
            					for (var j=0;j<group.themes.length;j++){
                					theme = group.themes[j];
                					var result1;
                					if (query.hasTarget){
                    					result1 = queryResult.addResult(theme.displayname, theme.description, " ", theme);
                					}else{
                    					result1 = queryResult.addResult(theme.displayname + " (" + this.themePhrase + ")", theme.description, " ", theme);
                					}
                                    result1.image = theme.image;
            					}
            					freeSlots -= group.themes.length;
            				}else{
            					var count = group.themes.length;
            					var groupDescription = "";
            					for (var k=0;k<count;k++){
            						groupDescription += group.themes[k].displayname + ", ";
            					}
            					//TODO: Encode group.group.displayname to avoid ":" in groupname (destroys target computation) &#58;
            					var target = group.group.displayname.replace(/:/g, "");
            					var result3 = queryResult.addNewQuery(group.group.displayname + " (" + count + " " + this.themesPhrase + ")", groupDescription, target + ": " + query.queryString, null, null, null)
                                result3.image = this.themeGroupIconURI;
            				}
            			}
            		}
        		}
        }
   	
    	setTimeout(Septima.bind(function (caller, queryResult){caller.fetchSuccess(queryResult);}, this, caller, queryResult), 100);
    },
    
    getMatchingGroups: function (queryString, groupName){
        var matchingGroups = [];
        if (queryString === ""){
            for (var j=0;j<this.groups.length;j++){
                var group = this.groups[j];
                if (groupName === "*" || (group.displayname.toLowerCase() === groupName.toLowerCase())){
                    matchingGroups.push({"group": group, "themes": group.themes});
                }
            }
        }else{
            var queryTerms = queryString.split(" ");
            for (var j=0;j<this.groups.length;j++){
                var group = this.groups[j];
                if (groupName == "*" || group.displayname.toLowerCase() == groupName.toLowerCase()){
                    var themes = this.getScoredGroupThemes(group, queryTerms);
                    if (themes.length>0){
                        matchingGroups.push({"group": group, "themes": themes});
                    }else{
                        if (group.displayname.toLowerCase().indexOf(queryTerms[0]) == 0){
                            matchingGroups.push({"group": group, "themes": []});
                        }
                    }
                }
            }
        }
        	
    	return matchingGroups;
    },
    
    getScoredGroupThemes: function(group, queryTerms){
        var themes = [];
        for (var k=0;k<group.themes.length;k++){
            var theme = group.themes[k];
            theme.score = 0;
            for (var i=0;i<queryTerms.length;i++){
                var term = queryTerms[i].toLowerCase();
                if (theme.theme.displayname.toLowerCase().indexOf(term)==0){
                    theme.score += 2;
                }else if (this.match(term, theme.termsToSearch)){
                    theme.score += 1;
                }
            }
            if (theme.score > 0){
                themes.push(theme);
            }
        }
        themes.sort(this.sortByScoreName);
        return themes;
    },
    
    sortByScoreName: function(a, b){
        if (a.score == b.score){
            return a.theme.displayname.localeCompare(b.theme.displayname)
        }else{
            return b.score - a.score;
        }
    },
    
    match: function(testTerm, terms){
    	for (var i=0;i<terms.length;i++){
    		if (terms[i].indexOf(testTerm)==0){
    			return true;
    		}
    	}
    	return false;
    },
	
	getCustomButtonDefs: function(result){
        if (typeof result.newquery !== 'undefined'){
        	return [];
        }else{
        	var scale = cbKort.getState().map.scale;
        	var theme = result.data.theme;
        	if (theme.visible){
            	if ((theme.maxscale != null && scale > theme.maxscale) || (theme.minscale != null && scale < theme.minscale)) {
            		return this.onLockCustomButtonDef;
            	}else{
            		return this.onCustomButtonDef;
            	}
        	}else{
            	if ((theme.maxscale != null && scale > theme.maxscale) || (theme.minscale != null && scale < theme.minscale)) {
            		return this.offLockCustomButtonDef;
            	}else{
            		return this.offCustomButtonDef;
            	}
        	}
        }
	},
	
	hasdetailHandlerDefs: function(result){
        if (typeof result.newquery !== 'undefined'){
            return false;
        }else{
        	if (result.data.theme.actions == undefined || result.data.theme.actions.length == 0){
                return false;
        	}else{
                return true;
        	}
        }
	},

    getdetailHandlerDefs: function(result){
        if (typeof result.newquery !== 'undefined' || result.data.theme.actions == undefined || result.data.theme.actions.length == 0){
            return [];
        }else{
        	return ([{"buttonText": this.toolsPhrase, "buttonImage": this.toolsIconURI, "handler": function(result, detailsContent){
        	    var p = new Promise(function(resolve, reject){
                    //result.data.displayname
                    //var output = jQuery();
                    var buttons = jQuery("<ul style='list-style: none'/>");
                    for (var i=0;i<result.data.theme.actions.length;i++){
                        var button = result.data.theme.actions[i].getGuiButton(result.data.theme);
                        button.element.css("float", "left");
                        button.element.css("list-style", "none");
                        button.element.css("padding", "2px");
                        button.element.css("margin", "1px");
                        buttons.append(button.element);
                    }
                    var copyRightLink = result.searcher.getCopyRightLink(result);
                    if (copyRightLink !== null){
                        copyRightLink.css("float", "left");
                        copyRightLink.css("list-style", "none");
                        copyRightLink.css("padding", "2px");
                        copyRightLink.css("margin", "1px");
                        buttons.append(copyRightLink);
                    }
                    resolve([{type: 'jquery-dom-object', object: buttons}]);
                    //resolve(detailsContent.formatItems([{type: 'jquery-dom-object', object: buttons}]));
        	    });
        	    return p;
        	}}]);
        }
    },
    
    getCopyRightLink: function(result){
    	var link = null;
    	if (result.data.theme.copyright !== 'undefined' && result.data.theme.copyright.length>1){
    		var text = null;
    		var url = null;
    		var copyrightparts = result.data.theme.copyright; 
    		for (var i=0;i<copyrightparts.length;i++){
    			var copyrightpart = copyrightparts[i];
    			if (copyrightpart.name == 'copyright-text'){
    				text = copyrightpart.value;
    			}else if (copyrightpart.name == 'copyright.url'){
    				url = copyrightpart.value;
    			}
    		}
    		var copyRightIconUri = Septima.Search.s4Icons.themeSearcher.copyRightIconUri;
    		if (text !== null && url !== null){
    			link = jQuery("<li class='statebutton-icon'><a target='_blank' href='" + url + "' title='" + text + "'><img src='" + copyRightIconUri + "'/></a><li>");
    			link.css("top", "-2px");
//    			link.css("position", "relative");
    		}
    	}
    	return link;
    },
    
    getLocalDatasources: function(){
    	var deferred = jQuery.Deferred();
    	jQuery.ajax({
    		url: '/spatialmap?page=s4GetLocalDatasources&outputformat=json',
            jsonp: 'json.callback',
            data:{sessionId: this.sessionId},
	        dataType: 'jsonp',
            crossDomain : true,
            async:true,
            cache : false,
            timeout : 4000,
            success:  Septima.bind(function(deferred, data, textStatus,  jqXHR){
        		var localDatasources = [];
            	if (data && data.row && data.row[0].row){
            		for (var i=0;i<data.row[0].row.length;i++){
            			localDatasources.push(data.row[0].row[i]._name);
            		}
            		localDatasources.sort(function(t1, t2){
        				return (t1.localeCompare(t2));
        			});
            	}
            	deferred.resolve(localDatasources);
          }, this, deferred)
          });
    	return deferred.promise();
    },

    CLASS_NAME: 'Septima.Search.ThemeSearcher'

});