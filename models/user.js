const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema(
  {
    email: { type: String, required: false, unique: true },
    passwordHash: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'User' },
    children: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

/*
<script id="list" type="x-handlebars-template">
    {{#each items}} {{! Each item is an "li" }}
    <li>
        {{name}}
        {{#if items}} {{! Within the context of the current item }}
        <ul>
        {{> list}} {{! Recursively render the partial }}
        </ul>
        {{/if}}
    </li>
    {{/each}}
</script>

<script id="main" type="x-handlebars-template">
    <ul>
    {{> list}}
    </ul>
</script>

*/

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual('password')
  .get(function() {
    return this._password;
  })
  .set(function(value) {
    this._password = value;
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

const User = mongoose.model('User', UserSchema);

module.exports = User;
