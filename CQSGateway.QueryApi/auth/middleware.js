let jwt = require('jsonwebtoken');

const PUBLIC_KEY = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA626fOP02WLC4NKR9j+R+
6r02BjaiOoRFSzoiJvoPm8QH8HZCe+g7WZaqhIvc/QamoA8B/8NIIYdkHLUCUoCm
drH6SgkoC1bxMpJxWEoSdMHbXKE2Hwxg5p6B6AisaCCTAX0HvyBWyq8i79WAqRPL
nWmAa9WHowRXekjsWFDmBMoP/SkAhTWroGgu1HzR7miRRqu2bcXseuFN1vnwf0ri
bJLIgLE4Lg3GJucpMCiLe8G9k4BBB7o8FI2YgTRTuL2UiNMVlsU+jvrnBCNdz45b
JrqJts8hzHcRn8zSd3001/4Fj/GbWCVrWQ+XKbB+nINTGFwD0oGZGEOVHWu6yrB5
sQIDAQAB
-----END PUBLIC KEY-----
`.trim();

const authenticationMiddleware = function (req, res, next) {
	
	try{
		var decoded = jwt.verify(req.token, PUBLIC_KEY, 
			{ 
				algorithm: 'RS256',
				audience: 'https://dforge-idsrv-intus.azurewebsites.net/idsrv/resources',
				issuer: 'https://dforge-idsrv-intus.azurewebsites.net/idsrv'
			});
		if(decoded.client_id != 'enterpriselistapi'){
			throw 'Invalid client_id';
		}

		let user = req.headers['currentuser'];
		if(!user){
			throw 'No user details provided';
		}
		req.user = user;

		next();
	}
	catch(e){
		console.log(e);
		const err = new Error('Unauthorized request');
		err.status = 401;
		res.json(err);
	}
};

module.exports = authenticationMiddleware;