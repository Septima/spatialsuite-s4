S4MapHandler = {
    activatePointDrawer: function (options) {
        this.mode = "search";
        this.source = "Geometries";
        this.type = "Geometry";
        if (options) {
            if (options.mode)
            this.mode = options.mode;

            if (options.source)
                this.source = options.source;

            if (options.type)
                this.type = options.type;
        }

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
        s4_getResult(this.source, this.type, wkt).then(function(result) {
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