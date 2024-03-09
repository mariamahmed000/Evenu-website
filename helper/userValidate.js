var validator = require('validator');
const ajv = new Ajv();
//#region
//order schema
let userSchema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		email: { type: 'email' },
		password: { type: 'integer', minimum: 1 },
		role: { type: 'integer', minimum: 1 },
		tickets: { type: 'integer', minimum: 1 },
		reviews: { type: 'integer', minimum: 1 },
		credits: { type: 'integer', minimum: 1 },
	
	},
	required: ['id', 'name', 'price'],
	additionalProperties: false,
};
//#endregion
module.exports = ajv.compile(userSchema);
