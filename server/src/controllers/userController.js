const User = require('../models/User');

// @desc Update user profile
// @route PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.gender = req.body.gender || user.gender;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
      role: updatedUser.role,
      addresses: updatedUser.addresses
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc Add address
// @route POST /api/users/addresses
const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, phone, pincode, locality, address, city, state, addressType, isDefault } = req.body;

  if (isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  const newAddress = {
    name,
    phone,
    pincode,
    locality,
    address,
    city,
    state,
    addressType: addressType || 'Home',
    isDefault: isDefault || user.addresses.length === 0
  };

  user.addresses.push(newAddress);
  await user.save();

  res.status(201).json(user.addresses);
};

// @desc Update address
// @route PUT /api/users/addresses/:id
const updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const addressItem = user.addresses.id(req.params.id);
  if (!addressItem) return res.status(404).json({ message: 'Address not found' });

  if (req.body.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  addressItem.name = req.body.name || addressItem.name;
  addressItem.phone = req.body.phone || addressItem.phone;
  addressItem.pincode = req.body.pincode || addressItem.pincode;
  addressItem.locality = req.body.locality || addressItem.locality;
  addressItem.address = req.body.address || addressItem.address;
  addressItem.city = req.body.city || addressItem.city;
  addressItem.state = req.body.state || addressItem.state;
  addressItem.addressType = req.body.addressType || addressItem.addressType;
  if (req.body.isDefault !== undefined) addressItem.isDefault = req.body.isDefault;

  await user.save();
  res.json(user.addresses);
};

// @desc Delete address
// @route DELETE /api/users/addresses/:id
const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
  await user.save();
  res.json(user.addresses);
};

module.exports = { updateUserProfile, addAddress, updateAddress, deleteAddress };
