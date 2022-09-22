import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel';
import { isAdmin, isAuth } from '../utils';

const productRouter = express.Router();
productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      brand: 'product brand',
      name: 'product name',
      type: 'product type',
      image: 'product image',
      countInStock: 0,
      price: 0.0,
      rating: 0.0,
      numReviews: 0,
    });
    const createdProduct = await product.save();
    if (createdProduct) {
      res
        .status(201)
        .send({ message: 'product created', product: createdProduct });
    } else {
      res.status(500).send({ message: 'error in creating product' });
    }
  }),
);

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(401).send({
        message: 'Product not found',
      });
    } else {
      product.brand = req.body.brand || product.brand;
      product.name = req.body.name || product.name;
      product.type = req.body.type || product.type;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.price = req.body.price || product.price;
      product.image = req.body.image || product.image;
      const updatedProduct = await product.save();
      res.send({
        _id: updatedProduct._id,
        brand: updatedProduct.brand,
        name: updatedProduct.name,
        type: updatedProduct.type,
        countInStock: updatedProduct.countInStock,
        price: updatedProduct.price,
        image: updatedProduct.image,
      });
    }
  }),
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deletedProduct = await product.remove();
      res.send({ message: 'product deleted', product: deletedProduct });
    } else {
      res.status(404).send({ message: 'product not found' });
    }
  }),
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) res.send(product);
    else res.status(404).send({ message: 'product not found' });
  }),
);

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const searchKeyWord = req.query.searchKeyWord
      ? {
          name: {
            $regex: req.query.searchKeyWord,
            $options: 'i',
          },
        }
      : {};
    const products = await Product.find({ ...searchKeyWord });
    res.send(products);
  }),
);
export default productRouter;
