Septima.Search.GuideSearcher = Septima.Class (Septima.Search.DataSearcher, {
	

    initialize: function (options) {
    	this.guides = options.guides;

    	options.searchableData = new Septima.Search.SearchableData({
    		data: this.guides,
    		singular: options.singular,
    		plural: options.plural,
    		searchProperties: ['title', 'description', 'text'],
    		displaynameProperty: 'title',
       		descriptionProperty: 'description'
    	});
        Septima.Search.DataSearcher.prototype.initialize.apply(this, [options]);
		this.iconURI = Septima.Search.s4Icons.guideSearcher.iconURI;
    	this.addDetailHandlerDef({
    		"buttonText": options.singular,
    		"buttonImage": this.iconURI,
    		"handler": function(result, detailsContent){
                var promise = new Promise(function(resolve, reject){
                    var items = [];
                    items.push({type: 'textarea', text: result.data.text});
                    
                    var link = result.data.link;
                    var icon = Septima.Search.icons.details.link;
                    var linkTitle = result.title;
                    
                    items.push({type: 'link', icon: icon, link: link, linkTitle: linkTitle});
                    resolve(items);
                });
                return promise;

    		},
    		more: true
    	});

    },
    CLASS_NAME: 'Septima.Search.GuideSearcher'
    
});
