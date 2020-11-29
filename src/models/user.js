import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (value) => {
          if (value === "") {
            return true;
          }
        },
        message: "{VALUE} is not valid"
      }
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          if (value === "") {
            return true;
          }
        },
        message: "{VALUE} is not valid"
      }
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          if (value === "") {
            return true;
          }
        },
        message: "{VALUE} is not valid"
      }
    },
    role: {
      type: String,
    },
  },
  { timestamps: true },
);

UserSchema.statics.findByLogin = async function (login) {
  let user = await this.findOne({
    username: login,
  });
  if (!user) {
    user = await this.findOne({ email: login });
  }
  return user;
};

UserSchema.pre('remove', function (next) {
  this.model('Message').deleteMany({ user: this._id }, next);
});

const SALT_WORK_FACTOR = 5;
UserSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// UserSchema.methods.comparePassword = function (candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

const User = mongoose.model('User', UserSchema);

User.prototype.generatePasswordHash = async function () {
  const saltRounds = 10;
  return await bcrypt.hash(this.password, saltRounds);
};

User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
export default User;
