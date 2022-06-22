const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({
    name: 'vase table',
  });
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company } = req.query;
  const queryObject = {};

  // koleksiyonumuzun içerdiği aynı özelliklere sahip queryleri aldıktan sonra queryObject objesine aktarıyoruz. Bu sayede queryler boş gelirse queryObject boş bir obje göndereceği için find koleksiyon içindeki bütün verileri çekecek.
  if (featured && company) {
    queryObject.featured = featured;
    queryObject.company = company;
  }

  const products = await Product.find(queryObject);

  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
