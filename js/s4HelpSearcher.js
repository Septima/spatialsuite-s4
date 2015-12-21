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
		this.iconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAA3NCSVQICAjb4U/gAAAAP1BMVEX///8zMzMzMzMzMzMzMzMzMzMzMzP////z8/Pm5ubZ2dnMzMyzs7OmpqaZmZmNjY1zc3NmZmZZWVlAQEAzMzNox2MjAAAAFXRSTlMAVWaImard//////////////////9PbNDmAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQA2LzI5LzA4c6yDqAAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOC0wNi0yOVQxMToyNjo1MVo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wNC0wOVQxODoxMzowN1o8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgBm8vvgAAAIhJREFUGJV1kdEagyAIhdESVlabi/d/1hIQ61s7V/ArHEQAUUzIjClCVziJCkNjA180KBv5plFqLSll16B20H7fiYgWwXj66vGL3p+JNokjJK2lmXmjLEkCn4Y506JzgaM902xWHa7mUyH24sbQjG5KbaR6s1gUwesd4uWZrvBvIc+re17yz3cciIwVjZdkDgYAAAAASUVORK5CYII=";
    	this.currentProfile = cbKort.getProfile();
    	this.addDetailHandlerDef({
    		//{"buttonText": text, "buttonImage": imageUri, "handler": function(result, cancellableDeferred, detailsContent)[, "target": target][, more: true|false]};
    	    //cancellableDeferred.resolve(jQuery DOM-able object)
    		"buttonText": "Abekat",
    		"buttonImage": this.iconURI,
    		"handler": function(result, deferred, detailsContent){
    			var formattedFooter = detailsContent.formatTextArea({text: result.data.text});
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
                		var h3 = entry.find('h3').text().replace(/'/g, "").replace(/Menuen /g, "").trim();
                		if (h3 !== ""){
                			currentMenu = h3 + ": ";
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
