function getIdQueryConditions(id){
	return { _id: id };
}

function addUserAuthorizationCondition(queryConditions, username){
	queryConditions['ListOwners.Email'] = username;
}

function getLocation(req, route, id){
	return `${req.protocol}://${req.hostname}${req.baseUrl}${route}/${id}`;
}

module.exports = {getIdQueryConditions, addUserAuthorizationCondition, getLocation};