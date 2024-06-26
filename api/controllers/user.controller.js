const User = require("../models/user.model.js");
const createError = require("../utils/createError.js");

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can update only your account!"));
    }

    for (const key in req.body) {
      if (Object.hasOwnProperty.call(req.body, key)) {
        // Check if the property exists in the User schema before updating
        if (User.schema.paths.hasOwnProperty(key)) {
          user[key] = req.body[key];
        }
      }
    }

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUser,
  updateUser,
};
