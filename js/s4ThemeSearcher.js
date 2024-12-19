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
        Septima.Search.Searcher.prototype.constructor.apply(this, [options]);

        //Strings
        this.visibleThemesPhrase = spm.getSession().getString('s4.themesearcher.visiblethemes')
        this.themePhrase = spm.getSession().getString('s4.themesearcher.theme');
        this.themesPhrase = spm.getSession().getString('s4.themesearcher.themes');
        this.showPhrase = spm.getSession().getString('s4.themesearcher.show');
        this.hidePhrase = spm.getSession().getString('s4.themesearcher.hide');
        this.showLockedPhrase = spm.getSession().getString('s4.themesearcher.show_locked');
        this.hideLockedPhrase = spm.getSession().getString('s4.themesearcher.hide_locked');

        this.privateUserThemesGroupDisplayName =  spm.getSession().getString('standard.themegroups.privateuserthemes');
        this.privateUserThemesGroupName =  "userthemes-private";
        this.publicUserThemesGroupDisplayName =  spm.getSession().getString('standard.themegroups.publicuserthemes');
        this.publicUserThemesGroupName =  "userthemes-public";

        this.privateUserDrawingsGroupDisplayName =  spm.getSession().getString('standard.themegroups.privateuserdrawings');
        this.privateUserDrawingsGroupName =  "userdrawings-private";
        this.publicUserDrawingsGroupDisplayName =  spm.getSession().getString('standard.themegroups.publicuserdrawings');
        this.publicUserDrawingsGroupName =  "userdrawings-public";
        
        //Icons
        this.themeOffUri = Septima.Search.s4Icons.themeSearcher.themeOffUri;
        this.themeOffLockUri = Septima.Search.s4Icons.themeSearcher.themeOffLockUri;
        this.themeOnUri = Septima.Search.s4Icons.themeSearcher.themeOnUri;
        this.themeOnLockUri = Septima.Search.s4Icons.themeSearcher.themeOnLockUri;
        this.toggleIconUri = Septima.Search.s4Icons.themeSearcher.toggleIconUri;
        this.defaultThemeIconURI = Septima.Search.s4Icons.themeSearcher.defaultThemeIconURI;
        this.iconURI = Septima.Search.s4Icons.themeSearcher.iconURI;
        this.themeGroupIconURI = Septima.Search.s4Icons.themeSearcher.themeGroupIconURI;
        this.userThemesGroupIconURI = spatialmap.gui.SKIN_PATH_AND_NAME + "/images/modules/userthemes/doc_plus_icon16x16.png";
        this.userDrawingsGroupIconURI = spatialmap.gui.SKIN_PATH_AND_NAME + "/images/modules/drawings/editdrawing_themeaction16x16.png";

        //ButtonDefs
        this.onCustomButtonDef= [{"buttonText": this.hidePhrase, "buttonImage": this.themeOnUri, "callBack": Septima.bind( this.toggleTheme, this)}];
        this.offCustomButtonDef= [{"buttonText": this.showPhrase, "buttonImage": this.themeOffUri, "callBack": Septima.bind( this.toggleTheme, this)}];
        this.onLockCustomButtonDef= [{"buttonText": this.hideLockedPhrase, "buttonImage": this.themeOnLockUri, "callBack": Septima.bind( this.toggleTheme, this)}];
        this.offLockCustomButtonDef= [{"buttonText": this.showLockedPhrase, "buttonImage": this.themeOffLockUri, "callBack": Septima.bind( this.toggleTheme, this)}];
        this.toggleCustomButtonDef= [{"buttonText": this.showPhrase + "/" + this.hidePhrase, "buttonImage": this.toggleIconUri, "callBack": Septima.bind( this.toggleTheme, this)}];


        //Variables
        this.source = this.themesPhrase;

        this.userThemesIncluded = "all" // "none", "private", "all"
        if (options.userThemes)
            this.userThemesIncluded = options.userThemes

        this.userDrawingsIncluded = "all" // "none", "private", "all"
        if (options.userDrawings)
            this.userDrawingsIncluded = options.userDrawings

        this.searchDescription = true
        if (typeof options.searchDescription !== 'undefined')
            this.searchDescription = options.searchDescription

        //Internal structures used to hold data
        
        this.groups = [];
        /*
        this.groups //array of groups
            [{group: {group}, themes: [indexedTheme, ...], displayname: "groupNameUsedAsType"}], where
                group = cbKort.themeContainer.elements[i]

        , hvor indexedTheme er
        {"theme": theme, "termsToSearch": termsToSearch, "description": themeDescription, "image": this.getThemeImage(theme, groupInfo), "displayname": themeDisplayname, "group": groupInfo, "themeType": themeType}        
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
            // Listen for Minimap events to update the theme list
            spm.getEvents().addListener("THEMES_ADDED", Septima.bind(function(themes, monkeys){
                let y = 2;
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
            if (themeGroup.name === this.privateUserThemesGroupName){
                if (this.userThemesIncluded !== "none")
                    this.doIndexForGroup(themeGroup, null);
            } else if (themeGroup.name === this.publicUserThemesGroupName){
                if (this.userThemesIncluded === "all")
                    this.doIndexForGroup(themeGroup, null);
            } else if (themeGroup.name === this.privateUserDrawingsGroupName){
                if (this.userDrawingsIncluded !== "none")
                    this.doIndexForGroup(themeGroup, null);
            } else if (themeGroup.name === this.publicUserDrawingsGroupName){
                if (this.userDrawingsIncluded === "all")
                    this.doIndexForGroup(themeGroup, null);
            } else {
                this.doIndexForGroup(themeGroup, null);
            }
        }

        var themeType = new Septima.Search.ResultType({
            id: this.themesPhrase,
            singular: this.themePhrase,
            plural: this.themesPhrase
          });

        this.registerType(this.source, themeType);

        /*
        this.registerType(
            this.source,
            new Septima.Search.ResultType({
                id: this.privateUserThemesGroupName,
                singular: this.privateUserThemesGroupDisplayName,
                plural: this.privateUserThemesGroupDisplayName,
                iconURI: this.userThemesGroupIconURI
            })
        )

        this.registerType(
            this.source,
            new Septima.Search.ResultType({
                id: this.privateUserDrawingsGroupName,
                singular: this.privateUserDrawingsGroupDisplayName,
                plural: this.privateUserDrawingsGroupDisplayName,
                iconURI: this.userDrawingsGroupIconURI
            })
        )
        */

        this.registerType(
            this.source,
            new Septima.Search.ResultType({
                id: this.visibleThemesPhrase,
                singular: this.visibleThemesPhrase,
                plural: this.visibleThemesPhrase
            })
        );

        //Sort groups
        let getSortWeight = (themeGroup) => {
            switch (themeGroup.name) {
                case this.privateUserThemesGroupName:
                    return -4;
                case this.publicUserThemesGroupName:
                    return -3;
                case this.privateUserDrawingsGroupName:
                    return -2;
                case this.publicUserDrawingsGroupName:
                    return -1;
                default:
                    return 0
            }
        }

        this.groups.sort((g1, g2)=>{
            let g1Weight = getSortWeight(g1);
            let g2Weight = getSortWeight(g2);
            if (g1Weight === g2Weight)
                return (g1.displayname.localeCompare(g2.displayname));
            else
                return (g1Weight - g2Weight)
        });

        let getThemeGroupIcon = (themeGroup) => {
            switch (themeGroup.name) {
                case this.privateUserThemesGroupName:
                case this.publicUserThemesGroupName:
                    return this.userThemesGroupIconURI;
                case this.privateUserDrawingsGroupName:
                case this.publicUserDrawingsGroupName:
                    return this.userDrawingsGroupIconURI;
                default:
                    return this.themeGroupIconURI;
            }
        }

        for (let groupInfo of this.groups) {
            this.registerType(
                this.source,
                new Septima.Search.ResultType({
                    id: groupInfo.name,
                    singular: groupInfo.displayname,
                    plural: groupInfo.displayname,
                    iconURI: getThemeGroupIcon(groupInfo)
                })
            )
        }

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
    
    getThemeImage: function(theme, groupInfo){
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
        if (groupInfo.name === this.privateUserThemesGroupName || groupInfo.name === this.publicUserThemesGroupName)
            return this.userThemesGroupIconURI
        else if (groupInfo.name === this.privateUserDrawingsGroupName || groupInfo.name === this.publicUserDrawingsGroupName)
            return this.userDrawingsGroupIconURI
        else
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
                        //TODO: Check if removable
                        var themeType = theme.constructor.name
                        var themeDisplayname = this.getThemeDisplayName(theme);
                        var themeDescription = this.getThemeDescription(theme);

                        //TODO: Terms to respect what needs to be searched
                        var stringToBeSearched = themeDisplayname;
                        if (this.searchDescription)
                            stringToBeSearched += themeDescription;
                        var terms = stringToBeSearched.toLowerCase().split(" ");
                        var termsToSearch = [];
                        for (let term of terms){
                            if (term.length > 1)
                                termsToSearch.push(term);
                        }
                        var indexedTheme = {"theme": theme, "termsToSearch": termsToSearch, "description": themeDescription, "image": this.getThemeImage(theme, groupInfo), "displayname": themeDisplayname, "group": groupInfo, "themeType": themeType};
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
            }
    },
    
    getThemeFromId: function(themeId){
        for (var i=0;i<this.groups.length;i++){
            var group = this.groups[i];
            for (var j=0;j<group.themes.length;j++){
                var indexedTheme = group.themes[j];
                if (indexedTheme.theme.name === themeId){
                    var result = this.createQueryResult().addResult(this.source, this.source, indexedTheme.displayname + " (" + this.themePhrase + ")", null, null, indexedTheme);
                    result.id = indexedTheme.theme.name;
                    return result;
                }
            }
        }
        return null;
    },
    
    get: function(themeId){
        return this.getThemeFromId(themeId);
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
                var result = queryResult.addResult(this.source, this.source, indexedTheme.displayname + " (" + this.themePhrase + ")", description, null, indexedTheme);
                result.image = indexedTheme.image;
                result.id = indexedTheme.theme.name;
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
            var result = queryResult.addResult(this.source, this.source, indexedTheme.displayname, description, null, indexedTheme);
            result.image = indexedTheme.image;
            result.id = indexedTheme.theme.name;
        }
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
            return this.toggleCustomButtonDef;
            /*
            var theme = result.data.theme;
            if (theme.getInStore()){
                return this.onCustomButtonDef;
            }
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
            */
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
    
    ready: function(){
        if (typeof Promise == 'undefined'){
            return true
        } else {
            if (this.indexDone){
                return Promise.resolve();
            } else {
                return this.loadThemesAndDoIndex();
            }
        }
    },

    loadThemesAndDoIndex: function(){
        if (typeof Promise == 'undefined'){
            if (!this.loadStarted){
                this.loadStarted = true;
                var afterLoadFunction = this.doIndex.bind(this)
                if (cbKort.themeSelector && typeof cbKort.themeSelector.loadThemes !== 'undefined'){
                    cbKort.themeSelector.loadThemes(afterLoadFunction);
                }else if (cbKort.themeSelector && typeof cbKort.themeSelector.createThemeStore !== 'undefined'){
                    cbKort.themeSelector.createThemeStore(afterLoadFunction);
                }else if (cbKort.themeSelector && typeof cbKort.themeSelector._createThemeStore !== 'undefined'){
                    cbKort.themeSelector._createThemeStore(afterLoadFunction);
                }else if (spm._loadThemes !== 'undefined'){
                    spm._loadThemes("active", [], afterLoadFunction)
                }else{
                    //Assume themes are already loaded
                    afterLoadFunction();
                }
        }
        } else {
            if (!this.loadStarted){
                this.loadStarted = true;
                this.loadThemesAndDoIndexPromise = new Promise(function(resolve, reject) {
                    var afterLoadFunction = this.doIndex.bind(this)
                    try {
                        if (cbKort.themeSelector && typeof cbKort.themeSelector.loadThemes !== 'undefined'){
                            cbKort.themeSelector.loadThemes(afterLoadFunction);
                        }else if (cbKort.themeSelector && typeof cbKort.themeSelector.createThemeStore !== 'undefined'){
                            cbKort.themeSelector.createThemeStore(afterLoadFunction);
                        }else if (cbKort.themeSelector && typeof cbKort.themeSelector._createThemeStore !== 'undefined'){
                            cbKort.themeSelector._createThemeStore(afterLoadFunction);
                        }else if (spm._loadThemes !== 'undefined'){
                            spm._loadThemes("active", [], afterLoadFunction)
                        }else{
                            //Assume themes are already loaded
                            afterLoadFunction();
                        }
                        resolve();
                        } catch {
                            afterLoadFunction();
                        }
                    }.bind(this))
                return this.loadThemesAndDoIndexPromise;
    
            } else {
                return this.loadThemesAndDoIndexPromise
            }
        }
    },
        /*

        this.privateUserThemesGroupDisplayName =  spm.getSession().getString('standard.themegroups.privateuserthemes');
        this.privateUserThemesGroupName =  "userthemes-private";
        this.publicUserThemesGroupDisplayName =  spm.getSession().getString('standard.themegroups.publicuserthemes');
        this.publicUserThemesGroupName =  "userthemes-public";

        this.privateUserDrawingsGroupDisplayName =  spm.getSession().getString('standard.themegroups.privateuserdrawings');
        this.privateUserDrawingsGroupName =  "userdrawings-private";
        this.publicUserDrawingsGroupDisplayName =  spm.getSession().getString('standard.themegroups.publicuserdrawings');
        this.publicUserDrawingsGroupName =  "userdrawings-public";

        */
    
    fetchIndexedData: function (query, caller) {

        var queryResult = this.createQueryResult();
        
        var groupName = "*";
        if (query.hasTarget){
            if (query.target.type && this.hasType(query.target.type) && query.target.type !== this.themesPhrase){
                groupName = query.target.type;
                var result = queryResult.addNewQuery(this.source, this.themesPhrase, "Alle temaer", "",  query.queryString, null, null);
                result.image = Septima.Search.icons.details.back_black;
        } else {
                if (query.queryString === ""){
                    var result = queryResult.addNewQuery(this.source, this.visibleThemesPhrase, this.visibleThemesPhrase, "", "", null, null);
                    result.image = Septima.Search.s4Icons.themeSearcher.themeOnUri;
                    }
            }
        }
        
        if (groupName === this.visibleThemesPhrase){
            var visibleIndexedThemes = this.getVisibleIndexedThemes();
            for (var i=0;i<visibleIndexedThemes.length;i++){
                var indexedTheme = visibleIndexedThemes[i];
                var result = queryResult.addResult(this.source, this.source, indexedTheme.displayname, indexedTheme.description, null, indexedTheme);
                result.image = indexedTheme.image;
                result.id = indexedTheme.theme.name;
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
                        //OK Her beslutter vi os for at vise temaer
                        //Nye måde
                        for (let matchingGroup of matchingGroups){
                            //Specielle grupper; hvis der er mere end et tema i dem så vis newQuery (så en millard skitser ikke forurener listen over alm temaer f.eks.)
                            if (matchingGroup.group.name === this.privateUserThemesGroupName && matchingGroup.themes.length > 1 && groupName !== this.privateUserThemesGroupName){
                                let newQuery = queryResult.addNewQuery(this.source, this.privateUserThemesGroupName, this.privateUserThemesGroupDisplayName + " (" + matchingGroup.themes.length + ")", null, query.queryString, null, null, null)
                                newQuery.image = this.userThemesGroupIconURI
                            } else if (matchingGroup.group.name === this.publicUserThemesGroupName && matchingGroup.themes.length > 1 && groupName !== this.publicUserThemesGroupName) {
                                let newQuery = queryResult.addNewQuery(this.source, this.publicUserThemesGroupName, this.publicUserThemesGroupDisplayName + " (" + matchingGroup.themes.length + ")", null, query.queryString, null, null, null)
                                newQuery.image = this.userThemesGroupIconURI
                            } else if (matchingGroup.group.name === this.privateUserDrawingsGroupName && matchingGroup.themes.length > 1 && groupName !== this.privateUserDrawingsGroupName) {
                                let newQuery = queryResult.addNewQuery(this.source, this.privateUserDrawingsGroupName, this.privateUserDrawingsGroupDisplayName + " (" + matchingGroup.themes.length + ")", null, query.queryString, null, null, null)
                                newQuery.image = this.userDrawingsGroupIconURI
                            } else if (matchingGroup.group.name === this.publicUserDrawingsGroupName && matchingGroup.themes.length > 1 && groupName !== this.publicUserDrawingsGroupName) {
                                let newQuery = queryResult.addNewQuery(this.source, this.publicUserDrawingsGroupName, this.publicUserDrawingsGroupDisplayName + " (" + matchingGroup.themes.length + ")", null, query.queryString, null, null, null)
                                newQuery.image = this.userDrawingsGroupIconURI
                            } else {
                                for (let indexedTheme of matchingGroup.themes) {
                                    this.addIndexedThemeToQueryResult(queryResult, indexedTheme, groupName, query.hasTarget)
                                }
                            }

                        }

                    }else{
                        for (let matchingGroup of matchingGroups){
                            if (matchingGroup.themes.length === 1){
                                this.addIndexedThemeToQueryResult(queryResult, matchingGroup.themes[0], groupName, query.hasTarget)
                            } else {
                                var type = matchingGroup.name;
                                var result3 = queryResult.addNewQuery(this.source, type, matchingGroup.displayname, null, query.queryString, null, null, null)
                                //result3.image = this.themeGroupIconURI;
                            }
                        }
                    }
                } else if (query.type == "collapse" || ((query.type === "no-cut" && totalThemeCount > query.limit))){
                    queryResult.addNewQuery(this.source, this.themesPhrase, this.themesPhrase + " (" + totalThemeCount + ")", null, query.queryString, null, null, null);
                    
                } else if (query.type == "cut"){
                    for (var i=0;i<matchingGroups.length && i < query.limit;i++){
                        var type = matchingGroups[i].name;
                        var result3 = queryResult.addNewQuery(this.source, type, matchingGroups[i].displayname, null, "", null, null, null)
                        //result3.image = this.themeGroupIconURI;
                    }
                    if (matchingGroups.length > query.limit) {
                        queryResult.addNewQuery(this.source, this.themesPhrase, this.themesPhrase + " (" + totalThemeCount + ")", null, query.queryString, null, null, null);
                    }
                }
        }
    
        setTimeout(Septima.bind(function (caller, queryResult){caller.fetchSuccess(queryResult);}, this, caller, queryResult), 100);
    },

    addIndexedThemeToQueryResult: function (queryResult, indexedTheme, groupName, hasTarget) {
        let result = queryResult.addResult(this.source, indexedTheme.group.name, indexedTheme.displayname, indexedTheme.description, null, indexedTheme);
        if (groupName === "*")
            result.description = indexedTheme.group.displayname + (result.description ? " > " + result.description : "")
        if (!hasTarget)
            result.title = result.title + " (" + this.themePhrase + ")"
        result.image = indexedTheme.image
    },
    
    getMatchingGroups: function (queryString, groupName){
        var matchingGroups = [];
        if (queryString === ""){
            for (var j=0;j<this.groups.length;j++){
                var group = this.groups[j];
                if (groupName === "*" || (group.name.toLowerCase() === groupName.toLowerCase())){
                    matchingGroups.push(group);
                }
            }
        }else{
            var queryTerms = queryString.split(" ");
            for (var j=0;j<this.groups.length;j++){
                var group = this.groups[j];
                if (groupName == "*" || group.name.toLowerCase() == groupName.toLowerCase()){
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
                var queryTerm = queryTerms[i].toLowerCase();
                if (theme.displayname.toLowerCase().indexOf(queryTerm)==0)
                    theme.score += 3;
                if (this.longMatch(queryTerm, theme.termsToSearch))
                    theme.score += 2;
                else if (this.shortMatch(queryTerm, theme.termsToSearch))
                    theme.score += 1;
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
    
    shortMatch: function(queryTerm, themeTerms){
        if (queryTerm.length < 2) {
            return false
        } else {
            if (queryTerm.length < 4) {
                for (var i=0;i<themeTerms.length;i++){
                    if (themeTerms[i].indexOf(queryTerm)==0){
                        return true;
                    }
                }
            }
        }
        return false;
    },

    longMatch: function(queryTerm, themeTerms){
        if (queryTerm.length < 4) {
            return false
        } else {
            if (queryTerm.length > 3) {
                for (var i=0;i<themeTerms.length;i++){
                    if (themeTerms[i].indexOf(queryTerm) > -1){
                        return true;
                    }
                }
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