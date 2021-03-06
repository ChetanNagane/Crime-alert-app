const { validationResult } = require("express-validator");
const Relative = require("../models/relative");
const User = require("../models/user");
const sendResponse = require("../utils/sendResponse");

const getRelatives = async (req, res) => {
  try {
    const relatives = await Relative.find({ userId: req.user.id });

    res.status(200).json({ relatives });
  } catch (err) {
    return sendResponse(err.message, res);
  }
};

const addRelative = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(errors.array(), res, 400);
  }

  try {
    const isRelativeExists = await Relative.findOne({
      mobileNumber: req.body.mobileNumber,
    });
    if (isRelativeExists) {
      return sendResponse(
        "Relative already exists with that mobile number",
        req,
        400
      );
    }

    const newRelative = new Relative(req.body);
    const user = await User.findOne({
      $or: [
        { mobileNumber: newRelative.mobileNumber },
        { email: newRelative.email },
      ],
    });
    if (user) {
      newRelative.pushToken = user.pushToken;
    }
    await newRelative.save();

    res.json({
      newRelative: {
        ...newRelative._doc,
        pushToken: null,
      },
    });
  } catch (err) {
    return sendResponse(err.message, res);
  }
};

const updateRelative = async (req, res) => {
  try {
    const relative = await Relative.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!relative) {
      return sendResponse("Unable to update relative", res, 404);
    }

    const { firstname, lastname, email, mobileNumber } = req.body;
    if (firstname) relative.firstname = firstname;
    if (lastname) relative.lastname = lastname;
    if (email) relative.email = email;
    if (mobileNumber) relative.mobileNumber = mobileNumber;

    await relative.save();

    res.json({ relative });
  } catch (err) {
    return sendResponse(err.message, res);
  }
};

const deleteRelative = async (req, res) => {
  try {
    const relative = await Relative.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!relative) {
      return sendResponse("Unable to delete relative", res, 404);
    }

    await relative.delete();
    sendResponse("Relative deleted", res, 200);
  } catch (err) {
    return sendResponse(err.message, res);
  }
};

const getRelative = async (req, res) => {
  try {
    const relative = await Relative.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!relative) {
      return sendResponse("No relative found", res, 404);
    }

    res.json({ relative });
  } catch (err) {
    return sendResponse(err.message, res);
  }
};

const deleteAllRelative = async (req, res) => {
  try {
    const relative = await Relative.deleteMany({ userId: req.user.id });

    if (!relative) {
      return sendResponse("Unable to delete relatives", res, 404);
    }
    sendResponse("All Relatives deleted", res, 200);
  } catch (err) {
    return sendResponse(err.message, res);
  }
};

module.exports = {
  getRelatives,
  addRelative,
  updateRelative,
  deleteRelative,
  getRelative,
  deleteAllRelative,
};
