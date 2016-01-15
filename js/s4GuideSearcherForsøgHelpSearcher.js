Septima.Search.HelpSearcher = Septima.Class (Septima.Search.DataSearcher, {
	

    initialize: function (options) {
    	this.guides = [
    		              {title: "Guide 1", description:"Beskrivelse af guide 1", text: "Dette er den lange tekst, der beskriver hvad guide 1 omhandler", link: "http://www.disney.com"},
    		              {title: "Guide 2", description:"Beskrivelse af guide 2", text: "Dette er den lange tekst, der beskriver hvad guide 2 omhandler", link: "http://www.cnn.com"}
    		              ];

		this.searchableData =  new Septima.Search.SearchableData({
    		data: this.guides,
    		singular: "Guide",
    		plural: "Guider",
    		searchProperties: ['title', 'description', 'text'],
    		displaynameProperty: 'title',
       		descriptionProperty: 'description'
    	});
		this.Searcher(options);
		this.iconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAADCklEQVQ4y3WUOUhcURSGbxeIIYWkFBV1dNRxH/dtXMcdEcRGLAXrNEGI4oY2g61WFinsBBF0IJWIIDKoKJNCxMYqKsHRMeB6/P/D3PDUzINvzr1n+c957755pry83JDq6mrT3NxsWltbTVtb26eOjo7ezs7Ohfb29m3sQ1iHenp6trFf6Orq6gWf4TctLS2mpqbGWB3zH8FEv9//FYW/wB3WgkLBWtCE3IEw+Ab/l7iCdDY2NvpA2OfzSVNTk1JfXy+1tbVSV1enawgImqoFYeCLN6EfRX8QFIK9lJSUqMjQ0JAMDg4Kmklpaak2oJ+NGxoaWON/JVhWVuatqKi4rqysFIK9FBcXy/T0tJyenirn5+dycnIic3NzGkO+VFVVaWPYa+h4VdDr9X7AJFvsbMnLy5NAICBPT0+yvr4uwWBQ7u/vxV7z8/NSWFgoENB8WgyxRS2DQDdvzVJQUKCHcHV1JSsrK3JwcCAPDw/ivKLRqOCUNRciCqdGfTcFfxQVFamD1uVyydjYmNze3sra2prEu8bHxyUzM1MnJaylFgXPrJMdKTg6OqpFj4+PcQWnpqY0l3X5+fkK6s8MfqKxjTpzc3P1NC8vL+OKRSIRfSeZyxo+c0ItA0fEdrDB9PR0mZiY0EN5ez0/P8vs7KzmWCGPx6NgHTHocsMNuxGus7OztWB1dfWdIE+csZycnFc1MY0bg8Aenc4ErlNTU2V4ePid4MjIiMaY46yJsccJJ22Qk1nLB85/wsbGhhwfH+uLzVepr69PJ2SOzXcwyQk9CPxl0O12K1xnZGQIvi4SCoXk8PBQwuGwHB0dSX9/v6Slpf0TtPkxDY/JysoiASBOOAW/NDs7O7K/vy+7u7uytLSkf0tOb/PsECAAQWPwcpIE8JMvKmEBbVJSkn4UlpeXZXFxUQYGBtRn8whFWQuxBKcgSYRQkLdqscJcJycnS0pKivreEGQtxd4KGgQ/4lZnwAVFeNsWZ6MYv8EMa1gbT9Cg2CDRDb7j4W9SHDYCG4G9gN1kDLiA1jgFXwAoO8U6gByFCgAAAABJRU5ErkJggg==";
    	this.addDetailHandlerDef({
    		"buttonText": "Guide",
    		"buttonImage": this.iconURI,
    		"handler": function(result, deferred, detailsContent){
    			var formattedFooter = detailsContent.formatTextArea({text: result.data.text});
				deferred.resolve(formattedFooter);
    		},
    		more: true
    	});

    },
    CLASS_NAME: 'Septima.Search.HelpSearcher'
    
});
