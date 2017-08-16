const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true
		},
		passwordHash: String,
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		ponverts: [
			{
				type: mongoose.Schema.Types.ObjectId,
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

UserSchema.virtual('password')
	.set(function(password) {
		this.passwordHash = bcrypt.hashSync(password, 12);
	})
	.get(function() {
		return this.passwordHash;
	});
UserSchema.virtual('usernameHash').get(function() {
	return bcrypt.hashSync(this.username, 12);
});

UserSchema.statics.findRootUsers = function() {
	return this.find({
		parent: {
			$exists: false
		}
	});
};

UserSchema.statics.findByReffererCode = async function(code) {
	const users = this.findAll({ nameHash: code });
	// return users.find(user => user.nameHash === code);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
