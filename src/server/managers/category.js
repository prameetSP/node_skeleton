const { asysnc, reject } = require('async');
const { resolve } = require('bluebird');
const Promise = require('bluebird');
const config = require('config');
const request = require('express');
const _ = require('underscore');
const { search } = require('../../app');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = class category {
    constructor(wanger) {
        this.category = wanger.get("category");
    };
    insert(req) {
        return new Promise(async (resolve, reject) => {
            try {
                let cat_data = await this.category.create(req.cateObj);
                resolve(cat_data);
            } catch (error) {
                console.log(error)
                reject(error);
            }
        });
    }
    find(req) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!req.query.hasOwnProperty("page")) {
                    req.query.page = 1;
                }
                let page = req.query.page;
                let limit = 25;
                let offset = ((page - 1) * limit);
                let conds = {}
                if (req.query.search) {
                    let search = req.query.search.trim();
                    conds = {
                        offset: offset, limit: limit,
                        where: {
                            category_name: { [Op.like]: '%' + search + '%' }

                        }
                    }
                } else {
                    conds = { offset: offset, limit: limit }
                }
                let category_data = await this.category.findAll(conds)
                resolve(category_data);
            } catch (error) {
                reject(error);

            }
        })
    }
}