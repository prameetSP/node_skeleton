module.exports = function(app, wagner) {
    require('./v1/shop')(app, wagner);
  	require('./ui/index')(app, wagner);
  	require('./v1/auth')(app, wagner);
};
