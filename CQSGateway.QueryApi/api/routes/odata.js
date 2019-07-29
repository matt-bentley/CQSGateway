const getItemModel = require('../../models/dynamic_item');
const Resource = require('odata-resource');
const definitionsRepository = require('../../data/definitions');

const itemDefinitions = definitionsRepository.get();

module.exports = function(app){

	console.log('Registering OData routes...');

	itemDefinitions.forEach(itemDefinition => {

		let item = itemDefinition.name;

		if(itemDefinition.isOData){
			let ItemModel = getItemModel(itemDefinition);

			// define the REST resource
			var itemResource = new Resource({
				rel: '/odata/'+item,
				model: ItemModel,
				count: true
			});

			// extend the initQuery to add authorization
			(function() {
				var oldInit = itemResource.initQuery;
				itemResource.initQuery = extendedInit;
				function extendedInit(query, req) {
					let r = oldInit.apply(itemResource, [query, req]); // Use #apply in case `init` uses `this`
					r = r.where({'ListOwners.Email': req.user});
					return r;
				}
			})();

			// override the count function to countDocuments
			(function() {
				var oldCount = itemResource.count;
				itemResource.count = overridenCount;
				function overridenCount(req,res) {
					var self = itemResource,
						def = itemResource.getDefinition(),
						query = itemResource.initQuery(self.getModel().find(),req);
					query.countDocuments(function(err,n){
						if(err){
							Resource.sendError(res,500,'find failed',err);
						} else {
							res.json(n);
						}
					});
				}
			})();

			// setup the routes
			itemResource.initRouter(app);
		}
		
		console.log(`Registered route for /odata/${item}`);
	});

	console.log('Finished registering OData routes');
};