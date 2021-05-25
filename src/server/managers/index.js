module.exports = function (wagner) {

  wagner.factory('Shop', function () {
    var ForeverPosts;
    ForeverPosts = require('./shop');
    return new ForeverPosts(wagner);
  });
  wagner.factory('Users', function () {
    var ForeverPosts;
    ForeverPosts = require('./users');
    return new ForeverPosts(wagner);
  });
  wagner.factory('product', function () {
    var ForeverPosts;
    ForeverPosts = require('./product');
    return new ForeverPosts(wagner);
  });
  wagner.factory('Category', function () {
    var ForeverPosts;
    ForeverPosts = require('./category');
    return new ForeverPosts(wagner);
  });
};
