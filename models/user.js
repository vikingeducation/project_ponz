const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const User = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			// NOT USED
			type: String,
			required: true
		},
		passwordHash: String,
		parent: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		ponverts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		points: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true
	}
);

User.virtual('password').set(function(password) {});
