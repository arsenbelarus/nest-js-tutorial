const express = require('express');
const app = express();

app.get(
  '/user',
  function (req, res, next) {
    // logger middleware
    console.log(req.url);
    next();
  },
  function (req, res, next) {
    // guard middleware
    req.user = req.query.name;
    req.user ? next() : next(new Error('forbidden'));
  },
  function (req, res) {
    // request handler
    res.send('Hi ' + req.user);
  },
  function (err, req, res, next) {
    // error handler
    res.json({ status: 500, err });
  },
);

app.get('/users/:userId/books/:bookId', function (req, res) {
  console.log(res.json({ params: req.params }));
});

exports.expressApp = app;

export {app as expressApp}
