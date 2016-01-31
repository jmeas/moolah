const express = require('express');

const errors = require('../errors');
const dbConnect = require('../db-connect');

const router = express.Router();

// Retrieve a list of every `test` resource
router.get('/', (req, res) => {
  dbConnect(res, (client, done) => {
    client.query('SELECT * FROM test_table', (err, result) => {
      if (err) {
        console.error(err);
        res.send(500, {
          errors: [errors.generateGenericError()]
        });
      } else {
        res.send({
          data: result.rows
        });
      }
    });
  });
});

// Return a single `test` resource
router.get('/:id', (req, res) => {
  dbConnect(res, (client, done) => {
    client.query(`SELECT * FROM test_table WHERE id = ${req.params.id}`, (err, result) => {
      if (err) {
        console.error(err);
        res.send(500, {
          errors: [errors.generateGenericError()]
        });
      } else {
        if (!result.rows.length) {
          res.status(404).send({
            errors: [errors.generateNotFoundError()]
          });
        } else {
          res.send({
            data: result.rows[0]
          });
        }
      }
    });
  });
});

module.exports = router;