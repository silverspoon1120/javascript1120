const express = require('express');
const { Op } = require('sequelize');

const findCategoriesChildrenIds = require('../../util/findCategoriesChildrenIds');

const ProductModel = require('../../models/ProductModel');
const CategoryModel = require('../../models/CategoryModel');

//const ilike = (process.env.NODE_ENV == 'test') ? Op.like : Op.iLike;

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

/** @param {express.Request} req * @param {express.Response} res */
module.exports = async (req, res) => {

    const limit = req.query.limit;
    const offset = req.query.offset;

    let order = [
        ['quantity_stock', 'DESC'],
        ['discount_percent', 'DESC'],
        ['quantity_sold', 'DESC'],
    ];

    let where = null;

    if(req.query.section == 'on-sale'){

        where = {
            discount_percent: {
                [Op.gt]: 0
            }
        };

    } else if(req.query.section == 'best-sellers'){

        order.move(2, 0);

        where = {
            quantity_sold: {
                [Op.gt]: 0
            }
        }

    } else if(req.query.section == 'news'){

        order.splice(0, 0, ['createdAt', 'DESC']);

        let date = new Date();
        date.setMonth(date.getMonth() - 1);

        where = {
            createdAt: { [Op.gte]: date }
        }
    }

    if(req.query.filter == 'lowest-price') order.splice(0, 0, ['price', 'ASC']);
    else if(req.query.filter == 'biggest-price') order.splice(0, 0, ['price', 'DESC']);

    try {

        let products = [];
        let count = 0;

        if(req.query.title){

            const title = req.query.title.split(' ').map( (word) => `%${word}%`);

            count = await ProductModel.count({
                col: 'id',
                where: {
                    title: { 
                        [Op.iLike]: {
                            [Op.any]: title
                        }
                    }
                }
            });

            products = await ProductModel.findAll({
                attributes: { 
                    exclude: ['createdAt', 'updatedAt', 'deletedAt', 'category_id'] 
                },
                where: {
                    title: { 
                        [Op.iLike]: {
                            [Op.any]: title
                        }
                    }
                },
                limit,
                offset,
                order,
                include: [
                    {
                        association: 'images',
                        attributes: ['id', 'url', 'filename'],
                        required: false,
                    },                    
                    {
                        association: 'category',
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    }
                ]
            });

        } else if(req.query.category){

            let categories = await CategoryModel.findAll();

            categories = categories.map( (category) => ({
                id: category.id,
                parent_id: category.parent_id
            }));

            const categoriesIds = findCategoriesChildrenIds(req.query.category, categories);
            
            count = await ProductModel.count({
                col: 'id',
                include: [                  
                    {
                        association: 'category',
                        where: { 
                            id: categoriesIds
                        },
                   }
                ]
            });
            
            products = await ProductModel.findAll({
                attributes: { 
                    exclude: ['createdAt', 'updatedAt', 'deletedAt', 'category_id'] 
                },
                limit,
                offset,
                order,
                include: [
                    {
                        association: 'images',
                        attributes: ['id', 'url', 'filename'],
                        required: false
                    },                    
                    {
                        association: 'category',
                        attributes: { 
                            exclude: ['createdAt', 'updatedAt'] 
                        },
                        where: { 
                            id: categoriesIds
                        },
                   }
                ]
            });

        } else {

            if(req.query.filter == 'id') order.splice(0, 0, ['id', 'DESC']);

            count = await ProductModel.count({
                col: 'id',
                where
            });
            
            products = await ProductModel.findAll({
                attributes: { 
                    exclude: ['updatedAt', 'deletedAt', 'category_id'] 
                },
                where,
                limit,
                offset,
                order,
                include: [
                    {
                        association: 'images',
                        attributes: ['id', 'url', 'filename'],
                        required: false
                    },                    
                    {
                        association: 'category',
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    }
                ]
            });
        }
        
        return res.json({ count, products: products });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'internal error' });
    }
}
