Septima.Search.workspaceSearcher = Septima.Class (Septima.Search.Searcher, {

	workspacePhrase: null,
	workspacesPhrase: null,
	workspaceData: null,
	jsonSearcher: null,

    initialize: function (options) {
		this.Searcher(options);
    	this.workspacePhrase = cbInfo.getString('Arbejdsomr\u00E5de');
    	this.workspacesPhrase = cbInfo.getString('workspace.workspace_list.showdivbox1');
    },
    
    showWorkspace: function(id){
    	
    },
    
    fetchData: function (query, caller) {
    	if (this.jsonSearcher == null){
    		this.jsonSearcher = this.createJsonSearcher();
    	}
    	var meAsCaller = {fetchSuccess: Septima.bind(this.fetchSuccess, this, query, caller),
                          fetchError: Septima.bind(this.fetchError, this, caller)}
    	this.jsonSearcher.fetchData(query, meAsCaller);
    },
    
    fetchSuccess: function (queryResult, query, caller){
    	caller.fetchSuccess(this.createQueryResult(queryResult, query))
    },
    
    fetchError: function(searcher, errorThrown, caller){
    	caller.fetchError (this, errorThrown);
    },
    
    CLASS_NAME: 'Septima.Search.workspaceSearcher'

});