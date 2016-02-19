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
		this.iconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTIxLDVDMTkuODksNC42NSAxOC42Nyw0LjUgMTcuNSw0LjVDMTUuNTUsNC41IDEzLjQ1LDQuOSAxMiw2QzEwLjU1LDQuOSA4LjQ1LDQuNSA2LjUsNC41QzQuNTUsNC41IDIuNDUsNC45IDEsNlYyMC42NUMxLDIwLjkgMS4yNSwyMS4xNSAxLjUsMjEuMTVDMS42LDIxLjE1IDEuNjUsMjEuMSAxLjc1LDIxLjFDMy4xLDIwLjQ1IDUuMDUsMjAgNi41LDIwQzguNDUsMjAgMTAuNTUsMjAuNCAxMiwyMS41QzEzLjM1LDIwLjY1IDE1LjgsMjAgMTcuNSwyMEMxOS4xNSwyMCAyMC44NSwyMC4zIDIyLjI1LDIxLjA1QzIyLjM1LDIxLjEgMjIuNCwyMS4xIDIyLjUsMjEuMUMyMi43NSwyMS4xIDIzLDIwLjg1IDIzLDIwLjZWNkMyMi40LDUuNTUgMjEuNzUsNS4yNSAyMSw1TTIxLDE4LjVDMTkuOSwxOC4xNSAxOC43LDE4IDE3LjUsMThDMTUuOCwxOCAxMy4zNSwxOC42NSAxMiwxOS41VjhDMTMuMzUsNy4xNSAxNS44LDYuNSAxNy41LDYuNUMxOC43LDYuNSAxOS45LDYuNjUgMjEsN1YxOC41WiIgLz48L3N2Zz4=";
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
