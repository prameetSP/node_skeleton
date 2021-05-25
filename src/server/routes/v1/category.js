const HTTPStatus = require('http-status');
const multer = require('multer');
const { check, validationResult } = require('express-validator');

module.exports = function (app, wagner) {
    let authMiddleware = wagner.get('auth');
    const storage = multer.diskStorage({
        limits: {
            fileSize: 1000
        },
        destination: function (req, file, cb) {
            cb(null, 'src/public/uploads');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + file.originalname)
        }
    })
    const upload = multer({
        storage, fileFilter: (req, file, cb) => {
            cb(null, Date.now() + file.originalname)
        }
    })
    app.post('/v1/category/add', authMiddleware['verifyAccessToken'].bind(authMiddleware), [check('category_name').exists()], async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_", " ")
                return res.status(405).json({ success: '0', message: 'failure', data: lasterr })
            }
            else {
                req.cateObj = {
                    category_name: req.body.category_name,
                }
                let cat_data = await wagner.get('Category')['insert'](req)
                res.status(HTTPStatus.OK).json({
                    success: '1', message: 'success', data: cat_data
                })
            }
        } catch (error) {
            console.log("error", error)
            res.status(500).json({ success: '0', message: 'failure', data: error })
        }
    })
    app.get('/v1/category', authMiddleware['verifyAccessToken'].bind(authMiddleware), async function (req, res) {
        try {
            category_data = await wagner.get('Category')['find'](req)
            res.status(200).json({ status: '1', message: 'success', data: category_data })
        } catch (error) {
            console.log('error', error)
            res.status(500).json({ status: '0', message: 'failure', data: error })
        }
    })
   
}