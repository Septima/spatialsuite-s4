S4MapHandler = {
    activatePointDrawer: function (mode) {
        this.mode = "search";
        if (mode)
            this.mode = mode;
        this.getDrawToolBox().activateControl("drawFeaturePoint");
    },

    getDrawToolBox: function(){
        if (typeof this.dtb === 'undefined') {
            this.dtb = new MiniMap.Gui.Draw.DrawToolBox({
                id: "s4MapHandler",
                domId: "s4DTB",
                minimap: spm,
                controlNameList: ["drawFeaturePoint"],
                createdHandler: function(feature){
                    var drawLayer = this.dtb.getDrawLayer();
                    var wkt = feature.wkt;
                    drawLayer.deleteFeature(feature.id)
                    this.doAction(feature.wkt, this.mode);
                }.bind( this )
            });
        }
        return this.dtb;
    },

    doAction: function(wkt, mode) {
        s4_getResult("Geometries", "Geometry", wkt).then(function(result) {
            if (mode == "search") {
                s4_showResult(result);
            } else {
                var host = _s4Params.s3searcher.host;
                var organisation = _s4Params.s3searcher.organisation;
                var configuration = _s4Params.s3searcher.configuration;
                var source = result.source;
                var typeId = result.typeId;
                var id = result.id;
                window.open(host + "/#/" + organisation +"/" + configuration+ "/" + source + "/" + typeId + "/" +id);
            }
        })
    }
}