import { Request, Response } from "express";
import { In, MoreThan } from "typeorm";

import ProductModel from "../../models/ProductModel";
import OrderProductModel from "../../models/OrderProductModel";
import sortIdsByFrequency from "../../utils/sortIdsByFrequency";

interface IProductWithBuyed
  extends Omit<
    ProductModel,
    | "calcIsOnSale"
    | "calcFinalPrice"
    | "hasId"
    | "save"
    | "remove"
    | "softRemove"
    | "recover"
    | "reload"
  > {
  productsBuyedWith: ProductModel[];
}

export default async function show(req: Request, res: Response) {
  const { id } = req.params;
  const buyedWith = Number(req.query.buyedWith);

  try {
    const product = await ProductModel.findOne(id, {
      relations: ["category", "images"],
    });

    if (!product) return res.status(404).json({ message: "product not found" });

    const productWithBuyed: IProductWithBuyed = {
      ...product,
      productsBuyedWith: [],
    };

    if (buyedWith) {
      // get ordersProducts who buyed this product
      const ordersProducts = await OrderProductModel.find({
        where: {
          product_id: product.id,
        },
      });

      // get order ids that have buyed this product
      const orderIds = ordersProducts.map(
        (orderProduct) => orderProduct.order_id
      );

      // get ordersProducts who buyed this product but with other products
      const ordersProductsByOrderId = await OrderProductModel.find({
        where: {
          order_id: In(orderIds),
        },
      });

      // get products ids
      const productsIds = ordersProductsByOrderId.map(
        (orderProductByOrderId) => orderProductByOrderId.product_id
      );

      // remove this product id
      const buyedWithProductsIds = productsIds.filter(
        (productsId) => productsId != product.id
      );

      // sort by frequency
      const sortedIds = sortIdsByFrequency(buyedWithProductsIds);

      // get products thas was most buyed with this product
      const productsBuyedWith = await ProductModel.find({
        where: {
          id: In(sortedIds.splice(0, buyedWith * 2)),
          quantity_stock: MoreThan(0),
        },
        relations: ["category", "images"],
        take: buyedWith,
      });

      productsBuyedWith.forEach((product) => {
        productWithBuyed.productsBuyedWith.push(product);
      });

      /*const productsBuyedWith: ProductModel[] = [];
            for (const sortedId of sortedIds) {
                const productBuyedWith = await ProductModel.findOne({
                    where: {
                        id: sortedId,
                        quantity_stock: MoreThan(0),
                    },
                    relations: ['category', 'images'],
                });
                if (productBuyedWith) productsBuyedWith.push(productBuyedWith);
                if (productsBuyedWith.length == 4) break;
            }
        */
    }

    return res.json(productWithBuyed);
  } catch (error) {
    console.error(new Date().toUTCString(), "-", error);
    return res.status(500).json({ message: "internal error" });
  }
}
