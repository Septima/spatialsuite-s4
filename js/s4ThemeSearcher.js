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
    	this.themePhrase = cbInfo.getString('s4.themesearcher.theme');
    	this.themesPhrase = cbInfo.getString('s4.themesearcher.themes');
    	this.showPhrase = cbInfo.getString('s4.themesearcher.show');
    	this.hidePhrase = cbInfo.getString('s4.themesearcher.hide');
		this.folderIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYcBzUHzuH5RgAAAd9JREFUOMudkz9rU2EUh5/z5raFatvUxmprxEgHERGL4KiIuIg2ZChCBTGzOLT3A9RFRKF+gSwtONUlUb+A0M1uER36x4ZWY2pTUjXNNTe573G4Nio43d92zvnx8LzDKwAzMzP3jTFPVPUwgIi0l2/ubG8masmSXwYgE79KYe8NG+dfgcLpYprMkXAHEG/14rRjBeO67gsReQD0ye98T7S66seDDmw+9ZD82Bx4llT3KKmeUfjqkx+bYz45C8BeVwOsZgwwKSJn+SsrF2tsNisds+zQRHjYbf0ptRWA7LE0GecyAPXunxj+k/agoRb8AODe0C0Apt89BaDklyk1QvPprWdhZ3gCPEvTCf4B7ltrp3zfH272BgQEHUOAha0CxB3GP9xhfGkSHGFh93XYGbkGjQAVRVzXtSIiqrpkrV00xjwSkTgRsjqyg3MwqGo+FovdBSLBrFrWk9Xwydbaiqq+VdUzREy9p0m5/xsGsMBzY8wNYCAqsDqwT10bOMC6qr4UkUURkajA9ye/0JagYFS1YIy5IiInItsdqrPWV/mkG96UA6wA2agwRVk9ul206eIFAAP0i8i5yEDR6qW1U7cPZiMi14HBqEAClj3P+9gBAonIdqqfjTGPc7lc55P/An3gxH6Jd5NhAAAAAElFTkSuQmCC";
		this.themeOffUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUU3MDY1OTM4M0Q1MTFFMTgyRjlDOEI4MjU5RkU3RjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUU3MDY1OTQ4M0Q1MTFFMTgyRjlDOEI4MjU5RkU3RjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RTcwNjU5MTgzRDUxMUUxODJGOUM4QjgyNTlGRTdGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5RTcwNjU5MjgzRDUxMUUxODJGOUM4QjgyNTlGRTdGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plr+f/0AAAIsSURBVHjabFO7iiJREK1uX6soCEYyIia+RhEDOzAQAzG3zfwFf2KYYH5EhM7UxMBAA0EMdhVcZAInU0dUMBDF92Orir3SsnugrEt5T9WpqtvS/X4HPRqNRsxkMr3LspyQJMlzu93gdDpNz+fzL7Q3VVV/6+9L+gStVquKxNxyuYTNZgNEJmAMrFYr2O12uFwutXw+rz4lWK/XPwaDwRd6z3w+fyQ0m83sUcEjRkkwPnU6nf5MJnOQKdjr9TQ92efzscdKbFRExLbbLRwOBw+q1Fhdu91WSLYgp9NpyGazgP2Cw+Fgo3Yolkql+M5ut6OkuXK5rMjH4/GDehaVA4HAo5LA9XplHwqFwO128xl5NKMP2WKxvFIFgt/vZ99sNtlTHFvjc7fbZR8MBlkdDpNUvMr48yKmLfocDodgs9mgUqlAqVQCg8EAo9HoUYSq/1X2YhTkp91KEm+Apo8K2fQgBQQaroxZvmnPhNlsxj4SiTwlIxOzGY/H+tl8y/v9/pMeCaHf77PH/UI4HGYVZNFoFJLJJP/X6XTAaDTyGdV/SvV6PYED+blYLDgYj8dBURT4H4hMRqslVZhA4ZeIw6riYHJidS6XCxKJBHi93odsIk4mE37SpArl14rFospacLcF7P8LJ++hR7JarQCVAbbH6yKQbKpM80LyFO8V/vmYNE2r0gujNQmiHvSgUDZXFjFZf6FQKKhIjOHea/TB0P6pIiadEhF9TE8m/BFgAKvfRvljFZCQAAAAAElFTkSuQmCC";
		this.themeOnUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAACB0RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgTVi7kSokAAAAFnRFWHRDcmVhdGlvbiBUaW1lADExLzA1LzA33bqJ2wAAAq1JREFUeJxlk09oVFcUxn/3vskkqZoJGRMXTgQpCga0qZkUChEtFjFg6giuVDAgbaQroV2WGgUXXQiudJlVyDJpKRVKwYR0YXVqtNrUP1SSOMYRJpjJjJn3Zubc08Uzk4n94HDh8N1zzvcdjlFV6rHn75P7oqbhkqc26WET4oTAlTOBq6QDV774oufmX/V8U1+ge/bUuGdsaiHI8kYKCAKAh2UzzcS1hYqrTix8cvPEhgLfZq41TRXuPctVlxNz5cVawVZvCwDLUqjl4rKFZolmtr9t23X78zHfAvy2cmes/nOq9RAAM12jzOwZBbeeW/IKFE0p8W9TdgyA5OyZ3v2zp5V0j5Lu0ZHcT6qqyvTHugZ+3quqqiPZH2u8rVMHte3WgV7ru/KVhSBb6zwYHwhnXaqsO1UNfRrc9gWpyAEAilGfipErttk0dr15p/Fs/BgAFx7+AMBceZG51VDWhRdXQ07HAJQcQUQwFe0yyUdnNO3/A4D2pEPzfvmU/CafWCwGr8vkq0Vi29tY7p4Mnf/1I4g3sDkXISJOeB8GAx945KUIbQDRMLeGkgNA1GGrTl56WAAmC3+GY3YeXyfbMNbkTebuvts/iJOX3qavdh4VdR8GVJgrLzIYH+Dotj7y/gqPK/M02UbOt5/kWuc3oZEz3zEvWaz1UHF/mN3p48mqyt3n5hUAFzu+ZLhz6H+yAIYfX+fSkxvQ3kAkr4iTXqOq7LjTP76Kn1rywm0ctN0Mdw5xaGtvbezhJ9eZyqWhJYLFoL5MuP4HJ4yqcnj6XNPTSOZZ0ZQSyw2rYbvAwYqEL0CjhRYPG4CuSkbnS7v066f+hmNq//2zcZymilGfICKo0ZphxgdbEAQ34fofbDymesSm+/YiellFk1p1CVGHIBkxLu2Mfu+O3H9Yz/8PLFlkbIqvT3MAAAAASUVORK5CYII=";
		this.iconURI = this.themeOnUri;
		this.defaultThemeIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gYREBwj2zOd+gAAASNJREFUOMvtk71uwjAUhT/bWVmoUoUxA1MlmoaX4B3yAHlFnoAtabtkpJ2KpSgDylhsdzFSiCCJ2CpxpDvYPvfcX8MD/wJiAucJCDrnE9AMOQRDj1LK0Fq7uHIvrbX15EyVUgtjTAS4jl3zE4BQSmljzOEiaJ/tBQ1gbwgCuDRNbZqmxvMZFO0LxXEsqqo6Oud+qqo6xnEsAMqypCxLBgJfIAFWZ9vtds9ACLwAoT+vOpZMmX7iSz9X8hGG4Wtd1242m4m2bT+vccbK77ciyLLsdz6fk+f5yW/MYMljohZYBkHw1TTNN7AHlp0sp61UFEVvWmvTy1Z6rvOCosNXWuv3QdGiKBbb7TaSUo5O1VorNpuNXq/Xh9sNdO6uv36v3wPT8QcJ2HGQP3/5fgAAAABJRU5ErkJggg==";
		this.onCustomButtonDef= [{"buttonText": this.hidePhrase, "buttonImage": this.themeOnUri, "callBack": Septima.bind( this.toggleTheme, this)}];
		this.offCustomButtonDef= [{"buttonText": this.showPhrase, "buttonImage": this.themeOffUri, "callBack": Septima.bind( this.toggleTheme, this)}];

    	this.groups = [];
    	for (var i=0;i<cbKort.themeContainer.elements.length;i++){
    		var group = cbKort.themeContainer.elements[i];
    		var groupHasThemes = false;
    		var themes = [];
    		for (var j=0;j<group.elements.length;j++){
    			var theme = group.elements[j];
    			if (theme.selectable=="true"){
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
    		}
    		if (groupHasThemes){
    			//sort themes
    			themes.sort(function(t1, t2){
    				return (t1.displayname.localeCompare(t2.displayname));
    			});
        		this.groups.push({"group": group, "themes": themes, "displayname": group.displayname + " (" + this.themesPhrase +")"});
    			this.registerTarget(group.displayname + " (" + this.themesPhrase +")")
    		}
    	}
    	//Sort groups
    	this.groups.sort(function(g1, g2){
			return (g1.displayname.localeCompare(g2.displayname));
		});
    },
    
//	onSelect: function(result){
//		if (typeof result.newquery === 'undefined') {
//        	this.toggleTheme(result);
//		}
//	},
    
    toggleTheme: function(result){
    	if (result.data.theme.visible){
    		cbKort.setThemeVisibility(result.data.theme.name, false, true);
        	return this.offCustomButtonDef[0];
    	}else{
    		cbKort.setThemeVisibility(result.data.theme.name, true, true);
        	return this.onCustomButtonDef[0];
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
    	if (theme.img !== ""){
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
    	var groupName = "*";

    	if (query.hasTarget){
    		if (this.hasTarget(query.target)){
    			groupName = query.target;
    		}
    	}
    	
        var queryResult = this.createQueryResult();
    	var groupsWithMatchingNames = [];
    	var groupsWithMatchingThemes = [];
    	var nameMatchingThemes = [];
    	var queryTerms = query.queryString.split(" ");
    	if (queryTerms.length>0){
    		groupsWithMatchingThemes = this.getGroupsWithMatchingThemes(queryTerms, groupName);
    		var totalThemeCount = 0;
    		for (var i=0;i<groupsWithMatchingThemes.length;i++){
    			totalThemeCount += groupsWithMatchingThemes[i].themes.length;
    		}
    		if (query.type == "list.force" || totalThemeCount<query.limit){
    			var themesToShow = [];
    			for (var i=0;i<groupsWithMatchingThemes.length;i++){
    				themesToShow = themesToShow.concat(groupsWithMatchingThemes[i].themes);
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
        		var freeSlots = query.limit - groupsWithMatchingThemes.length;
        		if (groupsWithMatchingThemes.length > freeSlots && !query.hasTarget){
        			var description = null;
        			if (query.queryString.length > 0){
        				description = totalThemeCount + " " + this.themesPhrase + " " + this.getMatchesPhrase() +" <em>" + query.queryString + "</em>";
        			}
					var result3 = queryResult.addNewQuery(this.title, description, query.queryString, null, null, null)
					if (query.queryString.length > 0){
			            result3.image = this.folderIconURI;
					}else{
			            result3.image = this.iconURI;
					}
        		}else{
        			for (var i=0;i<groupsWithMatchingThemes.length;i++){
        				var group = groupsWithMatchingThemes[i];
        				if (group.themes.length==1 || group.themes.length<freeSlots){
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
        					var result3 = queryResult.addNewQuery(group.group.displayname + " (" + count + " " + this.themesPhrase + ")", groupDescription, group.group.displayname + ": " + query.queryString, null, null, null)
                            result3.image = this.folderIconURI;
        				}
        			}
        		}
    		}

    	}
    	setTimeout(Septima.bind(function (caller, queryResult){caller.fetchSuccess(queryResult);}, this, caller, queryResult), 100);
    },
    
    getGroupsWithMatchingThemes: function (queryTerms, groupName){

    	var groupsWithMatchingThemes = [];
        	for (var j=0;j<this.groups.length;j++){
        		var group = this.groups[j];
        		if (groupName == "*" || group.displayname.toLowerCase() == groupName.toLowerCase()){
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
            		if (themes.length>0){
            			themes.sort(function(a, b){
        					if (a.score == b.score){
        						return a.theme.displayname.localeCompare(b.theme.displayname)
        					}else{
            					return b.score - a.score;
        					}
        				});
                		groupsWithMatchingThemes.push({"group": group, "themes": themes});
            		}
        		}
        	}
        	
    	return groupsWithMatchingThemes;
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
		//var button = result.data.theme.actions[1].getGuiButton();
		//append(button.element)
        if (typeof result.newquery !== 'undefined'){
        	return [];
        }else{
        	if (result.data.theme.visible){
        		return this.onCustomButtonDef;
        	}else{
        		return this.offCustomButtonDef;
        	}
        }
	},

    CLASS_NAME: 'Septima.Search.ThemeSearcher'

});