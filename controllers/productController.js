const Product = require("../models/productModel");
const fs = require("fs");
const path = require('path');


exports.getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const id = req.params.id;
  const products = await Product.findOne({id: id});
  res.json(products);
};


exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json({ message: "Product created", product });
};

exports.addProductsInBatch = async (req, res) => {

  if (!req.file) {
    return res.status(400).send({ error: "Cannot upload products." });
  }

  try {

    const filePath = path.join(process.cwd(), 'uploads', req.file.filename); 
    console.log(filePath)
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent);
    // fs.unlinkSync(req.file.path);
    const products = Array.isArray(jsonData) ? jsonData : [jsonData];
    console.log(products)
    const result = await Product.insertMany(products);
    res
      .status(200)
      .send({
        message: "Products uploaded successfuly.",
        insertedCount: result.length,
        products: result,
      });
  } catch (error) {
    console.error("Error processing file:", error);

    // Clean up the uploaded file in case of error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res
      .status(500)
      .send({ error: "Failed to process file", details: error.message });
  }
};
