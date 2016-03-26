module.exports = function(ConnectRoles, config) {

  var roles = new ConnectRoles({
    failureHandler: function (req, res, action) {
      res.status(403);
      res.render('403', {action: action});
    }
  });

  //anonymous users can only access the home page
  //returning false stops any more rules from being
  //considered
  roles.use(function (req, action) {
    if (!req.isAuthenticated()) return action === 'access home page';
  })

  roles.use('create an incident', function (req) {
    if (req.user.role === 'commander') {
      return true;
    }
  })

  //admin users can access all pages
  roles.use(function (req) {
    if (req.user.role === 'admin') {
      return true;
    }
  });

  return roles;
}
