const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');

function getItemSchema(definition){
	let schema = new mongoose.Schema();
	definition.forEach(property => {
		let properyName = property.name.toString();
		if(property.type != 'Array'){
			schema.add({
				[properyName]:{
					type: property.type,
					default: property.default
				}
			});
		}
		else{
			schema.add({
				[properyName]:[getItemSchema(property.definition)]
			});
		}
	});
	return schema;
}

function createItemSchema(itemDefinition){
	let schema = getItemSchema(itemDefinition.definition);
	schema.plugin(mongooseStringQuery);
	return schema;
}

function getItemModel(itemDefinition){
	if(!itemDefinition.model){
		itemDefinition.schema = createItemSchema(itemDefinition);
		itemDefinition.model = mongoose.model(itemDefinition.name, itemDefinition.schema, itemDefinition.name);
	}
	return itemDefinition.model;
}

module.exports = getItemModel;