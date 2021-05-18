const Promise = require('bluebird');
const config = require('config');
//const mailconf  = config.get("email");
const _ = require('underscore');

module.exports = class Users {

  constructor(wagner) {
    this.Token = wagner.get("tokens");
    this.User = wagner.get("user");

  };

  upsert(req) {
    return new Promise(async (resolve, reject) => {
      try {

        let user;
        let updateCond;
        if (req.userObj.email) {
          updateCond = { email: req.userObj.email };
        } else if (req.userObj.google_id) {
          updateCond = { google_id: req.userObj.google_id };
        } else {
          updateCond = { fb_id: req.userObj.fb_id };
        }

        let existing = await this.User.findOne(updateCond);
        if (existing) {
          if ((req.userObj.firstname == "" || req.userObj.firstname == null) && existing.firstname != "") {
            req.userObj.firstname = existing.firstname;
          }
          if ((req.userObj.lastname == "" || req.userObj.lastname == null) && existing.lastname != "") {
            req.userObj.lastname = existing.lastname;
          }
          if ((req.userObj.email == "" || req.userObj.email == null) && existing.email != "") {
            req.userObj.email = existing.email;
          }
        }
        if (!req.userObj.email) { delete req.userObj.email; }
        if (!req.userObj.google_id) { delete req.userObj.google_id; }
        if (!req.userObj.fb_id) { delete req.userObj.fb_id; }
        if (!req.userObj.phone_no) { delete req.userObj.phone_no; }

        user = await this.User.updateOne(updateCond, req.userObj, { upsert: true, setDefaultsOnInsert: true, useFindAndModify: true });
        user = await this.User.findOne(updateCond).populate('vendorProfile');
        resolve(user);

      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  insert(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await this.User.create(req.userObj);
        resolve(user);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };
  insertToken(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await this.Token.create(req.tokenObj);
        resolve(user);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  update(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await this.User.findOneAndUpdate(req.userObj.filter, req.userObj.update);
        resolve(user)
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  };

  find(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await this.User.findOne({ where: req.userObj })
        resolve(user)
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  };

  findall(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await this.User.find().populate('tokens').populate('vendorProfile');
        resolve(user)
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  }

  getUserDeviceTokens(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await this.User.findOne(req.userObj).populate({ path: 'tokens', select: ['deviceToken'] }).select('tokens')
        resolve(user)
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  }

  userList(req) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!req.query.hasOwnProperty("page")) {
          req.query.page = 1;
        }
        let page = req.query.page;
        let limit = 25;
        let skip = ((page - 1) * limit);
        let conds = {};

        if (req.query.hasOwnProperty("q")) {
          let search = req.query.q.trim();
          if (search.length) {
            conds = {
              $or: [
                { firstname: search }, { lastname: search },
                { phone_no: search }, { email: search }
              ]
            }
          }
        }

        let users = await this.User.find(conds).skip(skip).limit(limit);
        let count = await this.User.count(conds);
        resolve({
          list: users, meta: {
            total_pages: Math.ceil(count / limit),
            total_count: count, per_page: limit,
            current_page: page, current_cnt: users.length
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  };

  forgetPassword(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const mailOptions = {
          from: mailconf.MAIL_FROM,
          to: req.body.email.toLowerCase(),
          subject: 'Reset Password Link.',
          html: `<b>HI</b><br> <p>Greetings for the day.</p><br> <p>Please click Reset Password to reset your password.</p>  <p><a href="${config.get('app_route')}/account/set-password/${req.tokenObj.authToken}"<button>Reset Password</button></a></p> <br>Regards.<br> <p>Team ${config.get('site_name')}.</p>`
        };
        const sendMailfunc = await this.Mail.sendMail(mailOptions);
        resolve(sendMailfunc);

      } catch (e) {
        console.log(e);
        reject(e);
      }
    })
  };

  updateProfile(req) {
    return new Promise(async (resolve, reject) => {
      try {

        const updateUser = await this.User.updateOne(req.userObj.filter, req.userObj.update);
        if (updateUser) {
          let user = await this.User.findOne(req.userObj.filter, { email: 1, firstname: 1, lastname: 1, phone_no: 1, is_push_notification_on: 1 });
          resolve(user);
        } else {
          resolve(null)
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    })
  };

  deactivateUser(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const updateUser = await this.User.updateOne(req.userObj, { is_active: false });
        resolve(updateUser);
      } catch (error) {
        reject(error);
      }
    })
  };

  activateUser(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const updateUser = await this.User.updateOne(req.userObj, { is_active: true });
        resolve(updateUser);
      } catch (error) {
        reject(error);
      }
    })
  };

  saveCard(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let card = await this.Card.findOneAndUpdate({ card_number: req.cardObj.card_number, user: req.user_id }, req.cardObj, { upsert: true })
        resolve(card)
      } catch (error) {
        reject(error);
      }
    })
  }

  getCardInfo(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let card = await this.Card.find({ user: req.user_id })
        resolve(card)
      } catch (error) {
        reject(error);
      }
    })
  }

};
