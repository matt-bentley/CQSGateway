const itemDefinitions = [
	{
		name: 'clients',
		isOData: true,
		definition: [
			{
				name: 'name',
				type: 'String',
				default: ''
			},
			{
				name: 'sector',
				type: 'String',
				default: ''
			},
			{
				name: 'createdDate',
				type: 'Date',
				default: Date.now
			},
			{
				name: 'entities',
				type: 'Array',
				definition: [
					{
						name: 'name',
						type: 'String',
						default: ''
					},
					{
						name: 'dissolved',
						type: 'Boolean',
						default: false
					}
				]
			},
		]
	},
	{
		name: 'users',
		isOData: true,
		definition: [
			{
				name: 'firstName',
				type: 'String',
				default: ''
			},
			{
				name: 'secondName',
				type: 'String',
				default: ''
			},
			{
				name: 'age',
				type: 'number',
				default: 1
			},
			{
				name: 'favouriteFood',
				type: 'String',
				default: ''
			},
			{
				name: 'email',
				type: 'String',
				default: ''
			},
		]
	}
];

function get() {
	return itemDefinitions;
}

function getByItem(item) {
	for (let i = 0; i < itemDefinitions.length; i++) {
		if (itemDefinitions[i].name == item) {
			return itemDefinitions[i];
		}
	}
}

module.exports = { get, getByItem };