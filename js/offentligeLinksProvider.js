Septima.Search.offentligeLinksProvider = Septima.Class (Septima.Search.ComposedDetailsHandler, {
    
    initialize: function (options) {
        Septima.Search.ComposedDetailsHandler.prototype.constructor.apply(this, [{more: true, buttonText: "Offentlige links"}]);
        this.addDetailsHandler(new Septima.Search.BbrLinkHandler())
        this.addDetailsHandler(new Septima.Search.SvurLinkHandler())
        this.addDetailsHandler(new Septima.Search.JordForureningsattestLinkHandler())
    }
    
});