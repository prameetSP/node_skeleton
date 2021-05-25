const fs = require('fs');
const path = require('path');
const async = require('async');
const HTTPStatus = require('http-status');
const multer = require('multer');
const { check, validationResult } = require('express-validator');


module.exports = function (app, wagner) {
    let authMiddleware = wagner.get('auth');
    const storage = multer.diskStorage({
        limits: {
            fileSize: 10000
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
    });
    app.post('/v1/product/add', upload.single('image'), authMiddleware['verifyAccessToken'].bind(authMiddleware), [check('product_name').exists(), check('category_id').exists()], async function (req, res) {
        try {
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                let lasterr = erros.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_", " ")
                return res.status(405).json({ success: '0', message: "failure", data: lasterr })
            } else {
                req.productObj = {
                    product_Name: req.body.product_Name,
                    category_id: req.body.category_id,
                    image_path: req.file.path

                }
                let produc_data = await wagner.get('products')["insert"](req)
                res.status(HTTPStatus.OK).json({
                    success: '1', message: "success", data: produc_data
                })
            }
        }
        catch (e) {
            res.status(500).json({ success: '0', message: "failed", "data": e })
        }
    })

}