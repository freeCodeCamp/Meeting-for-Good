import passport from 'passport';
import _ from 'lodash';
import sendEmail from '../config/email';

const path = process.cwd();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(403).send('Authentiation required.');
};

export default (app) => {
  /*
  ....###....########..####..######.
  ...##.##...##.....##..##..##....##
  ..##...##..##.....##..##..##......
  .##.....##.########...##...######.
  .#########.##.........##........##
  .##.....##.##.........##..##....##
  .##.....##.##........####..######.
  */

  /* auth stuff */

  app.route('/api/auth/current')
    .get((req, res) => {
      if (req.user) return res.status(200).send(req.user);
      return res.status(500).send('User not found');
    });

  app.route('/api/auth/google')
    .get(passport.authenticate('google', {
      scope: ['profile'],
    }));

  app.route('/api/auth/google/callback')
    .get(passport.authenticate('google', {
      successRedirect: '/dashboard',
    }));

  app.route('/api/auth/facebook')
    .get(passport.authenticate('facebook'));

  app.route('/api/auth/facebook/callback')
    .get(passport.authenticate('facebook', {
      successRedirect: '/dashboard',
    }));

  app.route('/api/auth/logout')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });

  /* meeetings API*/
  app.use('/api/events', require('../../api/events'));

  /* users API */
  app.use('/api/user', require('../../api/user'));

  app.route('/api/sendEmail')
    .post(isAuthenticated, (req, res) => {
      sendEmail(req.body.message, (err, info) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(info);
      });
    });

  app.route('*')
    .get((req, res) => res.sendFile(`${path}/build/index.html`));
};
