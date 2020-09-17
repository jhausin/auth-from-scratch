const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../db/connection");
const users = db.get("users");

users.createIndex("username", { unique: true });

const router = express.Router();

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string().trim().min(8).required(),
});
function createTokenSendResponse(user, res, next) {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1d",
    },
    (err, token) => {
      if (err) {
        respondError406(res, next);
      } else {
        res.json({ token });
      }
    }
  );
}
router.get("/", (req, res) => {
  res.json({
    message: "Auth",
  });
});

router.post("/signup", (req, res, next) => {
  console.log("request body:", req.body);
  const result = schema.validate(req.body);
  if (result.error === undefined) {
    users
      .findOne({
        username: req.body.username,
      })
      .then((user) => {
        //if user = undefined , username not in db, otherwise it is a duplicate
        if (user) {
          //there is already a user with this name ,create err
          const err = new Error(
            "Username already exists. Please choose another one"
          );
          res.status(409);
          next(err);
        } else {
          //hash password, insert user with hashed pw
          bcrypt.hash(req.body.password.trim(), 12).then((hashedPassword) => {
            const newUser = {
              username: req.body.username,
              password: hashedPassword,
            };

            users.insert(newUser).then((insertedUser) => {
              createTokenSendResponse(insertedUser, res, next);
            });
          });
        }
      });
  } else {
    next(result.error);
  }
});

router.post("/login", (req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error === undefined) {
    users
      .findOne({
        username: req.body.username,
      })
      .then((user) => {
        if (user) {
          //found user in database
          bcrypt.compare(req.body.password, user.password).then((result) => {
            if (result) {
              createTokenSendResponse(user, res, next);
            } else {
              respondError406(res, next);
            }
          });
        } else {
          respondError406(res, next);
        }
      });
  } else {
    respondError406(res, next);
  }
});

function respondError406(res, next) {
  res.status(406);
  next(new Error("Unable to login."));
}

module.exports = router;
