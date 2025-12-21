const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

/* ========================================================
   GET PROFILE
======================================================== */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* ========================================================
   UPDATE PROFILE (name, phone)
======================================================== */
exports.updateProfile = async (req, res) => {
  try {
    const allowed = ["name", "phone"];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowed.includes(key)) updates[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* ========================================================
   CHANGE PASSWORD
======================================================== */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch)
      return res.status(400).json({ error: "Old password incorrect" });

    user.password = newPassword; // hashed via pre-save hook
    await user.save();

    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* ========================================================
   ADD ADDRESS
======================================================== */
exports.addAddress = async (req, res) => {
  try {
    const { street, city, zipCode, country, isDefault } = req.body;

    const user = await User.findById(req.user.id);

    // remove existing default
    if (isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses.push({ street, city, zipCode, country, isDefault });
    await user.save();

    res
      .status(201)
      .json({ message: "Address added", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* ========================================================
   UPDATE ADDRESS
======================================================== */
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    const address = user.addresses.id(addressId);

    if (!address) return res.status(404).json({ error: "Address not found" });

    if (req.body.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    Object.assign(address, req.body);
    await user.save();

    res
      .status(200)
      .json({ message: "Address updated", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* ========================================================
   DELETE ADDRESS
======================================================== */
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );

    await user.save();

    res
      .status(200)
      .json({ message: "Address deleted", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* ========================================================
   DELETE ACCOUNT
======================================================== */
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
