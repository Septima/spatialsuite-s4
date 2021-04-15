Septima.Search.ThemeSearcher = Septima.Class (Septima.Search.Searcher, {

    themeOffUri: null,
    themeOnUri: null,
    onCustomButtonDef: null,
    offCustomButtonDef: null,
    themePhrase: null,
    themesPhrase: null,
    showPhrase: null,
    hidePhrase: null,
    groups: [],
    
    initialize: function (options) {
        options.soameAttribute = "someValue";
        //Septima.Search.Searcher.prototype.constructor.apply(this, [options]);
        this.constructor.prototype.constructor.apply(this, [options]);
        //Strings
        this.visibleThemesPhrase = cbKort.getSession().getString('s4.themesearcher.visiblethemes');
        //this.toolsPhrase = cbKort.getSession().getString('s4.themesearcher.tools');
        this.themePhrase = cbKort.getSession().getString('s4.themesearcher.theme');
        this.themesPhrase = cbKort.getSession().getString('s4.themesearcher.themes');
        this.showPhrase = cbKort.getSession().getString('s4.themesearcher.show');
        this.hidePhrase = cbKort.getSession().getString('s4.themesearcher.hide');
        this.showLockedPhrase = cbKort.getSession().getString('s4.themesearcher.show_locked');
        this.hideLockedPhrase = cbKort.getSession().getString('s4.themesearcher.hide_locked');
        
        //Icons
        this.themeOffUri = Septima.Search.s4Icons.themeSearcher.themeOffUri;
        this.themeOffLockUri = Septima.Search.s4Icons.themeSearcher.themeOffLockUri;
        this.themeOnUri = Septima.Search.s4Icons.themeSearcher.themeOnUri;
        this.themeOnLockUri = Septima.Search.s4Icons.themeSearcher.themeOnLockUri;
        //this.toolsIconURI = Septima.Search.s4Icons.themeSearcher.toolsIconURI;
        this.defaultThemeIconURI = Septima.Search.s4Icons.themeSearcher.defaultThemeIconURI;
        this.iconURI = Septima.Search.s4Icons.themeSearcher.iconURI;
        this.themeGroupIconURI = Septima.Search.s4Icons.themeSearcher.themeGroupIconURI;
        
        //ButtonDefs
        this.onCustomButtonDef= [{"buttonText": this.hidePhrase, "buttonImage": this.themeOnUri, "callBack": Septima.bind( this.toggleTheme, this)}];
        this.offCustomButtonDef= [{"buttonText": this.showPhrase, "buttonImage": this.themeOffUri, "callBack": Septima.bind( this.toggleTheme, this)}];
        this.onLockCustomButtonDef= [{"buttonText": this.hideLockedPhrase, "buttonImage": this.themeOnLockUri, "callBack": Septima.bind( this.toggleTheme, this)}];
        this.offLockCustomButtonDef= [{"buttonText": this.showLockedPhrase, "buttonImage": this.themeOffLockUri, "callBack": Septima.bind( this.toggleTheme, this)}];

        this.source = this.themesPhrase;
        options.source = this.source;
        this.registerType(this.source, this.themesPhrase);
        this.registerType(this.source, this.visibleThemesPhrase);

//        var themeType = new Septima.Search.ResultType({
//            id: this.themePhrase,
//            singular: this.themePhrase,
//            plural: this.themesPhrase
//          });
//
//        this.registerType(this.source, themeType);
//
//        var visibleThemeType = new Septima.Search.ResultType({
//            id: this.visibleThemesPhrase,
//            singular: this.visibleThemesPhrase,
//            plural: this.visibleThemesPhrase
//          });
//        this.registerType(this.source, visibleThemeType);
        

        //Internal structures used to hold data
        
        this.groups = [];
        /*
        this.groups //array of groups
            [{group: {group}, themes: [indexedTheme, ...], displayname: "groupNameUsedAsType"}], where
                group = cbKort.themeContainer.elements[i]
         */
        this.datasources = {};
        /*
        this.datasources // Object of datasources
            {datasourceid: [indexedTheme, ...]}, where

            indexedTheme = {
                group: cbKort.themeContainer.elements[i],
                theme: group.elements[j] where element.type === "Theme"
                termsToSearch,
                description,
                image,
                displayname
                }
        */
        if (typeof spm !== 'undefined' && typeof spm.getEvents !== 'undefined'){
            spm.getEvents().addListener("THEMESELECTOR_THEMESTORE_INITIALIZED", Septima.bind(function(){
                this.doIndex();
            }, this));
        }else{
            cbKort.events.addListener ('THEMESELECTOR_THEMESTORE_INITIALIZED', Septima.bind(function(){
                this.doIndex();
            }, this));
        }
        
        //Internal house keeping
        this.getLocalThemesDeferred = jQuery.Deferred();
        this.indexDone = false;
        this.loadStarted = false;
    },
    
    cmpVersions: function (cmpVersion, refVersion) {
        var i, diff;
        var regExStrip0 = /(\.0+)+$/;
        var segmentsCmpVersion = cmpVersion.replace(regExStrip0, '').split('.');
        var segmentsRrefVersion = refVersion.replace(regExStrip0, '').split('.');
        var l = Math.min(segmentsCmpVersion.length, segmentsRrefVersion.length);

        for (i = 0; i < l; i++) {
            diff = parseInt(segmentsCmpVersion[i], 10) - parseInt(segmentsRrefVersion[i], 10);
            if (diff) {
                return diff;
            }
        }
        return segmentsCmpVersion.length - segmentsRrefVersion.length;
    },
    
    doIndex: function(){
        if (this.indexDone){
            return;
        }
        var themeGroups = [];
        //Testing if SpS4
        if (typeof cbKort.themeContainer._elements !== 'undefined'){
            themeGroups = cbKort.themeContainer._elements;
        }else{
            themeGroups = cbKort.themeContainer.elements;
        }
        for (var i=0;i<themeGroups.length;i++){
            var themeGroup = themeGroups[i];
            this.doIndexForGroup(themeGroup, null);
        }
        
        //Sort groups
        this.groups.sort(function(g1, g2){
            return (g1.displayname.localeCompare(g2.displayname));
        });
        
        this.indexDone = true;
        
        setTimeout(Septima.bind(function () {
            this.getLocalDatasources().done(Septima.bind(function(localDatasources){
                localThemesArray = [];
                localThemesString = "";
                for (var i=0;i<localDatasources.length;i++){
                    var localDatasource = localDatasources[i];
                    if (typeof this.datasources[localDatasource] !== "undefined"){
                        var indexedThemes = this.datasources[localDatasource];
                        for (var j=0;j<indexedThemes.length;j++){
                            localThemesArray.push(indexedThemes[j].theme.name);
                        }
                    }
                }
                localThemesString = localThemesArray.join(" ");
                this.getLocalThemesDeferred.resolve(localThemesString);
            }, this));
         }, this), 500);
    },
    
    getThemeGroupElements: function(group){
        //Testing if SpS4
        //spatialmap.version.major
        if (typeof group._elements !== 'undefined'){
            return group._elements;
        }else{
            return group.elements;
        }
    },
    
    isTheme: function(groupElement){
        if (typeof groupElement.initialConfig !== 'undefined'){
            return groupElement.initialConfig.type === "Theme";
        }else{
            return groupElement.type === "Theme";
        }
    },
    
    getThemeDescription: function(theme){
        var copyright;
        if (typeof theme.initialConfig !== 'undefined'){
            copyright = theme.initialConfig.copyright;
        }else{
            copyright = theme.copyright;
        }
        for (var i=0;i<copyright.length;i++){
            if (copyright[i].name == "metadata.text"){
                return copyright[i].value;
            }
        }
        return "";
    },
    
    getThemeDisplayName: function(theme){
        if (typeof theme.initialConfig !== 'undefined'){
            return theme.initialConfig.displayname;
        }else{
            return theme.displayname;
        }
    },

    getGroupDisplayName: function(group){
        var displayName;
        try {
            if (typeof group.initialConfig !== 'undefined'){
                displayName = group.initialConfig.displayname;
            }else{
                displayName = group.displayname;
            }
            return displayName.replace(/:/g, "");
        }catch (e) {
            return null;
        }
    },
    
    getThemeImage: function(theme){
        var themeConfig = theme;
        if (typeof theme.initialConfig !== 'undefined'){
            themeConfig = theme.initialConfig;
        }else{
            themeConfig = theme;
        }
        if (typeof themeConfig.img !== 'undefined' && themeConfig.img !== null && themeConfig.img !== ""){
            return themeConfig.img; 
        }
        for (var i=0;i<themeConfig.copyright.length;i++){
            if (themeConfig.copyright[i].name == "img"){
                return themeConfig.copyright[i].value;
            }
        }
        return this.defaultThemeIconURI;
    },
    
    getPrimaryDatasource: function(theme){
        var datasource = null;
        var themeConfig = theme;
        if (typeof theme.initialConfig !== 'undefined'){
            themeConfig = theme.initialConfig;
        }else{
            themeConfig = theme;
        }
        if (themeConfig.primarydatasource){
            datasource = themeConfig.primarydatasource;
        }
        return datasource;
    },
    
    doIndexForGroup: function(group, parentGroup){
            var groupHasThemes = false;
            var groupDisplayName = this.getGroupDisplayName(group);
            if (groupDisplayName == null) {
                return;
            }
            var groupInfo = {"group": group, "themes": [], "name": group.name, "displayname": groupDisplayName}
            var groupElements = this.getThemeGroupElements(group);
            for (var j=0;j<groupElements.length;j++){
                //Testing if SpS4
                //spatialmap.version.major
                var groupElement = groupElements[j];
                if (this.isTheme(groupElement)){
                    var theme = groupElement;
                    if (this.isSelectable(theme)){
                        groupHasThemes = true;
                        var themeDisplayname = this.getThemeDisplayName(theme);
                        var themeDescription = this.getThemeDescription(theme);
                        var terms = (themeDisplayname + " " + themeDescription).toLowerCase().split(" ");
                        var termsToSearch = [];
                        for (var k=0;k<terms.length;k++){
                            term = terms[k];
                            if (term.length > 1){
                                termsToSearch.push(term);
                            }
                        }
                        var indexedTheme = {"theme": theme, "termsToSearch": termsToSearch, "description": themeDescription, "image": this.getThemeImage(theme), "displayname": themeDisplayname, "group": groupInfo};
                        groupInfo.themes.push(indexedTheme);
                        var datasource = this.getPrimaryDatasource(theme);
                        if (datasource){
                            if (typeof this.datasources[datasource] === 'undefined'){
                                this.datasources[datasource] = [];
                            }
                            this.datasources[datasource].push(indexedTheme);
                        }
                    }
                }else{
                    var thisGroup = groupElement;
                    this.doIndexForGroup(thisGroup, group);
                }
            }
            if (groupHasThemes){
                this.groups.push(groupInfo);
                this.registerType(this.source, groupInfo.displayname)
            }
    },
    
    getThemeFromId: function(themeId){
        for (var i=0;i<this.groups.length;i++){
            var group = this.groups[i];
            for (var j=0;j<group.themes.length;j++){
                var indexedTheme = group.themes[j];
                if (indexedTheme.theme.name === themeId){
                    return this.createQueryResult().addResult(this.source, indexedTheme.group.displayname, indexedTheme.displayname + " (" + this.themePhrase + ")", null, null, indexedTheme);
                }
            }
        }
        return null;
    },
    
    getThemesForDatasource: function(datasource){
        var queryResult = this.createQueryResult();
        if (typeof this.datasources[datasource.id] !== 'undefined'){
            for (var i=0;i<this.datasources[datasource.id].length;i++){
                var indexedTheme = this.datasources[datasource.id][i];
                var description = null;
                if (typeof indexedTheme.description !== 'undefined' && indexedTheme.description !== null){
                    description = indexedTheme.description;
                }
                var result = queryResult.addResult(this.source, indexedTheme.group.displayname, indexedTheme.displayname + " (" + this.themePhrase + ")", description, null, indexedTheme);
                result.image = indexedTheme.image;
            }
        }
        return queryResult;
    },
    
    getThemeGroupsForTheme: function (themeResult){
        return [themeResult.data.group];
        //Todo: get themeId and traverse all indexedThemes to see if in more than one group
    },
    
    getThemesForThemeGroup: function (themeGroup){
        var queryResult = this.createQueryResult();
                for (var t=0; t<themeGroup.themes.length; t++){
                    var indexedTheme = themeGroup.themes[t];
                    var description = null;
                    if (typeof indexedTheme.description !== 'undefined' && indexedTheme.description !== null){
                        description = indexedTheme.description;
                    }
                    var result = queryResult.addResult(this.source, themeGroup.displayname, indexedTheme.displayname, description, null, indexedTheme);
                    result.image = indexedTheme.image;
                }
//        for (var i=0; i<this.groups.length; i++){
//            var thisGroup = this.groups[i];
//            if (thisGroup.group.name === themeGroup.name){
//                for (var t=0; t<thisGroup.themes.length; t++){
//                    var indexedTheme = thisGroup.themes[t];
//                    var description = null;
//                    if (typeof indexedTheme.description !== 'undefined' && indexedTheme.description !== null){
//                        description = indexedTheme.description;
//                    }
//                    var result = queryResult.addResult(this.source, thisGroup.displayname, indexedTheme.displayname, description, null, indexedTheme);
//                    result.image = indexedTheme.image;
//                }
//            }
//        }
        return queryResult;
    },
    
    getLocalthemes: function(){
        return this.getLocalThemesDeferred.promise();
    },
    
    getVisibleIndexedThemes: function(){
        var visibleThemes = [];
        for (var i=0;i<this.groups.length;i++){
            var group = this.groups[i];
            for (var j=0;j<group.themes.length;j++){
                var indexedTheme = group.themes[j];
                if (this.isVisible(indexedTheme.theme)){
                    visibleThemes.push(indexedTheme);
                }
            }
        }
        return visibleThemes;
    },
    
    isLocked: function(theme){
        if (typeof theme.initialConfig !== 'undefined'){
            var scale = spm.getMapControl().getMapState().mapscale;
            return (theme.initialConfig.computedmaxscale != null && scale > theme.initialConfig.computedmaxscale) || (theme.initialConfig.computedminscale != null && scale < theme.initialConfig.computedminscale);
        }else{
            var scale = cbKort.getState().map.scale;
            return (theme.maxscale != null && scale > theme.maxscale) || (theme.minscale != null && scale < theme.minscale);
        }
    },

    isSelectable: function(theme){
        if (typeof theme.initialConfig !== 'undefined'){
            return theme.initialConfig.selectable === "true";
        }else{
            return theme.selectable === "true";
        }
    },

    isVisible: function(theme){
        if (typeof theme.initialConfig !== 'undefined'){
            return theme.isVisible();
        }else{
            return theme.visible;
        }
    },
    
    toggleVisibility: function(theme){
        if (typeof theme.initialConfig !== 'undefined'){
            if (theme.getInStore()){
                theme.setInStore(false, function (response) {
                    if (response && response.exception)
                        toastr.spmException(response.exception);
                    else
                        theme.show();
                });                
                return true;
            }else{
                theme.toggle();
                return this.isVisible(theme);
            }
        }else{
            theme.setVisibility();
            theme.redraw();
            if (typeof cbKort.themeSelector.setSpatialMapState !== 'undefined'){
                cbKort.themeSelector.setSpatialMapState();
            }
            return this.isVisible(theme);
        }
    },
    
    toggleTheme: function(result){
        var theme = result.data.theme;
        var visisible = this.toggleVisibility(theme);
        if (visisible){
            if (this.isLocked(theme)) {
                return this.onLockCustomButtonDef[0];
            }else{
                return this.onCustomButtonDef[0];
            }
        }else{
            if (this.isLocked(theme)) {
                return this.offLockCustomButtonDef[0];
            }else{
                return this.offCustomButtonDef[0];
            }
        }
    },

    getCustomButtonDefs: function(result){
        if (result.isNewQuery()){
            return [];
        }else{
            var theme = result.data.theme;
            if (this.isVisible(theme)){
                if (this.isLocked(theme)) {
                    return this.onLockCustomButtonDef;
                }else{
                    return this.onCustomButtonDef;
                }
            }else{
                if (this.isLocked(theme)) {
                    return this.offLockCustomButtonDef;
                }else{
                    return this.offCustomButtonDef;
                }
            }
        }
    },
    
    fetchData: function (query, caller) {
        if (this.indexDone){
            this.fetchIndexedData(query, caller);
        }else{
            //Return newquery right away and then call doIndex()
            var queryResult = this.createQueryResult();
            queryResult.addNewQuery(this.source, this.themesPhrase, this.themesPhrase, null, query.queryString, null, null, null);
            caller.fetchSuccess(queryResult);
            this.loadThemesAndDoIndex();
        }
    },
    
    loadThemesAndDoIndex: function(){
        if (!this.loadStarted){
            this.loadStarted = true;
            var callDoIndexAfterDelay = Septima.bind(function(){
                setTimeout(Septima.bind(function () {
                    this.doIndex();
                }, this), 100);
            }, this);
            
            setTimeout(Septima.bind(function(afterLoadFunction){
                if (typeof cbKort.themeSelector.loadThemes !== 'undefined'){
                    cbKort.themeSelector.loadThemes(afterLoadFunction);
                }else if (typeof cbKort.themeSelector.createThemeStore !== 'undefined'){
                    cbKort.themeSelector.createThemeStore(afterLoadFunction);
                }else if (typeof cbKort.themeSelector._createThemeStore !== 'undefined'){
                    cbKort.themeSelector._createThemeStore(afterLoadFunction);
                }else{
                    //Assume themes are already loaded
                    afterLoadFunction();
                }
            }, this, callDoIndexAfterDelay), 100);
        }
    },
    
    fetchIndexedData: function (query, caller) {
        var groupName = "*";

        var queryResult = this.createQueryResult();
        
        if (query.hasTarget){
            if (query.target.type && this.hasType(query.target.type) && query.target.type !== this.themesPhrase){
                groupName = query.target.type;
            }
            var result = queryResult.addNewQuery(this.source, this.visibleThemesPhrase, this.visibleThemesPhrase, "", "", null, null);
            result.image = Septima.Search.s4Icons.themeSearcher.themeOnUri;
        }
        
        if (groupName == this.visibleThemesPhrase){
            var visibleIndexedThemes = this.getVisibleIndexedThemes();
            for (var i=0;i<visibleIndexedThemes.length;i++){
                var indexedtheme = visibleIndexedThemes[i];
                var result = queryResult.addResult(this.source, indexedtheme.group.displayname, indexedtheme.displayname, indexedtheme.description, null, indexedtheme);
                result.image = indexedtheme.image;
            }
        }else{
            var matchingGroups = [];
                matchingGroups = this.getMatchingGroups(query.queryString, groupName);
                var totalThemeCount = 0;
                for (var i=0;i<matchingGroups.length;i++){
                    totalThemeCount += matchingGroups[i].themes.length;
                }
                
                if (query.type == "list" || (query.type === "no-cut" && totalThemeCount <= query.limit) || (query.type === "no-cut" && matchingGroups.length <= query.limit)){
                    if ((query.type === "list" && (groupName !=='*' || totalThemeCount <= query.limit)) || (query.type === "no-cut" && totalThemeCount <= query.limit)) {
                        let indexedThemesToShow = []
                        for (var i=0;i<matchingGroups.length;i++) {
                            indexedThemesToShow = indexedThemesToShow.concat(matchingGroups[i].themes);
                        }
                        indexedThemesToShow.sort(function(a, b){
                            if (a.score == b.score){
                                return a.displayname.localeCompare(b.displayname)
                            }else{
                                return b.score - a.score;
                            }
                        });
                        for (var j=0;j<indexedThemesToShow.length;j++){
                            indexedTheme = indexedThemesToShow[j];
                            var result1;
                            if (query.hasTarget){
                                result1 = queryResult.addResult(this.source, indexedTheme.group.displayname, indexedTheme.displayname, indexedTheme.description, null, indexedTheme);
                            }else{
                                result1 = queryResult.addResult(this.source, indexedTheme.group.displayname, indexedTheme.displayname + " (" + this.themePhrase + ")", indexedTheme.description, null, indexedTheme);
                            }
                            result1.image = indexedTheme.image;
                        }
                    }else{
                        for (var i=0;i<matchingGroups.length;i++){
                            var type = matchingGroups[i].displayname;
                            var result3 = queryResult.addNewQuery(this.source, type, matchingGroups[i].displayname, null, query.queryString, null, null, null)
                            result3.image = this.themeGroupIconURI;
                        }
                    }
                } else if (query.type == "collapse" || ((query.type === "no-cut" && totalThemeCount > query.limit))){
                    queryResult.addNewQuery(this.source, this.themesPhrase, this.themesPhrase + " (" + totalThemeCount + ")", null, query.queryString, null, null, null);
                    
                } else if (query.type == "cut"){
                    for (var i=0;i<matchingGroups.length && i < query.limit;i++){
                        var type = matchingGroups[i].displayname;
                        var result3 = queryResult.addNewQuery(this.source, type, matchingGroups[i].displayname, null, "", null, null, null)
                        result3.image = this.themeGroupIconURI;
                    }
                    if (matchingGroups.length > query.limit) {
                        queryResult.addNewQuery(this.source, this.themesPhrase, this.themesPhrase + " (" + totalThemeCount + ")", null, query.queryString, null, null, null);
                    }
                }
        }
    
        setTimeout(Septima.bind(function (caller, queryResult){caller.fetchSuccess(queryResult);}, this, caller, queryResult), 100);
    },
    
    getMatchingGroups: function (queryString, groupName){
        var matchingGroups = [];
        if (queryString === ""){
            for (var j=0;j<this.groups.length;j++){
                var group = this.groups[j];
                if (groupName === "*" || (group.displayname.toLowerCase() === groupName.toLowerCase())){
                    matchingGroups.push(group);
                }
            }
        }else{
            var queryTerms = queryString.split(" ");
            for (var j=0;j<this.groups.length;j++){
                var group = this.groups[j];
                if (groupName == "*" || group.displayname.toLowerCase() == groupName.toLowerCase()){
                    var themes = this.getScoredGroupThemes(group, queryTerms);
                    if (themes.length>0){
                        matchingGroups.push({"group": group.group, "themes": themes, "displayname": group.displayname});
                    }else{
//                        if (group.displayname.toLowerCase().indexOf(queryTerms[0]) == 0){
//                            matchingGroups.push({"group": group, "themes": []});
//                        }
                    }
                }
            }
        }
            
        return matchingGroups;
    },
    
    getScoredGroupThemes: function(group, queryTerms){
        var themes = [];
        for (var k=0;k<group.themes.length;k++){
            var theme = group.themes[k];
            theme.score = 0;
            for (var i=0;i<queryTerms.length;i++){
                var term = queryTerms[i].toLowerCase();
                if (theme.displayname.toLowerCase().indexOf(term)==0){
                    theme.score += 2;
                }else if (this.match(term, theme.termsToSearch)){
                    theme.score += 1;
                }
            }
            if (theme.score > 0){
                themes.push(theme);
            }
        }
        themes.sort(this.sortByScoreName);
        return themes;
    },
    
    sortByScoreName: function(a, b){
        if (a.score == b.score){
            return a.displayname.localeCompare(b.displayname)
        }else{
            return b.score - a.score;
        }
    },
    
    match: function(testTerm, terms){
        for (var i=0;i<terms.length;i++){
            if (terms[i].indexOf(testTerm)==0){
                return true;
            }
        }
        return false;
    },
    
    getCopyRightLink: function(result){
        var link = null;
        var theme = result.data.theme;
        var themeConfig = theme;
        if (typeof theme.initialConfig !== 'undefined'){
            themeConfig = theme.initialConfig;
        }

        if (themeConfig.copyright !== 'undefined' && themeConfig.copyright.length>1){
            var text = null;
            var url = null;
            var copyrightparts = themeConfig.copyright; 
            for (var i=0;i<copyrightparts.length;i++){
                var copyrightpart = copyrightparts[i];
                if (copyrightpart.name == 'copyright-text'){
                    text = copyrightpart.value;
                }else if (copyrightpart.name == 'copyright.url'){
                    url = copyrightpart.value;
                }
            }
            var copyRightIconUri = Septima.Search.s4Icons.themeSearcher.copyRightIconUri;
            if (text !== null && url !== null){
                link = jQuery("<li class='statebutton-icon'><a target='_blank' href='" + url + "' title='" + text + "'><img src='" + copyRightIconUri + "'/></a><li>");
                link.css("top", "-2px");
            }
        }
        return link;
    },
    
    getLocalDatasources: function(){
        var deferred = jQuery.Deferred();
        jQuery.ajax({
            url: '/spatialmap?page=s4GetLocalDatasources&outputformat=json',
            jsonp: 'json.callback',
            data:{sessionId: this.sessionId},
            dataType: 'jsonp',
            crossDomain : true,
            async:true,
            cache : false,
            timeout : 4000,
            success:  Septima.bind(function(deferred, data, textStatus,  jqXHR){
                var localDatasources = [];
                if (data && data.row && data.row[0].row){
                    for (var i=0;i<data.row[0].row.length;i++){
                        localDatasources.push(data.row[0].row[i]._name);
                    }
                    localDatasources.sort(function(t1, t2){
                        return (t1.localeCompare(t2));
                    });
                }
                deferred.resolve(localDatasources);
          }, this, deferred)
          });
        return deferred.promise();
    },

    CLASS_NAME: 'Septima.Search.ThemeSearcher'

});