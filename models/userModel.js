const mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		validate: {
			validator: val => {
				return validator.isEmail(val);
			},
			message: '{email} Not Valid!!',
		},
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		minlength: 8,
	},
	role: {
		type: String,
		enum: ['admin', 'user'],
		required: true,
	},
	tickets: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Ticket',
		},
	],
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
	credits: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'CreditCard',
		},
	],
	image: {

	},
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  // console.log(salt)
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.post("save", (document, next) => {
  console.log("created");
  next();
});



module.exports = mongoose.model('User', userSchema);
