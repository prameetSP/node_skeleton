let jwt = require('jsonwebtoken');
const config = require('config');
const token_config = config.get('JWT');
const HTTPStatus = require('http-status');

module.exports = class AuthMiddleware {

  constructor(wagner) {
    this.userToken = wagner.get('tokens')
    //this.VendorUsers = wagner.get('VendorUsers')
    // this.role      = wagner.get('MasterRole')
  };

  generateAccessToken(req, res) {
    return new Promise(async (resolve, reject) => {
      jwt.sign({ "id": req.user_id }, token_config.SECRET, { expiresIn: token_config.TOKENTIME },
        function (err, token) {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            resolve(token);
          }
        });
    })
  }

  generateShortAccessToken(req, res) {

    return new Promise(async (resolve, reject) => {
      jwt.sign({ "id": req.user_id }, token_config.SECRET, { expiresIn: 600 },
        function (err, token) {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            resolve(token);
          }
        });
    })
  }

  verifyActivationToken(req, res) {
    return new Promise((resolve, reject) => {
      // console.log(token_config.SECRET)
      jwt.verify(req.headers.authorization, token_config.SECRET, function (err, decoded) {
        // console.log("dffd",decoded )
        if (err) {
          console.log(err)
          if (err.name == 'TokenExpiredError') {
            resolve({ success: 0, message: "Token expired!" });
          } else {
            resolve({ success: 0, message: "Invalid token!" });
          }
        } else {
          // console.log(decoded)
          resolve({ success: 1, user_id: decoded.id });
        }
      });
    })
  }

  verifyAccessToken(req, res, next) {

    jwt.verify(req.headers.authtoken, token_config.SECRET, (err, decoded) => {
      if (err) {
        if (err.name == 'TokenExpiredError') {
          res.status(406).json({ success: '0', message: "failure", data: { "message": "Token expired!" } });
        } else {
          res.status(403).json({ success: '0', message: "failure", data: { "message": "Invalid token!" } });
        }
      } else {
        this.userToken.findOne({ where: {token:req.headers.authtoken} }).then(function (result) {
          if (result) {
            req.user_id = decoded.id;
            // console.log(decoded)
            next();
          } else {
            res.status(403).json({ success: '0', message: "failure", data: { "message": "Invalid token!" } });
          }
        }).catch(function (error) {
          console.log("error", error);
          res.status(500).json({ success: '0', message: "failure", data: error });
        });
      }

    });
  }

  /*verifyVendorAdminAccess(req,res,next){
    if(req.body.vendorId){
      req.body.vendor_id = req.body.vendorId
    }
    if(req.params.vendor_id){
      req.body.vendor_id = req.params.vendor_id
    }
    this.VendorUsers["find"](req).then(function(result) {
      
      if(result){
        next();
      }else{
        res.status(403).json({ success: '0',  message: "failure" ,data:{ "message": "Access denied!"}});
      }
    }).catch((error)=>{
      console.log(error);
      res.status(500).json({ success: '0', message: "failure", data: error });
    })
  }

  async verifyVendorUserAccess(req,res,next){
    try{ 
      
    
      if(req.body.vendor_id){
        req.body.vendorId = req.body.vendor_id
      }
      if(req.params.vendor_id){
        req.body.vendor_id = req.params.vendor_id
        req.body.vendorId  = req.params.vendor_id
      } 

      let vendorAdmin = await this.VendorUsers["find"](req)
      let vendorStaff = await this.VendorUsers["findStaff"](req)
      console.log(vendorAdmin ,vendorStaff)
      if(vendorAdmin || vendorStaff ){
        next();
      }else{
        res.status(403).json({ success: '0',  message: "failure" ,data:{ "message": "Access denied!"}});
      }

    }catch(error){
        console.log(error);
        res.status(500).json({ success: '0', message: "failure", data: error });
    }
  }

  verifyAccessTokenUI (req,res,next){

    jwt.verify(req.headers.authtoken,token_config.SECRET, (err, decoded)=> {
      if(err){
        if(err.name == 'TokenExpiredError'){
          res.render('login', {  });
        }else{
          res.render('login', {  });
        }
      }else{
        this.userToken["find"](req).then(function(result) {
          if(result){
            // console.log(decoded,result.role)
            if(decoded.role == "restaurant"){
              req.user_id = decoded.id;
              // console.log(decoded)
              next();
            }else{
              res.render('login', {  });
            }
          } else {
            res.render('login', {  });
          }
        }).catch(function(error){
          console.log(error);
          res.render('login', {  });
        });
      }
    });
  }

  verifyAccessTokenAdminUI (req,res,next){

    jwt.verify(req.headers.authtoken,token_config.SECRET, (err, decoded)=> {
      if(err){
        if(err.name == 'TokenExpiredError'){
          res.render('admin/login', {  });
        }else{
          res.render('admin/login', {  });
        }
      }else{
        this.userToken["find"](req).then(function(result) {
          if(result){
            if(decoded.role == "admin"){
              req.user_id = decoded.id;
              // console.log(decoded)
              next();
            }else{
              res.render('admin/login', {  });
            }
          }else{
            res.render('admin/login', {  });
          }
        }).catch(function(error){
          console.log(error);
          res.render('admin/login', {  });
        });
      }
    });
  }

  verifyRefreshToken(req, res, next){
    this.userToken["find"](req).then(function(result) {
      if(result){
        req.user_id = result.dataValues.user_id;
        next();
      }else{
        res.status(403).json({ success: '0', message: "Invalid token!"});
      }
    }).catch(function(error){
      console.log(error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  }

  refreshToken(req,res,next){
    this.userToken["update"](req).then(function(result) {
      if(result[0]==1){
        next()
      }else{
        res.status(403).json({ success: '0', message: "Invalid token!"});
      }
    }).catch(function(error){
      console.log(error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  }

  verifyAdminLoggedIn(req, res, next){
    // next()
    if (req.session.user && req.session.user.is_superadmin)
        return next();
    // // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/secret');
  }
 */
}
