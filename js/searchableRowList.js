/** 
 *  
 * @class Searches a RowList
 * @extends Septima.Search.SearchableData
 * @constructs Septima.Search.SearchableRowList
 * @param {Object} options SearchableRowList expects these properties:
 * @param options.data {object} RowList or a function that returns a RowList.
 * @param options.searchProperties {string[]} Array of property names in the data array to search in. If not added, all properties will be used
 * @param options.displaynameProperty {string} The name of the property in the data array that should be used as displayname
 * @param options.descriptionProperty {string} The name of the property in the data array that should be used as description
 * @param options.useAND {boolean} Use AND and not OR when multiple terms is added by the user. Default true
 */
Septima.Search.SearchableRowList = Septima.Class (Septima.Search.SearchableData, {

    initialize: function (options) {
        Septima.Search.SearchableData.prototype.constructor.apply(this, [options]);
    },
	
    getData: function(){
    	return Septima.Search.SearchableData.prototype.getData.apply(this).row;
    },

    CLASS_NAME: 'Septima.Search.SearchableRowList'

});