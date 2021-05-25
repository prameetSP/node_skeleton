module.exports = function(app, wagner) {
   	require('./v1/auth')(app, wagner);
	require('./v1/category')(app,wagner);
	require('./v1/product')(app,wagner);
	require('./v1/test')(app,wagner);
	require('./v1/shop')(app, wagner);
	require('./ui/index')(app, wagner);
  
  	
};
