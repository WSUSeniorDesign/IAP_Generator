  'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const wrap = require('co-express');
const User = mongoose.model('User');

/**
 * Load
 */

exports.load = wrap(function* (req, res, next, _id) {
  const criteria = { _id };
  try {
    req.profile = yield User.load({ criteria });
  } catch (err) {
    return next(new Error('User not found'));
  }
  if (!req.profile) return next(new Error('User not found'));
  next();
});

/**
 * Create user
 */

exports.create = wrap(function* (req, res) {
  const user = new User(req.body.user);
  user.provider = 'local';

  try {
    yield user.save();
  } catch (err) {
    if (err.name === "ValidationError") {
      for (var field in err.errors) {
        req.flash("error", err.errors[field].message);
      }
      return res.render('users/signup', {
        title: 'Sign up',
        user: user
      });
    } else {
      return next(new Error(err));
    }
  }

  req.logIn(user, err => {
    if (err) req.flash('info', 'Sorry! We are not able to log you in!');
    return res.redirect('/');
  });
});

/**
 *  Edit profile
 */

exports.edit = function (req, res) {
  const user = req.profile;
  res.render('users/edit', {
    title: user.name,
    user: user
  });
};

exports.update = wrap(function* (req, res) {
  const user = req.profile;

  if (req.body.user.hasOwnProperty("password") && req.body.user.password.length === 0) {
    delete req.body.user.password;
  }
  
  Object.assign(user, req.body.user);

  try {
    yield user.save();
  } catch (err) {
    if (err.name === "ValidationError") {
      for (var field in err.errors) {
        req.flash("error", err.errors[field].message);
      }
      return res.render('users/edit', {
        title: user.name,
        user: user
      });
    } else {
      return next(new Error(err));
    }
  }

  res.redirect(`/users/${user.id}`);
});

/**
 *  Show profile
 */

exports.show = function (req, res) {
  const user = req.profile;
  res.render('users/show', {
    title: user.name,
    user: user
  });
};

exports.signin = function () {};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  const redirectTo = req.session.returnTo
    ? req.session.returnTo
    : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
}