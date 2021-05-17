const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const async = require('async');
const multer = require('multer');
const HTTPStatus = require('http-status');

const { check, validationResult } = require('express-validator');

module.exports = function (app, wagner) {

  let authMiddleware = wagner.get('auth');
  const storage = multer.diskStorage({
    limits: { fileSize: 10000 },
    destination: function (req, file, cb) {
      cb(null, 'src/public/uploads');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname)
    }
  })
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      cb(null, Date.now() + file.originalname)
    }
  });
  // role : any
  // function :  signup
  app.post('/v1/auth/:user/signup', upload.single('image'), [check('firstName').exists(), check('lastName').exists()], async function (req, res) {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let lasterr = errors.array().pop();
        lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_", " ");
        return res.status(405).json({ success: '0', message: "failure", data: lasterr });
      } else {
        req.userObj = {

          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          password:md5(req.body.password),
          image_path: req.file.path,
        }
        let user = await wagner.get('Users')["insert"](req)

        req.user_id = user.id

        let authtoken = await wagner.get('auth')["generateAccessToken"](req, res);
        // console.log(user)
        req.tokenObj = {
          authToken: authtoken,
          deviceToken: req.body.device_token,
          // appType : req.params.user == "user"? "customer" : "vendor"
        }
        /*   let token = await wagner.get('Tokens')["insert"](req,res);
          req.userObj = {
                filter : {
                    _id : user._id
                },
                update : {
                  $push:{  tokens : token._id }
                }
          } */
        //await wagner.get('Users')["update"](req)
        res.status(HTTPStatus.OK).json({
          success: '1', message: "success", data: {
            authtoken,
            profile: {
              firstname: user.firstName,
              lastname: user.lastName,
            }
          }
        });
      }
    }
    catch (e) {
      console.log(e)
      res.status(500).json({ success: '0', message: "failure", data: e });
    }

  });

  // role : any
  // function :  signin
  app.post('/v1/auth/:user/signin', [
    check('password').exists(), check('email').exists()], async function (req, res) {

      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          let lasterr = errors.array().pop();
          lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_", " ");
          console.log('lasterr', lasterr)
          return res.status(405).json({ success: '0', message: "failure", data: lasterr });
        } else {

          req.userObj = {
            email: req.body.email,
            password: md5(req.body.password)
          }
          let vendorlist = []
          let user = await wagner.get('Users')["find"](req);
          console.log("req.userObj", req.userObj)
          if (user) {
            req.user_id = user._id

            let authtoken = await wagner.get('auth')["generateAccessToken"](req, res);
            // console.log(authtoken)
            req.tokenObj = {
              authToken: authtoken,
              deviceToken: req.body.device_token,
              // appType : req.params.user == "user"? "customer" : "vendor"
            }
            //let token = await wagner.get('Tokens')["insert"](req, res);
            /* req.userObj = {
              filter: {
                _id: user._id
              },
              update: {
                is_active: true,
                $push: { tokens: token._id }
              }
            } */
            //await wagner.get('Users')["update"](req)
            //vendorlist = await wagner.get('VendorUsers')["findAll"](req);

            // Activate vendor profile on login
            /*
            if(req.params.user == 'vendor' ){
              vendorlist = await wagner.get('VendorUsers')["findAll"](req);
              req.vendorList = [];
              if(vendorlist){
                vendorlist.map((e)=>{
                  req.vendorList.push(e.vendor._id)
                })
              }
              await wagner.get('Vendors')["activateVendor"](req);
            }
            */

            res.status(HTTPStatus.OK).json({
              success: '1', message: "success", data: {
                authtoken, profile:user
              }
            });
          } else {
            res.status(401).json({ success: '0', message: "failure", data: { "message": "Invalid username and password!" } });
          }

        }
      }
      catch (e) {
        console.log(e)
        res.status(500).json({ success: '0', message: "failure", data: e });
      }

    });

  // role : customer
  // function :  socialSignIn
  app.post('/v1/auth/user/socialSignIn', [check('firstname').exists(),
  check('lastname').exists(), check('device_token').exists()], async function (req, res) {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let lasterr = errors.array().pop();
        lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_", " ");
        return res.status(405).json({ success: '0', message: "failure", data: lasterr });
      } else {
        if (!req.body.google_id && !req.body.fb_id) {
          return res.status(401).json({ success: '0', message: "failure", data: { "message": "Social id not provided!" } });
        }

        req.userObj = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          google_id: req.body.google_id ? req.body.google_id : null,
          fb_id: req.body.fb_id ? req.body.fb_id : null,
          social_type: req.body.social_type ? req.body.social_type : null,
          email: req.body.email ? req.body.email : null
        }

        let vendorlist = [];
        let user = await wagner.get('Users')["upsert"](req);
        // console.log("user",user);
        req.user_id = user._id

        let authtoken = await wagner.get('auth')["generateAccessToken"](req, res);
        req.tokenObj = {
          authToken: authtoken,
          deviceToken: req.body.device_token
        }

        let token = await wagner.get('Tokens')["insert"](req, res);
        req.userObj = {
          filter: {
            _id: user._id
          },
          update: {
            is_active: true,
            $push: { tokens: token._id }
          }
        }
        // console.log("token",token);
        // console.log("req.userObj",req.userObj);

        await wagner.get('Users')["update"](req);
        res.status(HTTPStatus.OK).json({
          success: '1', message: "success", data: {
            authtoken, vendorlist, profile: {
              id: user._id,
              email: user.email,
              firstname: user.firstname,
              lastname: user.lastname,
              phone_no: user.phone_no
            }
          }
        });
      }
    } catch (e) {
      res.status(500).json({ success: '0', message: "failure", data: e });
    }

  });

  // role : any
  // function :  signout
  /*  app.post('/v1/auth/:user/signout',[ check('device_token').exists()],authMiddleware['verifyAccessToken'].bind(authMiddleware),async function(req, res) {
 
     try{
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         let lasterr = errors.array().pop();
         lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
         return res.status(405).json({ success: '0', message: "failure", data: lasterr });
       }else{
         let token = await wagner.get('Tokens')["remove"](req,res);
         // console.log(token)
         if(token.deletedCount > 0){
           return res.status(200).json({ success: '1', message: "success", data:{} });
         }else{
           return res.status(403).json({ success: '0', message: "failure", data:{"message":'Invalid device token!'} });
         }
       }
     }
     catch(e){
 
       res.status(500).json({ success: '0', message: "failure", data: e });
     }
 
   }); */

  // role : any
  // function :  sends reset link to email
  app.post('/v1/auth/:user/forgetPassword', [check('email').exists().isEmail()], async function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let lasterr = errors.array().pop();
        lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_", " ");
        return res.status(405).json({ success: '0', message: "failure", data: lasterr });
      } else {
        req.userObj = { email: { $regex: `^${req.body.email}$`, $options: 'i' } };
        let user = await wagner.get('Users')["find"](req);
        if (user) {
          req.user_id = user._id

          let authtoken = await wagner.get('auth')["generateShortAccessToken"](req, res);
          req.tokenObj = {
            authToken: authtoken
          }

          let forgetPassword = await wagner.get('Users').forgetPassword(req);
          if (forgetPassword) {
            res.status(HTTPStatus.OK).json({ success: '1', message: "Reset link sent on your mail.", data: '' });
          } else {
            res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "Something went wrong.", data: '' });
          }
        } else {
          res.status(401).json({ success: '0', message: "failure", data: { "message": "No user found.!" } });
        }
      }
    } catch (e) {
      res.status(500).json({ success: '0', message: "failure", data: e });
    }
  });

  // role : any
  // function :  updates profile 
  app.post('/v1/auth/:user/updateProfile', authMiddleware['verifyActivationToken'].bind(authMiddleware), [check('email').exists().isEmail(), check('firstname').exists(), check('lastname').exists(), check('phone_no').exists()], async function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let lasterr = errors.array().pop();
        lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_", " ");
        return res.status(405).json({ success: '0', message: "failure", data: lasterr });
      } else {

        // console.log("req.user_id",req.user_id);
        req.userObj = {
          filter: {
            _id: req.user_id
          },
          update: {
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone_no: req.body.phone_no,
            is_push_notification_on: true
          }
        }
        let userUpdate = await wagner.get('Users').updateProfile(req);
        // console.log(userUpdate);
        if (userUpdate) {
          res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: userUpdate });
        } else {
          res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure.", data: '' });
        }
      }
    } catch (e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        return res.status(401).send({ success: '0', data: { "message": 'Email or Mobile number already exist!' } });
      }
      res.status(500).json({ success: '0', message: "failure", data: e });
    }
  });

  // role : any
  // function :  sets new password
  app.post('/v1/account/reset-password', [
    check('new_password').exists().not().isEmpty().withMessage('new password is required'),
    check('confirm_password', 'confirm password field must have the same value as the new password field')
      .exists()
      .custom((value, { req }) => value === req.body.new_password)
  ], async function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        let lasterr = errors.array().pop();
        lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_", " ");
        return res.status(405).json({ success: '0', message: "failure", data: lasterr });
      }
      else {
        req.headers.authtoken = req.body.token
        let isVerified = await wagner.get('auth')["verifyActivationToken"](req, res)
        // console.log(isVerified)
        if (isVerified.success == 1) {
          req.user_id = isVerified.user_id

          req.userObj = {
            filter: {
              '_id': req.user_id
            },
            update: {
              'password': md5(req.body.new_password)
            }
          }
          let userRecord = await wagner.get('Users').updateProfile(req);
          if (userRecord) {
            res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: {} });
          } else {
            res.status(405).json({ success: '0', message: "failure", data: "User not found!" });
          }


        } else {
          res.status(405).json({ success: '0', message: "failure", data: isVerified.message });
        }
      }

    } catch (error) {
      console.log('err', error);
      res.status(500).json({ success: '0', message: "failure", data: [error.message.toString()] });
    }
  });

  // role : any
  // function : changes password
  app.post('/v1/auth/:user/changePassword', authMiddleware['verifyActivationToken'].bind(authMiddleware), [check('new_password').exists().not().isEmpty().withMessage('new password is required'), check('old_password').exists().not().isEmpty().withMessage('old password is required')], async function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let lasterr = errors.array().pop();
        lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_", " ");
        return res.status(405).json({ success: '0', message: "failure", data: lasterr });
      } else {
        req.userObj = {
          '_id': req.user_id
        };
        let user = await wagner.get('Users')["find"](req);
        if (user) {
          if (md5(req.body.old_password) === user.password) {
            req.userObj = {
              filter: {
                '_id': req.user_id
              },
              update: {
                'password': md5(req.body.new_password)
              }
            }
            let userRecord = await wagner.get('Users').updateProfile(req);
            if (userRecord) {
              res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: {} });
            }
          } else {
            res.status(405).json({ success: '0', message: "failure", data: { "message": "Incorrect old password!" } });
          }
        } else {
          res.status(401).json({ success: '0', message: "failure", data: { "message": "No user found.!" } });
        }
      }
    } catch (error) {
      console.log('err', error);
      res.status(500).json({ success: '0', message: "failure", data: [error.message.toString()] });
    }
  });
  app.post('/v1/auth/:user/verify_token', async function (req, res) {
    console.log("dfd")
    const verify = await wagner.get('auth')["verifyActivationToken"](req, res)
    res.status(200).json(verify)
  });
};
