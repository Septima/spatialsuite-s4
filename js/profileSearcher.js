Septima.Search.ProfileSearcher = Septima.Class (Septima.Search.DataSearcher, {

    initialize: function (options) {
    	this.iconUri =       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QoeDQsr35IuhAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACcklEQVQ4y72TW0hUURSG/7XPmePMONmMSoONWWojXgiRKCiKKBSxh+hiYEWG+FBELwW9VPRURBe6PARWEL6UKGYEISRRIF0oJPIlyGLQmaGR0XGqOXM/56wexktjDRRBP2zY7PXzrcW/2EAO6RMN83f17e89gVeX8EcyvMcBANrE1l3RcLJocT04fNUVfHe7AgB8jzqzagQAzAwiyiqkfSdXiti1cdYF9FShNxq0D4X9ckPiq7pWi8ZAJjOszuotqzuGhn2DZ7Bi+7kF4CxU8fYebIrPfG7R4mqzfdmUK9+RsLBBYADEAAMAE5jBUx6JUjEp7ahv31m24/Lg/ISenra2qPfNHUNP2VhLZh4F4KrTIaRcoTDUkIQZrwCZ8mBxujuqOp93f7jZkJnQ++T0tm/vex7qKbUAzFCsgNOtYVEKWUBDJ/hGTRASGCRItjtb646NPhCegSMoaz7/zF7V5FKKKi8AEmyFBhMxcuMIkomh5DOYQWzorIUn+z/dbTwrKnZ3ZZagJ9Xao69PFdQ07i0oSRFzzvFAANgA8h1Ghg8QhKzrqZRFnjNVtHYDAMrWj7ildATxaQvik2aQ4J93lyWzjZmISeQ5Qrb6ljXlzTcCWU79y2GZEvfHyIiUQwBaTCA+aUVaNTEJpgUwg0EwNIFp//Iu9/5bJ+TijXH/yJXs1py4h+T3sZVK8sU61j/WgqXNhFB1IkBL40HFDBgmEBhgIgEsWaWCi/dsUkp6X84x5KxszAcAYGL2LDTikBJ+fKg64hsf0COBSmtJ6dPSDWJQkv01nBw141/k6W9v+eXfjzv/HsR9fbh+cRbauw//TT8AOm8B4o8N4HsAAAAASUVORK5CYII=";
    	this.folderIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QoeDQ4kMlrHUAAAAeBJREFUOMulkr1rk1EUh59zb94akhCTNlq1WD8ItKIgUqibLg7aSaGLg4KrTi34L4hbi4NKV4eiGdTBpdZBR0FdFGzRovWrNEIrNEmb5r0/h37YRZG3z3DPufceHs69HAMYGhq66py7KSkHYGYtSZUQwrXR0dHF1S/XD7j6yCfFjrjZPlubL0wsfE2dWF5c6mvV6liUJtPZe7p8ZeKFDQ8PPwCOmdkR1vHesz9Xax7a8bm6y34U9nR+T+c76l7BEGACAciQUHXGW7PuV4vHL59PAYNmZgDlYp2T/ileDdRaaWOFLnOQzccoOABsffkTZdl2sbIUooW3408cW/iwkOF5uEDLsmAOMKK0raX/IFMISAZxU1tLayGEizNzy7tf2UA5FHpugSfXHmSmv8qE4SPRlhUSltq8kF5L6oiiaHqqaoWpaj/QD7/WXvc/7POzbBU+9N5fAgokQAp0R7M4gBDCnKSXknpISK6tTimfGk8BAbjnnDsH7Ewq3Fuq0jfYfTcFfJT02Mzub4xPEnoP/5zMMh85SY+cc6fMrCupTNK72+OdZ/3B988cMA0MkJwA3KlUKjGAA/JmdnQbwvk4jic3Ns7MzgDFxO2F8KbRaMxsCoHSNv7um3PuxtjY2OrG2W+2SMSSOz+4/QAAAABJRU5ErkJggg==";
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
            	var profileRowList = data.row[0];
            	for (var i=0;i<profileRowList.row.length;i++){
            		if (profileRowList.row[i].hidden == 'false'){
            			this.profileRowList.row.push(profileRowList.row[i]);
            		}
            	}
          }, this)
          });
    },
    

    CLASS_NAME: 'Septima.Search.ProfileSearcher'
    
});
