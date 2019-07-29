const getItemModel = require('../../models/dynamic_item');
const httpHelper = require('../../helpers/httpHelper');
const definitionsRepository = require('../../data/definitions');

const itemDefinitions = definitionsRepository.get();

module.exports = function(router){

	console.log('Registering API routes...');

	itemDefinitions.forEach(itemDefinition => {

		let item = itemDefinition.name;
		let ItemModel = getItemModel(itemDefinition);
		let route = '/' + item;

		// GET: get items
		router.get(route, function(req, res){
			// res.status(200).json(new ItemModel());
			ItemModel.apiQuery(req.query)
				//.where({'ListOwners.Email': req.user})
				.lean()
				.exec()
				.then(docs => res.status(200)
					.json(docs))
				.catch(err => res.status(500)
					.json({
						message: 'Error finding items',
						error: err
					}));
		});

		// GET: get items count
		router.get(`${route}/count`, function(req, res){
			ItemModel.apiQuery(req.query)
				//.where({'ListOwners.Email': req.user})
				//  uses collection metadata rather than scanning the entire collection
				// .estimatedDocumentCount()
				// https://github.com/Automattic/mongoose/issues/6745
				.countDocuments()
				.exec()
				.then(docs => res.status(200)
					.json(docs))
				.catch(err => res.status(500)
					.json({
						message: 'Error finding items',
						error: err
					}));
		});

		// GET: get first item
		router.get(`${route}/first`, function(req, res){
			// res.status(200).json(new ItemModel());
			ItemModel.apiQuery(req.query)
				//.where({'ListOwners.Email': req.user})
				.findOne()
				.lean()
				.exec()
				.then(docs => res.status(200)
					.json(docs))
				.catch(err => res.status(500)
					.json({
						message: 'Error finding item',
						error: err
					}));
		});

		// GET: get item by id
		router.get(`${route}/:id`, function(req, res){
			ItemModel.findById(req.params.id)
				//.where({'ListOwners.Email': req.user})
				.lean()
				.exec()
				.then(docs => res.status(200)
					.json(docs))
				.catch(err => res.status(500)
					.json({
						message: 'Error finding item',
						error: err
					}));
		});

		//PUT: update an item by id
		router.put(`${route}/:id`, function(req,res){
			// check that the item is valid for the schema
			let checkItemInstance = new ItemModel(req.body);
			ItemModel.findOneAndUpdate(httpHelper.getIdQueryConditions(req.params.id), req.body, {upsert:true, new:true}, function(err, item){
				if (err) {				
					return res.status(500).json(err);
				}
				res.status(201)
					.header('Location',httpHelper.getLocation(req, route, item._id))
					.json(item);
			});
		});

		//POST: create new item
		router.post(route, function(req,res){
			let itemInstance = new ItemModel(req.body);
			itemInstance.save(function (err, item) {
				if (err) {				
					return res.status(500).json(err);
				}
				res.status(201)
					.header('Location',httpHelper.getLocation(req, route, item._id))
					.json(item);
			});
		});

		//DELETE: delete an item by id
		router.delete(`${route}/:id`, function(req,res){
			let queryConditions = httpHelper.getIdQueryConditions(req.params.id);
			httpHelper.addUserAuthorizationCondition(queryConditions, req.user);
			ItemModel.deleteOne(queryConditions, function(err) {
				if (err) {				
					return res.status(500).json(err);
				}
				res.status(200).json(true);
			});
		});

		console.log(`Registered route for /api/${item}`);

		// register child routes
		itemDefinition.definition.forEach(childItemDefinition => {
			if(childItemDefinition.type == 'Array'){
				let childName = childItemDefinition.name;

				// GET: get child items
				router.get(`${route}/:id/${childName}`, function(req, res){
					ItemModel.findById(req.params.id)
						.select(childName)
						//.where({'ListOwners.Email': req.user})
						.lean()
						.exec()
						.then(docs => res.status(200)
							.json(docs[childName]))
						.catch(err => res.status(500)
							.json({
								message: 'Error finding item',
								error: err
							}));
				});
				
				// GET: get child item count
				router.get(`${route}/:id/${childName}/count`, function(req, res){
					ItemModel.findById(req.params.id)
						//.select(`${childName}._id`)
						.where({'ListOwners.Email': req.user})
						.lean()
						.exec()
						.then(docs => res.status(200)
							.json(docs[childName].length))
						.catch(err => res.status(500)
							.json({
								message: 'Error finding item',
								error: err
							}));
				});

				// GET: get child item by id
				router.get(`${route}/:id/${childName}/:childId`, function(req, res){
					ItemModel.findById(req.params.id)
						//.where({'ListOwners.Email': req.user})
						.exec()
						.then(docs => res.status(200)
							.json(docs[childName].id(req.params.childId)))
						.catch(err => res.status(500)
							.json({
								message: 'Error finding item',
								error: err
							}));
				});

				//POST: create new child item
				router.post(`${route}/:id/${childName}`, function(req,res){
					ItemModel.findById(req.params.id)
						//.where({'ListOwners.Email': req.user})
						.exec()
						.then(item => {
							item[childName].push(req.body);
							item.save(function (err, newItem) {
								if (err) {				
									return res.status(500).json(err);
								}
								res.status(201)
									.header('Location',httpHelper.getLocation(req, route, item._id))
									.json(newItem);
							});
						})
						.catch(err => res.status(500)
							.json({
								message: 'Error finding item',
								error: err
							}));
				});

				//DELETE: delete a child item by id
				router.delete(`${route}/:id/${childName}/:childId`, function(req,res){
					ItemModel.findById(req.params.id)
						//.where({'ListOwners.Email': req.user})
						.exec()
						.then(item => {
							item[childName].id(req.params.childId).remove();
							item.save(function (err, newItem) {
								if (err) {				
									return res.status(500).json(err);
								}
								res.status(200).json(true);
							});
						})
						.catch(err => res.status(500)
							.json({
								message: 'Error finding item',
								error: err
							}));
				});

				console.log(`Registered route for /api/${item}/:id/${childName}`);

				childItemDefinition.definition.forEach(grandchildItemDefinition => {
					if(grandchildItemDefinition.type == 'Array'){
						let grandchildName = grandchildItemDefinition.name;
						
						// GET: get grandchilds item by id
						router.get(`${route}/:id/${childName}/:childId/${grandchildName}`, function(req, res){
							ItemModel.findById(req.params.id)
								//.where({'ListOwners.Email': req.user})
								.exec()
								.then(docs => res.status(200)
									.json(docs[childName].id(req.params.childId)[grandchildName]))
								.catch(err => res.status(500)
									.json({
										message: 'Error finding item',
										error: err
									}));
						});

						// GET: get grandchild count by id
						router.get(`${route}/:id/${childName}/:childId/${grandchildName}/count`, function(req, res){
							ItemModel.findById(req.params.id)
								//.where({'ListOwners.Email': req.user})
								.exec()
								.then(docs => res.status(200)
									.json(docs[childName].id(req.params.childId)[grandchildName].length))
								.catch(err => res.status(500)
									.json({
										message: 'Error finding item',
										error: err
									}));
						});

						// GET: get grandchild item by id
						router.get(`${route}/:id/${childName}/:childId/${grandchildName}/:grandchildId`, function(req, res){
							ItemModel.findById(req.params.id)
								//.where({'ListOwners.Email': req.user})
								.exec()
								.then(docs => res.status(200)
									.json(docs[childName].id(req.params.childId)
										[grandchildName].id(req.params.grandchildId)))
								.catch(err => res.status(500)
									.json({
										message: 'Error finding item',
										error: err
									}));
						});

						//POST: create new grandchild item
						router.post(`${route}/:id/${childName}/:childId/${grandchildName}`, function(req,res){
							ItemModel.findById(req.params.id)
								//.where({'ListOwners.Email': req.user})
								.exec()
								.then(item => {
									item[childName].id(req.params.childId)
										[grandchildName].push(req.body);
									item.save(function (err, newItem) {
										if (err) {				
											return res.status(500).json(err);
										}
										res.status(201)
											.header('Location',httpHelper.getLocation(req, route, item._id))
											.json(newItem);
									});
								})
								.catch(err => res.status(500)
									.json({
										message: 'Error finding item',
										error: err
									}));
						});

						//DELETE: create new grandchild item
						router.delete(`${route}/:id/${childName}/:childId/${grandchildName}/:grandchildId`, function(req,res){
							ItemModel.findById(req.params.id)
								//.where({'ListOwners.Email': req.user})
								.exec()
								.then(item => {
									item[childName].id(req.params.childId)
										[grandchildName].id(req.params.grandchildId).remove();
									item.save(function (err, newItem) {
										if (err) {				
											return res.status(500).json(err);
										}
										res.status(201)
											.header('Location',httpHelper.getLocation(req, route, item._id))
											.json(newItem);
									});
								})
								.catch(err => res.status(500)
									.json({
										message: 'Error finding item',
										error: err
									}));
						});

						console.log(`Registered route for /api/${item}/:id/${childName}/:childId/${grandchildName}`);
					}
				});
			}
		});
	});

	console.log('Finished registering API routes');
};