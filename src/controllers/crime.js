const { validationResult } = require("express-validator");
const Crime = require("../models/crime");
const Place = require("../models/place");
const Relative = require("../models/relative");
const User = require("../models/user");
const sendResponse = require("../utils/sendResponse");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/sendMail");
const keyValueDb = require("../models/keyValueDb");
const { SECRET_TOKEN_PREFIX } = require("../config/constant");
const { Expo } = require("expo-server-sdk");

const registerCrime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(errors.array(), res, 400);
  }
  let userId;
  const authHeader = req.get("Authorization");
  try {
    /**
     * user is not authenticated but need help
     * need to get one token to report spam
     */
    if (!authHeader) {
      const { secretToken } = req.body;
      if (!secretToken) {
        return sendResponse("Don't try to make fake alerts", res, 401);
      }
      const user = await keyValueDb.findOne({
        key: `${SECRET_TOKEN_PREFIX}${secretToken}`,
      });
      if (!user) {
        return sendResponse("Don't try to make fake alerts", res, 401);
      }
      userId = user.value._id;

      /**
       * user is authenticated and need help
       */
    } else {
      const token = authHeader.split(" ")[1];
      if (!token) {
        return sendResponse("Don't try to make fake alerts", res, 401);
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedToken) {
        return res.status(401).json({
          message: "Don't try to make fake alerts",
        });
      }
      userId = decodedToken.user.id;
    }

    if (!userId) {
      return sendResponse("Unable to send crime report", res);
    }

    const { location, city, state, address } = req.body;
    const place = new Place({
      location,
      city,
      state,
      address,
    });
    await place.save();

    const crime = new Crime({
      userId,
      placeId: place.id,
    });

    await crime.save();

    /**
     * @Todo
     * Send notification to relative, bluetooth near by
     * Send crime to police
     * send message, mail, call to relative
     */

    const relatives = await Relative.find({ userId });
    await Promise.all(
      relatives.map(async (rel) => {
        await sendMail(rel.email, `Mail sent`);
        if (rel.pushToken && Expo.isExpoPushToken(rel.pushToken)) {
          const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
          await expo.sendPushNotificationsAsync([
            {
              to: rel.pushToken,
              sound: "default",
              body: "Alert has been received",
              data: {
                username: "User's name who sent the alert",
              },
            },
          ]);
        }
        return rel;
      })
    );
    sendResponse(
      {
        message: "Crime reported successfully",
        crime,
        place,
      },
      res,
      200,
      false
    );
  } catch (error) {
    sendResponse(error.message, res);
  }
};

module.exports = {
  registerCrime,
};
