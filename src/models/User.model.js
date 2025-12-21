const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
    },
    password: {
      type: String,
      validate: {
        validator: function (value) {
          // Skip validation for Google users (dummy password)
          if (!value) return true;

          return (
            value.length >= 8 &&
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /[0-9]/.test(value) &&
            /[^A-Za-z0-9]/.test(value)
          );
        },
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      },
    },

    role: {
      type: String,
      default: "user",
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s-]{10,}$/, "Please"],
    },
    addresses: [
      {
        street: String,
        city: String,
        zipCode: String,
        country: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
    },

    emailVerificationExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
