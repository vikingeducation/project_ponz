const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const autoPopulateChildren = function(next) {
	this.populate("children");
	next();
};

// more id's per service
const UserSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	fname: { type: String, required: true },
	lname: { type: String, required: true },
	shortid: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
	parent: { type: Schema.Types.ObjectId, ref: "User", default: null },
	children: [{ type: Schema.Types.ObjectId, ref: "User" }],
	points: { type: Number, default: 0 }
});

UserSchema.pre("save", async function(next) {
	const user = this;
	const hash = await bcrypt.hashSync(user.password, 12);
	user.password = hash;
	next();
});

UserSchema.pre("findOne", autoPopulateChildren).pre(
	"find",
	autoPopulateChildren
);

module.exports = mongoose.model("User", UserSchema);
