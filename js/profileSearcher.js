Septima.Search.ProfileSearcher = Septima.Class (Septima.Search.DataSearcher, {

    initialize: function (options) {
    	this.iconURI =       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QoeDQsr35IuhAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACcklEQVQ4y72TW0hUURSG/7XPmePMONmMSoONWWojXgiRKCiKKBSxh+hiYEWG+FBELwW9VPRURBe6PARWEL6UKGYEISRRIF0oJPIlyGLQmaGR0XGqOXM/56wexktjDRRBP2zY7PXzrcW/2EAO6RMN83f17e89gVeX8EcyvMcBANrE1l3RcLJocT04fNUVfHe7AgB8jzqzagQAzAwiyiqkfSdXiti1cdYF9FShNxq0D4X9ckPiq7pWi8ZAJjOszuotqzuGhn2DZ7Bi+7kF4CxU8fYebIrPfG7R4mqzfdmUK9+RsLBBYADEAAMAE5jBUx6JUjEp7ahv31m24/Lg/ISenra2qPfNHUNP2VhLZh4F4KrTIaRcoTDUkIQZrwCZ8mBxujuqOp93f7jZkJnQ++T0tm/vex7qKbUAzFCsgNOtYVEKWUBDJ/hGTRASGCRItjtb646NPhCegSMoaz7/zF7V5FKKKi8AEmyFBhMxcuMIkomh5DOYQWzorIUn+z/dbTwrKnZ3ZZagJ9Xao69PFdQ07i0oSRFzzvFAANgA8h1Ghg8QhKzrqZRFnjNVtHYDAMrWj7ildATxaQvik2aQ4J93lyWzjZmISeQ5Qrb6ljXlzTcCWU79y2GZEvfHyIiUQwBaTCA+aUVaNTEJpgUwg0EwNIFp//Iu9/5bJ+TijXH/yJXs1py4h+T3sZVK8sU61j/WgqXNhFB1IkBL40HFDBgmEBhgIgEsWaWCi/dsUkp6X84x5KxszAcAYGL2LDTikBJ+fKg64hsf0COBSmtJ6dPSDWJQkv01nBw141/k6W9v+eXfjzv/HsR9fbh+cRbauw//TT8AOm8B4o8N4HsAAAAASUVORK5CYII=";
    	this.profileRowList = {row: []};
		options.searchableData =  new Septima.Search.SearchableRowList({
    		data: Septima.bind(function(){return this.profileRowList;}, this),
    		singular: options.singular,
    		plural: options.plural,
    		searchProperties: ['name', 'displayname'],
    		displaynameProperty: 'displayname'
    	});
    	Septima.Search.DataSearcher.prototype.initialize.apply(this, [options]);
		this.profileOnUri = "data:image/gif;base64,R0lGODlhEQAOANUAAHSbbPb/9P78/v/5/2ujY/f89v70/5rElG6VaO3+7FuWVfn/+Pn5+fD/7X3Kdfz++3WmboO1fK/Kq+n+5YzHg4PJelSgS9bw0lJ2Tlx5W3u3coPReOb/4vT/8kx1SPX79fv7/PL78vj294zVgXK1a/L/8HnZbvf/94jOf4jYf5DNir/iup7bmGWVYG6vZWGoWO307KPInfj49ZPYiEmEQFOATVmFVFCSSj9+OM3tyP///fv/+v/9//7//f/+/////yH5BAAAAAAALAAAAAARAA4AAAbMwN/pJxDsFrsBz1cI7XaFxy+w+/U6gYXAMDg1DpJSwOrrHXc9n+H3jUBik99gAOr9eHNf4OCqUBASPwY8Oyc9RQJfBDMoBBgNRAsXORNPMAcaFSMKNQ1jPRcRESsNCRIuDiMWNBwddqEbGy8sKi4mKQoZQyA/Px0AGiMVJCQOGzc1CR+9dl4tfSgVDgoeCYYiOnY+JwktBNIWGWLLPtl3DAsTNgoKOE5SICA6Mj8gS14eGBy9Ij4+RT5+LFDD40SABD0Y/JinwwcPEUEAADs=";
    	this.currentProfile = cbKort.getProfile();

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
            	if (data.row[0]._class == 'rowlist'){
                	var profileRowList = data.row[0];
                	for (var i=0;i<profileRowList.row.length;i++){
                		if (profileRowList.row[i].hidden == 'false'){
                			this.profileRowList.row.push(profileRowList.row[i]);
                		}
                	}
            	}
          }, this)
          });
    },
    
    getCustomButtonDefs: function(result){
        if (typeof result.newquery !== 'undefined'){
            return [];
        }else{
        	if (result.data.name === this.currentProfile){
        		//return [{"buttonText": this.showPhrase, "buttonImage": this.profileOnUri}];
        		result.image = this.profileOnUri;
                return [];
        	}else{
                return [];
        	}
        }
    },

    CLASS_NAME: 'Septima.Search.ProfileSearcher'
    
});
