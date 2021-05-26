const { async } = require('async');
const Promise = require('bluebird');
const config = require('config');
const { request } = require('express');
//const { where } = require('sequelize/types');
const { include } = require('underscore');
const _ = require('underscore');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = class product {
    constructor(wagner) {
        this.category = wagner.get("category");
        this.product = wagner.get("products");
    };
    insert(req) {
        return new Promise(async (resolve, reject) => {
            try {
                let product_data = await this.product.create(req.productObj);
                resolve(product_data);
            } catch (error) {
                reject(error);
            }
        });
    };
    update(req) {
        return new Promise(async (resolve, reject) => {
            try {
                let product_data = this.product.update(req.upateObj, { where: { id: req.product_id } })
                resolve(product_data);
            } catch (error) {
                reject(error)
            }
        })
    }
    delete(req) {
        return new Promise(async (resolve, reject) => {
            try {
                let product_data = await this.product.destroy({ where: { id: req.id } })
                resolve(product_data);
            } catch (error) {
                reject(error);

            }
        })
    }
    productList(req) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!req.query.hasOwnProperty("page")) {
                    req.query.page = 1;
                }
                let page = req.query.page;
                let limit = 25;
                let offset = ((page - 1) * limit);
                let conds = {};
                let filtering = {}
                if (req.query.hasOwnProperty('search')) {
                    let search = req.query.search.trim();
                    if (search.length) {
                        conds = {
                            where:
                            {
                                $or: [
                                    { product_name: { [Op.like]: '%' + search + '%' } },
                                    { category_name: { [Op.like]: '%' + search + '%' } }
                                ],
                            }
                        }

                    }
                }

                if (req.query.hasOwnProperty('filter')) {
                    conds = { where: { category_id: request.query.category_id } }
                }
                if (req.query.hasOwnProperty('search') && req.query.hasOwnProperty('filter')) {
                    conds = {
                        offset: offset, limit: limit,
                        where:
                            [{
                                $or: [
                                    { product_name: { [Op.like]: '%' + search + '%' } },
                                    { category_name: { [Op.like]: '%' + search + '%' } }
                                ],
                            },
                            {
                                $and: {
                                    category_id: request.query.category_id
                                }
                            }]
                    }
                }
                else {
                    conds = { offset: offset, limit: limit }
                }
                let product_data = await this.product.findAll(conds)
                let count = await this.product.count(conds)
                resolve({
                    list: product_data, meta: {
                        total_pages: Math.ceil(count / limit),
                        total_count: count, per_page: limit,
                        current_page: page, current_cnt: product_data.length
                    }
                });
            } catch (error) {
                reject(error);
            }
        })
    }
}