Septima.Search.ProfileSearcher = Septima.Class (Septima.Search.DataSearcher, {

    initialize: function (options) {
    	this.iconUri =       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QodDS0PMvrmnwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABBklEQVQoz5WSS2rEMBBEX7dkM8T54EvksxjI/W8QyCa7kDMMDMF4QJbUncXgSbKy5m0luqqrS1JKiAgiQgiBWisAy5LIuYArjtP3HbtdByhmBhgRIITASq0Vudl7hPPjHwpwOrzL/cMtAFJKQXWdBrV/cRroyqeo++/flBLtCJJzQcRRVXJ8blLt65eYGQpcAmtldfvPdis5F9ydqKqIwDUz+r7D3dFaC+C4G2X6aPI+TRNmRhQR3MHMUNUm5WEYzjufG+OEENFhv2l+PrzJGq6aGTFGcnxq2nocx0uFVVU4Hr+vSntdT+Z5Jt69+lYpLv0uFVVZ77yttIRHd3eWJRGC4O6YGT8AP4bCedcYxgAAAABJRU5ErkJggg==";
    	this.folderIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QodDS0DO0yqtAAAASJJREFUOMutkz9LA1EQxGf2TmLhv2uEYC02fgbB0k7ExsIPEG1yZ2sTsNDW1tIqWngifoJ01loFsTgQuxRi4RF2LOKFIIqXSwYW3mPhx+y8fURJfdqq/urVvMvizElhP8GGKYsAEMfxgZmdSpoDAJJ9Sdfufnh2ft8r6w4AwiRJrgCsA5gnhwnMANgxs/q4DkMAuxwhDa2TswA2xwVOPcNR4Ie77+V5vmxm9aKOj7b/HduBXrPZrDcajWhaa7NQ8+47ADBJEidJSR13b5vZCcmlKuO6+11YXCTdBEGwD6ASTAOl9k1+k/QgaW2C93h1944NMsWlmW0BWKxKk/QYRdFLCOBZ0i3J9m/7WPrLkRetVqtvklIz2yC5MoG7pyzLUgD4AgJfc89Z4dpFAAAAAElFTkSuQmCC";
    	this.profileRowList = {row: []};
		options.searchableData =  new Septima.Search.SearchableRowList({
    		data: Septima.bind(function(){return this.profileRowList;}, this),
    		singular: options.singular,
    		plural: options.plural,
    		searchProperties: ['name', 'displayname'],
    		displaynameProperty: 'displayname'
    	});
    	Septima.Search.DataSearcher.prototype.initialize.apply(this, [options]);

    	jQuery.ajax({
    		url: options.host + '/cbkort?page=profileselector_get_profiles&outputformat=json',
            jsonp: 'json.callback',
            data:{sessionId: options.sessionId},
	        dataType: 'jsonp',
            crossDomain : true,
            async:true,
            cache : false,
            timeout : 4000,
            success:  Septima.bind(function(data, textStatus,  jqXHR){
            	this.profileRowList = data.row[0];
          }, this)
          });
    },
    

    CLASS_NAME: 'Septima.Search.ProfileSearcher'
    
});
