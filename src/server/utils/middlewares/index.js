module.exports = function(wagner) {
    
    // wagner.factory('firebase', function() {
    //   var firebase = require('./firebaseMiddleware.js');
    //   return new firebase(wagner) ;
    // });

    wagner.factory('auth', function() {
      var auth = require('./AuthMiddleware.js');
      return new auth(wagner) ;
    });

    // wagner.factory('mail', function() {
    //   var mail  = require('./mailMiddleware.js');
    //   return new mail(wagner) ;
    // });
};
  