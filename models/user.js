const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const utf8 = require('utf8');
const POINT_VALUE = 1;

let points = [40, 20, 10, 5, 2, 1];

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
			ref: 'User',
			alias: 'Referrer'
		},
		ponverts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				alias: 'Ponverts'
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

// Wrapper for find method so that we can gather children
// recursively.
UserSchema.statics.findRecursive = async function(options) {
	const user = await this.findOne(options);
	await user.gatherPonverts();
	return user;
};

UserSchema.statics.findRootUsers = function() {
	return this.find({
		parent: {
			$exists: false
		}
	});
};

//
UserSchema.statics.getReferrer = async function(referrerCode) {
	return this.findOne({
		username: base64.decode(utf8.decode(referrerCode))
	});
};

// UserSchema.methods.getParents = async function(includeRoot) {
// 	// START FUNCTION
// 	let parents = [];
// 	if (includeRoot) {
// 		parents.push(this);
// 	}
// 	await _grabParent(this);
// 	return parents;
// 	// END FUNCTION
//
// 	async function _grabParent(user) {
// 		if (!user.parent) return;
// 		let parent = await User.findById(user.parent);
// 		parents.push(parent);
// 		await _grabParent(parent);
// 	}
// };
//
// UserSchema.methods.getParents = async function(includeRoot) {
// 	let parents = await _grabParent(this);
// 	if (includeRoot) {
// 		parents.push(this);
// 	}
// 	return parents;
// };
//
// async function _grabParent(user) {
// 	if (!user.parent) return [];
// 	const parent = await User.findById(user.parent);
// 	return [parent].concat(await _grabParent(parent));
// }

UserSchema.methods.getParents = async function(includeRoot) {
	let parents = [];
	await _grabParent.call(parents, this);
	if (includeRoot) {
		parents.push(this);
	}
	return parents;
};

async function _grabParent(user) {
	if (!user.parent) return;
	const parent = await User.findById(user.parent);
	this.push(parent);
	await _grabParent.call(this, parent);
}

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compareSync(password, this.passwordHash);
};

//On user insertion add new user to parent and then distribute points
let counter = 0;
UserSchema.methods.addPonvert = async function(child) {
	counter = 0;
	this.ponverts.push(child);
};

UserSchema.methods.addPoints = async function(counter) {
	if (counter === undefined) counter = 0;
	if (counter < points.length) {
		this.points += points[counter];
	} else {
		this.points++;
	}
	await this.save();
	if (this.parent) {
		let parent = await User.findById(this.parent);
		await parent.addPoints(++counter);
	}
};

//findRecursive
UserSchema.methods.gatherPonverts = async function() {
	this.ponverts = await User.find({ _id: this.ponverts });
	for (let i = 0; i < this.ponverts.length; i++) {
		await this.ponverts[i].gatherPonverts();
	}
};

UserSchema.virtual('password')
	.set(function(password) {
		this.passwordHash = bcrypt.hashSync(password, 12);
	})
	.get(function() {
		return this.passwordHash;
	});
UserSchema.virtual('cash').get(function() {
	return Number(this.points * POINT_VALUE).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD'
	});
});

//encode username
UserSchema.virtual('usernameEncoded').get(function() {
	return base64.encode(utf8.encode(this.username));
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
