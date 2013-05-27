Septima.Search.ThemeSearcher = Septima.Class (Septima.Search.Searcher, {

	themeFOlderUri: null,
	themeOffUri: null,
	themeOnUri: null,
	onCustomButtonDef: null,
	offCustomButtonDef: null,

	groups: [],
    initialize: function (options) {
		this.Searcher(options);
		this.themeFolderUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH3QMSBwki3imsvQAAA8VJREFUOMuVlV1oXEUUx393P7v5MmwkTVpjEiUb4/oQxEKV1mhDRFBLiBWqWFoVi6JIxScfFBXsk4oPUg0WWvCLvkTEh4IYFQ0pwTTVJKIJoQm0iekmu/m42XzcO3PGh3v3bpe2FAfunbl3zvzmf87MmbGMMYabFNu2mZ6eJp/P4zgOryd7qQ5X0LqtidfqDtJWdkeJvXUz6OjoKLlcjkwmg23biAhH7+0lTIgKEtSYKh6u2sXJ1NvBmMiNYMYYhoaGWFhYYH5+Pvgfi8WoDleyrG1WyLNi5VlZ/pk/z08w0H6KeDhG6EbQsbGxEmBTUxMAPT09XGj7CgS6qx8CIBu2mXIv8eLEewDXh9q2TS6XC4AdHR10dXXhui6VlZU0xXdAxuHbOz/g1G2e28vRdc4uDjCy+vf1ocPDw2QymUBhKpUCYG1trWikvKU4sn0/3ZG9Xn9sk3dnekuhA58e4tdPniYUsrBtG4CWlhYA+vv7Ay9m1ucAOHbpQwAO1z4BG8JWRDOxcrEIHfzsCHte/oIHX/0GsBCRkliOj49TVlZGX18f7b8dgIjF6ez3AHTX74N1jbEMs+sZb/XPff48D7x0GlHvY7QgsueakFiWRSwWw3EcVpIOEMPCKhpseCK0EU+pMQajjmNEMFrQWhEKeU7MzXmuptPpIiDkPYdrHgfgl8Xf/U0P26NJHyqCMYLRBu0oXNcmkUgAMDIyAkBnZydtbW3BPj1W+wwfN7wBwDsTJyAewtqE1luavYwaOPEsu19oJTu1ysXBRUQJRhRaNKJdxFVo7aC1QlwHrVxEu2jXRYmLcRWXt8V5c1+Yc/d/6cW04Pbc+CrtTx0nUV3P/ynfvbUXd+oyu8xu7qtO+1AjGNHks5skqk7irrqgNUYrjChQCtEC2kGUAq0wWoNWhCxDdmaSHGmeW9pfzP2CUmdDYbYURjSIDuKMP6kRARGMGN9GiCTCxCMOKlJHY31DESpGs7XmUF4TQTkCUgAJGIXRAqJAdDBBwSY7m2c9eis6mqT59p1XKdWaf/9aZsfdVZ5qX6kXAsH4tfetsYwgvtLJP2a5Er2LUEUt9XW1xQNFRHNl0qautQqMN8joq+CFcBTc1543xgjTo/MsxlI0NjdSUVFeVLqZfoW5C2coP/MPSxsgrotohVaOX7tIYRsphYjCaJc4GwwuNbIWUnx09FDpId2wsw5Ld/P1j/1oJQTZ518Kwdu/Iwxg4SlNddzDo490Bhl4zXVy9oefmJic8nvwc9sqtoNU9xrhSJSDTz5GTTJZsm//AyrrR/+UUq08AAAAAElFTkSuQmCC";
		this.themeOffUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUU3MDY1OTM4M0Q1MTFFMTgyRjlDOEI4MjU5RkU3RjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUU3MDY1OTQ4M0Q1MTFFMTgyRjlDOEI4MjU5RkU3RjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RTcwNjU5MTgzRDUxMUUxODJGOUM4QjgyNTlGRTdGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5RTcwNjU5MjgzRDUxMUUxODJGOUM4QjgyNTlGRTdGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plr+f/0AAAIsSURBVHjabFO7iiJREK1uX6soCEYyIia+RhEDOzAQAzG3zfwFf2KYYH5EhM7UxMBAA0EMdhVcZAInU0dUMBDF92Orir3SsnugrEt5T9WpqtvS/X4HPRqNRsxkMr3LspyQJMlzu93gdDpNz+fzL7Q3VVV/6+9L+gStVquKxNxyuYTNZgNEJmAMrFYr2O12uFwutXw+rz4lWK/XPwaDwRd6z3w+fyQ0m83sUcEjRkkwPnU6nf5MJnOQKdjr9TQ92efzscdKbFRExLbbLRwOBw+q1Fhdu91WSLYgp9NpyGazgP2Cw+Fgo3Yolkql+M5ut6OkuXK5rMjH4/GDehaVA4HAo5LA9XplHwqFwO128xl5NKMP2WKxvFIFgt/vZ99sNtlTHFvjc7fbZR8MBlkdDpNUvMr48yKmLfocDodgs9mgUqlAqVQCg8EAo9HoUYSq/1X2YhTkp91KEm+Apo8K2fQgBQQaroxZvmnPhNlsxj4SiTwlIxOzGY/H+tl8y/v9/pMeCaHf77PH/UI4HGYVZNFoFJLJJP/X6XTAaDTyGdV/SvV6PYED+blYLDgYj8dBURT4H4hMRqslVZhA4ZeIw6riYHJidS6XCxKJBHi93odsIk4mE37SpArl14rFospacLcF7P8LJ++hR7JarQCVAbbH6yKQbKpM80LyFO8V/vmYNE2r0gujNQmiHvSgUDZXFjFZf6FQKKhIjOHea/TB0P6pIiadEhF9TE8m/BFgAKvfRvljFZCQAAAAAElFTkSuQmCC";
		this.themeOnUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAACB0RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgTVi7kSokAAAAFnRFWHRDcmVhdGlvbiBUaW1lADExLzA1LzA33bqJ2wAAAq1JREFUeJxlk09oVFcUxn/3vskkqZoJGRMXTgQpCga0qZkUChEtFjFg6giuVDAgbaQroV2WGgUXXQiudJlVyDJpKRVKwYR0YXVqtNrUP1SSOMYRJpjJjJn3Zubc08Uzk4n94HDh8N1zzvcdjlFV6rHn75P7oqbhkqc26WET4oTAlTOBq6QDV774oufmX/V8U1+ge/bUuGdsaiHI8kYKCAKAh2UzzcS1hYqrTix8cvPEhgLfZq41TRXuPctVlxNz5cVawVZvCwDLUqjl4rKFZolmtr9t23X78zHfAvy2cmes/nOq9RAAM12jzOwZBbeeW/IKFE0p8W9TdgyA5OyZ3v2zp5V0j5Lu0ZHcT6qqyvTHugZ+3quqqiPZH2u8rVMHte3WgV7ru/KVhSBb6zwYHwhnXaqsO1UNfRrc9gWpyAEAilGfipErttk0dr15p/Fs/BgAFx7+AMBceZG51VDWhRdXQ07HAJQcQUQwFe0yyUdnNO3/A4D2pEPzfvmU/CafWCwGr8vkq0Vi29tY7p4Mnf/1I4g3sDkXISJOeB8GAx945KUIbQDRMLeGkgNA1GGrTl56WAAmC3+GY3YeXyfbMNbkTebuvts/iJOX3qavdh4VdR8GVJgrLzIYH+Dotj7y/gqPK/M02UbOt5/kWuc3oZEz3zEvWaz1UHF/mN3p48mqyt3n5hUAFzu+ZLhz6H+yAIYfX+fSkxvQ3kAkr4iTXqOq7LjTP76Kn1rywm0ctN0Mdw5xaGtvbezhJ9eZyqWhJYLFoL5MuP4HJ4yqcnj6XNPTSOZZ0ZQSyw2rYbvAwYqEL0CjhRYPG4CuSkbnS7v066f+hmNq//2zcZymilGfICKo0ZphxgdbEAQ34fofbDymesSm+/YiellFk1p1CVGHIBkxLu2Mfu+O3H9Yz/8PLFlkbIqvT3MAAAAASUVORK5CYII=";
		this.onCustomButtonDef= [{"buttonText":"Skjul", "buttonImage": this.themeOnUri, "callBack": Septima.bind( this.toggleTheme, this)}];
		this.offCustomButtonDef= [{"buttonText":"Vis", "buttonImage": this.themeOffUri, "callBack": Septima.bind( this.toggleTheme, this)}];
    	this.groups = [];
    	for (var i=0;i<cbKort.themeContainer.elements.length;i++){
    		var group = cbKort.themeContainer.elements[i];
    		var themes = [];
    		for (var j=0;j<group.elements.length;j++){
    			var theme = group.elements[j];
    			if (theme.selectable=="true"){
    				var themeDescription = this.getThemeDescription(theme);
    				var terms = (theme.displayname + " " + themeDescription).split(" ");
    				var termsToSearch = [];
    				for (var k=0;k<terms.length;k++){
    					term = terms[k];
    					if (term.length > 1){
    						termsToSearch.push(term.toLowerCase());
    					}
    				}
        			themes.push({"group": group, "theme": theme, "termsToSearch": termsToSearch, "description": themeDescription, "image": this.getThemeImage(theme)});
    			}
    		}
    		this.groups.push({"group": group, "themes": themes});
    	}
    },
    
    toggleTheme: function(result){
    	if (result.data.theme.visible){
    		cbKort.setThemeVisibility(result.data.theme.name, false, true);
        	return this.offCustomButtonDef[0];
    	}else{
    		cbKort.setThemeVisibility(result.data.theme.name, true, true);
        	return this.onCustomButtonDef[0];
    	}
    },
    
    hasTarget: function (target) {
    	for (var i=0;i<this.groups.length;i++){
    		if (target.toLowerCase() == this.groups[i].group.displayname.toLowerCase()){
    			return true;
    		}
    	}
    	return false;
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
    	for (var i=0;i<theme.copyright.length;i++){
    		if (theme.copyright[i].name == "img"){
    			return theme.copyright[i].value;
    		}
    	}
    	return "";
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
    			for (var i=0;i<groupsWithMatchingThemes.length;i++){
    				var themes = groupsWithMatchingThemes[i].themes;
    				for (var j=0;j<themes.length;j++){
    					theme = themes[j];
    					if (query.hasTarget){
        					var result1 = queryResult.addResult(theme.theme.displayname, theme.description, " ", theme);
                            result1.image = theme.theme.img;
    					}else{
        					var result1 = queryResult.addResult(theme.theme.displayname + " (Tema)", theme.description, " ", theme);
                            result1.image = theme.theme.img;
    					}
    				}
    			}
    		}else if (query.type == "list"){
        		var freeSlots = query.limit - groupsWithMatchingThemes.length;
    			for (var i=0;i<groupsWithMatchingThemes.length;i++){
    				var group = groupsWithMatchingThemes[i];
    				if (group.themes.length==1 || group.themes.length<freeSlots){
    					//TODO: list all themes
    					for (var j=0;j<group.themes.length;j++){
        					theme = group.themes[j];
        					if (query.hasTarget){
            					var result1 = queryResult.addResult(theme.theme.displayname, theme.description, " ", theme);
                                result1.image = theme.theme.img;
        					}else{
            					var result1 = queryResult.addResult(theme.theme.displayname + " (Tema)", theme.description, " ", theme);
                                result1.image = theme.theme.img;
        					}
    					}
    					freeSlots -= group.themes.length;
    				}else{
    					var count = group.themes.length;
    					var groupDescription = "";
    					for (var k=0;k<count;k++){
    						groupDescription += group.themes[k].theme.displayname + ", ";
    					}
    					var result3 = queryResult.addNewQuery(group.group.group.displayname + " (" + count +" temaer)", groupDescription, group.group.group.displayname + ": " + query.queryString, null, null, null)
                        result3.image = this.themeFolderUri;
    				}
    			}
    		}

    	}
    	setTimeout(Septima.bind(function (caller, queryResult){caller.fetchSuccess(queryResult);}, this, caller, queryResult), 100);
    },
    
    getGroupsWithMatchingThemes: function (queryTerms, groupName){

    	var groupsWithMatchingThemes = [];
    	for (var i=0;i<queryTerms.length;i++){
    		var term = queryTerms[i].toLowerCase();
        	for (var j=0;j<this.groups.length;j++){
        		var group = this.groups[j];
        		if (groupName == "*" || group.group.displayname.toLowerCase() == groupName.toLowerCase()){
            		var themes = [];
            		for (var k=0;k<group.themes.length;k++){
            			var theme = group.themes[k]; 
            			if (theme.theme.displayname.toLowerCase().indexOf(term)==0){
            				themes.push(theme);
            			}else{
            				if (this.match(term, theme.termsToSearch)){
            					themes.push(theme);
            				}
            			}
            		}
            		if (themes.length>0){
                		groupsWithMatchingThemes.push({"group": group, "themes": themes});
            		}
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
        if (!result.newquery){
        	if (result.data.theme.visible){
        		return this.onCustomButtonDef;
        	}else{
        		return this.offCustomButtonDef;
        	}
    		return this.onCustomButtonDef;
        }else{
        	return [];
        }
	},

    CLASS_NAME: 'Septima.Search.ThemeSearcher'

});