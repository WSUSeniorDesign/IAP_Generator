module.exports = function(ConnectRoles, config) {

  var roles = new ConnectRoles({
    failureHandler: function (req, res, action) {
      res.status(403);
      if (req.isAuthenticated()) {
        res.render('403', {action: action});        
      } else {
        req.flash("error", `You must be logged in and have permission to ${action}.`);
        res.redirect(`/login?redirectTo=${encodeURIComponent(req.originalUrl)}`);
      }
    }
  });

  // admin user
  roles.use(function (req) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return true;
    }
  });

  // commander user
  function isCommander(req) {
    if (req.isAuthenticated() && req.user.role === 'commander') {
      return true;
    }
  };
  roles.use('view all incidents', isCommander);
  roles.use('create an incident', isCommander);
  roles.use('view an incident', isCommander);
  roles.use('edit an incident', isCommander);
  roles.use('create an operational period', isCommander);
  roles.use('edit an operational period', isCommander);
  roles.use('update an operational period', isCommander);
  roles.use('delete an incident', isCommander);
  roles.use('delete an operational period', isCommander);


  // modifier user
  function isModifier(req) {
    if (req.isAuthenticated() && (req.user.role === 'modifier' || req.user.role === 'commander')) {
      return true;
    }
  };
  roles.use('view all incidents', isModifier);
  roles.use('view an incident', isModifier);
  roles.use('edit an incident', isModifier);


  // basic user
  function isBasic(req) {
    if (req.isAuthenticated() && (req.user.role === 'basic' || req.user.role === 'modifier' || req.user.role === 'commander')) {
      return true;
    }
  };
  
  roles.use('view an incident', isBasic);
  roles.use('view a form', isBasic);
  roles.use('create a form', isCommander);
  roles.use('edit a form', isCommander);
  roles.use('delete a form', isCommander);

  

  //anonymous
  roles.use(function (req, action) {
    // bypass access control in tests
    if (process.env.NODE_ENV === 'test') {
      return true;
    }

    if (!req.isAuthenticated()) return action === 'access non user pages';
  });

  return roles;
}
