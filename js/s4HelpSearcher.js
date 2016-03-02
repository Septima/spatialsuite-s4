Septima.Search.HelpSearcher = Septima.Class (Septima.Search.Searcher, {

    initialize: function (options) {
    	this.helpEntries =  [];
		this.searchableData =  new Septima.Search.SearchableData({
    		data: Septima.bind(function(){return this.helpEntries;}, this),
    		singular: "Emne",
    		plural: "Emner",
    		searchProperties: ['title', 'description', 'tekst'],
    		displaynameProperty: 'title'
    	});
		this.Searcher(options);
		this.iconURI = Septima.Search.s4Icons.helpSearcher.iconURI;
		
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
