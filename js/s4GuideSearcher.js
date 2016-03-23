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
    			
    			var link = result.data.link;
    			var icon = Septima.Search.icons.details.link;
    			var linkTitle = result.title;
    			
    			output = output.add(detailsContent.formatLink({icon: icon, link: link, linkTitle: linkTitle}));

				deferred.resolve(output);
    		},
    		more: true
    	});

    },
    CLASS_NAME: 'Septima.Search.GuideSearcher'
    
});
