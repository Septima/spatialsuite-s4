Septima.Search.GuideSearcher = Septima.Class (Septima.Search.DataSearcher, {
	

    initialize: function (options) {
    	this.guides = options.guides;

		this.searchableData =  new Septima.Search.SearchableData({
    		data: this.guides,
    		singular: "Guide",
    		plural: "Guider",
    		searchProperties: ['title', 'description', 'text'],
    		displaynameProperty: 'title',
       		descriptionProperty: 'description'
    	});
		this.Searcher(options);
		this.iconURI = Septima.Search.s4Icons.guideSearcher.iconURI;
    	this.addDetailHandlerDef({
    		"buttonText": "Guide",
    		"buttonImage": this.iconURI,
    		"handler": function(result, deferred, detailsContent){
    			var output =  detailsContent.formatTextArea({text: result.data.text});
    			
    			var list = {type: "list", items: []};
    			var hyperLink = jQuery("<a href='" + result.data.link + "' target= '_blank'>" + result.data.title + "</a>");
    			var icon = jQuery('<img src="' + Septima.Search.icons.details.link + '"/>');
    			list.items.push({type: "object", icon: icon, o1: hyperLink});
    			output = output.add(detailsContent.formatList(list));

				deferred.resolve(output);
    		},
    		more: true
    	});

    },
    CLASS_NAME: 'Septima.Search.GuideSearcher'
    
});
