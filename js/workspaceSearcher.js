function s4CreateWorkspaceSearcher(options) {
    
    s4LoadWorkspaceRowList(options.sessionId);
    
    options.searchableData =  new Septima.Search.SearchableData({
        data: S4GetWorkspaceRowList,
        singular: options.singular,
        plural: options.plural,
        searchProperties: ['owner','name'],
        getDisplayname: function (row){return row.name +' ('+ row.owner +')';}
    });

    if (typeof spm !== 'undefined' && typeof spm.getEvents !== 'undefined'){
        spm.getEvents().addListener('WORKSPACE_CHANGED', s4LoadWorkspaceRowList.bind(this, options.sessionId));
    }else{
        cbKort.events.addListener ('WORKSPACE_CHANGED', s4LoadWorkspaceRowList.bind(this, options.sessionId));
    }
    
    var showWorkSpace3 = function (workspaceId){
        var options = {id: workspaceId};
        if (jQuery.isFunction( workspace_init )){
            options.hideDialog = false;
        }else{
            options.hideDialog = true;
        }
        workspace_container.startDrawing (options);
    }
    
    var workspaceSearcher = new Septima.Search.DataSearcher(options);
    workspaceSearcher.showWorkSpace = function(result){
        var workspaceId = result.data.wrkspcid;
        if (typeof workspace_init !== 'undefined' ){
            if (typeof workspace_controls == 'undefined' ){
                //Workspace version2
                if (workspace_container === null) {
                    var workspacejs = cbKort.getSession().getParam('cbkort.module.workspace.js');
                    if (workspacejs === null || workspacejs === ""){
                        workspacejs = cbKort.getSession().getParam('module.workspace.js');
                    }
                    require([workspacejs,'/js/standard/color.js'], Septima.bind(function(workspaceId) {
                        workspace_container = new Workspace ({name:'standard'});
                        this.showWorkSpace2(workspaceId);
                    }, this, workspaceId));
                }else{
                    this.showWorkSpace2(workspaceId);
                }
            }else{
                //Workspace version3
                if (typeof workspace_container === 'undefined' || workspace_container === null) {
                    var workspacejs = cbKort.getSession().getParam('module.workspace.js');
                    require(['/modules/workspace/js/workspace.js'], Septima.bind(function(workspaceId) {
                        workspace_container = new Workspace ({name:'standard', controlList: workspace_controls});
                        showWorkSpace3(workspaceId);
                    }, this, workspaceId));
                } else {
                    showWorkSpace3(workspaceId);
                }
            }
        }
    };
    
    return workspaceSearcher;

}

S4WorkspaceRowList = {row: []};

function S4GetWorkspaceRowList() {
    return S4WorkspaceRowList.row;
}

function s4LoadWorkspaceRowList(sessionId) {
    jQuery.ajax({
        url: '/cbkort?page=workspace.getlist&outputformat=json',
        jsonp: 'json.callback',
        data:{sessionId: this.sessionId},
        dataType: 'jsonp',
        crossDomain : true,
        async:true,
        cache : false,
        timeout : 4000,
        success:  function(data, textStatus,  jqXHR){
            if (data.row[0]._class == 'rowlist'){
                var workspaceRowList = data.row[0];
                S4WorkspaceRowList = workspaceRowList;
            }else{
                this.workspaceRowList = {row: []};
            }
      }
      });
}



Septima.Search.workspaceSearcher_org = Septima.Class (Septima.Search.DataSearcher, {

    initialize: function (options) {
		options.searchableData =  new Septima.Search.SearchableRowList({
    		data: Septima.bind(function(){return this.workspaceRowList;}, this),
    		singular: options.singular,
    		plural: options.plural,
    		searchProperties: ['owner','name'],
    		getDisplayname: function (row){return row.name +' ('+ row.owner +')';}
    	});
		
        this.constructor.prototype.constructor.apply(this, [options]);
        //Septima.Search.DataSearcher.prototype.constructor.apply(this, [options]);

        this.iconURI = Septima.Search.s4Icons.workspaceSearcher.iconURI;
        this.workspaceRowList = {row: []};
        this.lastUpdated = null;
        this.host = options.host;
        this.sessionId = options.sessionId;

        cbKort.events.addListener ('WORKSPACE_CHANGED', Septima.bind(function(event, favorite){
        	this.readWorkspaces();
        }, this));
    },

    fetchData: function (query, caller) {
        var now = new Date().getTime();
    	if (this.lastUpdated == null || (now - this.lastUpdated) > 60 * 1000){
        	this.readWorkspaces(Septima.bind(function(query, caller){
        		Septima.Search.DataSearcher.prototype.fetchData.apply(this, [query, caller]);
        	}, this, query, caller));
    	}else{
    		Septima.Search.DataSearcher.prototype.fetchData.apply(this, [query, caller]);
    	}
    },
    
    readWorkspaces: function(success){
    	jQuery.ajax({
    		url: this.host + '/cbkort?page=workspace.getlist&outputformat=json',
            jsonp: 'json.callback',
            data:{sessionId: this.sessionId},
	        dataType: 'jsonp',
            crossDomain : true,
            async:true,
            cache : false,
            timeout : 4000,
            success:  Septima.bind(function(success, data, textStatus,  jqXHR){
            	if (data.row[0]._class == 'rowlist'){
                	var workspaceRowList = data.row[0];
            		this.workspaceRowList = workspaceRowList;
                    var now = new Date().getTime();
            		this.lastUpdated = now;
            	}else{
            		this.workspaceRowList = {row: []};
            	}
            	if (typeof success !== 'undefined' && success != null && jQuery.isFunction(success)){
            		success();
            	}
          }, this, success)
          });
    },

    showWorkSpace: function(result){
    	var workspaceId = result.data.wrkspcid;
    	if (typeof workspace_init !== 'undefined' ){
    		if (typeof workspace_controls == 'undefined' ){
    			//Workspace version2
    			if (workspace_container === null) {
    				var workspacejs = cbKort.getSession().getParam('cbkort.module.workspace.js');
    				if (workspacejs === null || workspacejs === ""){
    					workspacejs = cbKort.getSession().getParam('module.workspace.js');
    				}
    	            require([workspacejs,'/js/standard/color.js'], Septima.bind(function(workspaceId) {
    	                workspace_container = new Workspace ({name:'standard'});
    	                this.showWorkSpace2(workspaceId);
    	            }, this, workspaceId));
    	        }else{
    	        	this.showWorkSpace2(workspaceId);
    	        }
    		}else{
    			//Workspace version3
                if (typeof workspace_container === 'undefined' || workspace_container === null) {
    				var workspacejs = cbKort.getSession().getParam('module.workspace.js');
                    require(['/modules/workspace/js/workspace.js'], Septima.bind(function(workspaceId) {
    	                workspace_container = new Workspace ({name:'standard', controlList: workspace_controls});
    	                this.showWorkSpace3(workspaceId);
    	            }, this, workspaceId));
    	        } else {
    	        	this.showWorkSpace3(workspaceId);
    	        }
    		}
    	}
    },
    
    showWorkSpace2: function (workspaceId){
        var options = {id: workspaceId};
        if (jQuery.isFunction( workspace_init )){
        	options.hideDialog = false;
        }else{
        	options.hideDialog = true;
        }
        workspace_container.start (options);
    },

    showWorkSpace3: function (workspaceId){
        var options = {id: workspaceId};
        if (jQuery.isFunction( workspace_init )){
        	options.hideDialog = false;
        }else{
        	options.hideDialog = true;
        }
        workspace_container.startDrawing (options);
    },

    CLASS_NAME: 'Septima.Search.workspaceSearcher'

});