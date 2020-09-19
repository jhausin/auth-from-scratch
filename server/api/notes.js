const { compareSync } = require("bcryptjs");
const express = require("express");
const Joi = require("joi");

const db = require("../db/connection");
const notes = db.get("notes");

const router = express.Router();

const schema = Joi.object().keys({
    title: Joi.string().max(15).required(),
    note: Joi.string().trim().required(),
});

router.get("/", (req, res) => {
    res.json([]);
});

router.post("/", (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error === undefined) {
        const note = {
            ...req.body,
            user_id: req.user._id,
        };
        notes.insert(note).then((note) => {
            res.json(note);
        });
    } else {
        res.status(422);
        const error = new Error("Error");
        next(error);
    }
});
module.exports = router;
