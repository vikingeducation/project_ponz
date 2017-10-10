var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ReferalSchema = mongoose.Schema({
  username: { type: String },
  created: { type: Date },
  referals: [{ type: Schema.Types.ObjectId, ref: "Referal" }]
});

function autoPopulateSubs(next) {
  this.populate({ path: "referals", model: "Referal" });
  next();
}

ReferalSchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);

var Referal = mongoose.model("Referal", ReferalSchema);

module.exports = Referal;
