module.exports = function(ConnectRoles, config) {

  var roles = new ConnectRoles({
    failureHandler: function (req, res, action) {
      res.status(403);
      res.render('403', {action: action});
    }
  });

  // admin user
  roles.use(function (req) {
    if (req.user.role === 'admin') {
      return true;
    }
  });

  // commander user
  function isCommander(req) {
    if (req.user.role === 'commander') {
      return true;
    }
  };
  roles.use('view all incidents', isCommander);
  roles.use('create an incident', isCommander);
  roles.use('view an incident', isCommander);
  roles.use('edit an incident', isCommander);


  // modifier user
  function isModifier(req) {
    if (req.user.role === 'modifier') {
      return true;
    }
  };
  roles.use('view all incidents', isModifier);
  roles.use('view an incident', isModifier);
  roles.use('edit an incident', isModifier);


  // basic user
  function isBasic(req) {
    if (req.user.role === 'basic') {
      return true;
    }
  };
  roles.use('view an incident', isBasic);
  

  //anonymous
  roles.use(function (req, action) {
    if (!req.isAuthenticated()) return action === 'access non user pages';
  });

  return roles;
}
