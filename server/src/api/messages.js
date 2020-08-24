const express = require('express');
const joi = require('joi');
const db = require('../dbConn');

const messages = db.get('messages');
const router = express.Router();

const schema = joi.object({
  name: joi.string().alphanum().min(1).max(100)
    .required(),
  message: joi.string().min(1)
    .max(500)
    .required(),
  latitude: joi.number().min(-90).max(90).required(),
  longitude: joi.number().min(-180).max(180).required()
});

router.get('/', (req, res) => {
  messages.find()
    .then((allMessages) => {
      res.send(allMessages);
    });
});

router.post('/', (req, res, next) => {
  const result = schema.validate(req.body);

  if (!result.error) {
    const {
      name, message, latitude, longitude
    } = req.body;

    const userMessage = {
      name,
      message,
      latitude,
      longitude,
      date: new Date()
    };
    messages.insert(userMessage)
      .then((insertedMessage) => {
        res.json(insertedMessage);
      });
  } else {
    next(result.error);
  }
});

module.exports = router;
