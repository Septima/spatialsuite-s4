Septima.Search.HelpSearcher = Septima.Class (Septima.Search.Searcher, {

    initialize: function (options) {
    	//this.iconURI =       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QoeDQsr35IuhAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACcklEQVQ4y72TW0hUURSG/7XPmePMONmMSoONWWojXgiRKCiKKBSxh+hiYEWG+FBELwW9VPRURBe6PARWEL6UKGYEISRRIF0oJPIlyGLQmaGR0XGqOXM/56wexktjDRRBP2zY7PXzrcW/2EAO6RMN83f17e89gVeX8EcyvMcBANrE1l3RcLJocT04fNUVfHe7AgB8jzqzagQAzAwiyiqkfSdXiti1cdYF9FShNxq0D4X9ckPiq7pWi8ZAJjOszuotqzuGhn2DZ7Bi+7kF4CxU8fYebIrPfG7R4mqzfdmUK9+RsLBBYADEAAMAE5jBUx6JUjEp7ahv31m24/Lg/ISenra2qPfNHUNP2VhLZh4F4KrTIaRcoTDUkIQZrwCZ8mBxujuqOp93f7jZkJnQ++T0tm/vex7qKbUAzFCsgNOtYVEKWUBDJ/hGTRASGCRItjtb646NPhCegSMoaz7/zF7V5FKKKi8AEmyFBhMxcuMIkomh5DOYQWzorIUn+z/dbTwrKnZ3ZZagJ9Xao69PFdQ07i0oSRFzzvFAANgA8h1Ghg8QhKzrqZRFnjNVtHYDAMrWj7ildATxaQvik2aQ4J93lyWzjZmISeQ5Qrb6ljXlzTcCWU79y2GZEvfHyIiUQwBaTCA+aUVaNTEJpgUwg0EwNIFp//Iu9/5bJ+TijXH/yJXs1py4h+T3sZVK8sU61j/WgqXNhFB1IkBL40HFDBgmEBhgIgEsWaWCi/dsUkp6X84x5KxszAcAYGL2LDTikBJ+fKg64hsf0COBSmtJ6dPSDWJQkv01nBw141/k6W9v+eXfjzv/HsR9fbh+cRbauw//TT8AOm8B4o8N4HsAAAAASUVORK5CYII=";
    	this.helpEntries =  [];
		this.searchableData =  new Septima.Search.SearchableData({
    		data: Septima.bind(function(){return this.helpEntries;}, this),
    		singular: "Emne",
    		plural: "Emner",
    		searchProperties: ['title', 'description', 'tekst'],
    		displaynameProperty: 'title'
    	});
		this.Searcher(options);
		this.iconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE1LjA3LDExLjI1TDE0LjE3LDEyLjE3QzEzLjQ1LDEyLjg5IDEzLDEzLjUgMTMsMTVIMTFWMTQuNUMxMSwxMy4zOSAxMS40NSwxMi4zOSAxMi4xNywxMS42N0wxMy40MSwxMC40MUMxMy43OCwxMC4wNSAxNCw5LjU1IDE0LDlDMTQsNy44OSAxMy4xLDcgMTIsN0EyLDIgMCAwLDAgMTAsOUg4QTQsNCAwIDAsMSAxMiw1QTQsNCAwIDAsMSAxNiw5QzE2LDkuODggMTUuNjQsMTAuNjcgMTUuMDcsMTEuMjVNMTMsMTlIMTFWMTdIMTNNMTIsMkExMCwxMCAwIDAsMCAyLDEyQTEwLDEwIDAgMCwwIDEyLDIyQTEwLDEwIDAgMCwwIDIyLDEyQzIyLDYuNDcgMTcuNSwyIDEyLDJaIiAvPjwvc3ZnPg==";
    	this.currentProfile = cbKort.getProfile();
    	this.addDetailHandlerDef({
    		//{"buttonText": text, "buttonImage": imageUri, "handler": function(result, cancellableDeferred, detailsContent)[, "target": target][, more: true|false]};
    	    //cancellableDeferred.resolve(jQuery DOM-able object)
    		"buttonText": "Abekat",
    		"buttonImage": this.iconURI,
    		"handler": function(result, deferred, detailsContent){
    			var formattedFooter = detailsContent.formatTextArea({caption: result.data.description, text: result.data.text});
				deferred.resolve(formattedFooter);
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
                	var themeSelectorWorkAroundEntry = a.find(".helpH3:contains('" + th + "')");
                	var entries = themeSelectorWorkAroundEntry.prevAll('.helpEntry');
                	var currentMenu = '';
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
                    		var imgUri = this.iconURI;
                    		if (typeof img !== 'undefined' && img !== ''){
                    			var imgUri = img;
                    		}
                    		this.helpEntries.push({title: topic, iconUri: imgUri, description: currentMenu + topic, text: text});
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
	    			var result = queryResult.addResult(hit.title, hit.description, " ", hit);
	    			result.image = hit.iconUri;
	    		}
			}else{
		        var result2 = queryResult.addNewQuery(this.searchableData.plural + " (" + count + ")", null, query.queryString, null, null);
			}
		}
    	setTimeout(Septima.bind(function (caller, queryResult){caller.fetchSuccess(queryResult);}, this, caller, queryResult), 100);
    },
    CLASS_NAME: 'Septima.Search.HelpSearcher'
    
});
