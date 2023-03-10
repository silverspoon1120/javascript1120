const express = require("express");

const ProductModel = require("../../models/ProductModel");
const CategoryModel = require("../../models/CategoryModel");
const { ingestProduct } = require("../../database/sonic/ingest");

/** @param {express.Request} req * @param {express.Response} res */
module.exports = async (req, res) => {
  req.body.price = req.body.price.toFixed(2);

  try {
    if (req.body.discount_datetime_start)
      req.body.discount_datetime_start = new Date(
        req.body.discount_datetime_start
      );
    if (req.body.discount_datetime_end)
      req.body.discount_datetime_end = new Date(req.body.discount_datetime_end);

    const category = await CategoryModel.findByPk(req.body.category_id);

    if (!category)
      return res.status(400).json({ message: "category not found" });

    const product = await ProductModel.create(req.body);

    await ingestProduct(product.id, product.title);

    return res.json(product);
  } catch (error) {
    console.error(new Date().toUTCString(), "-", error);
    return res.status(500).json({ message: "internal error" });
  }
};
