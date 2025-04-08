module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.send({ success: false, message: 'You must be logged in to access this route.' });
    }
    next(); // User is logged in
  };
  
  