const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const search = 'ab';
  const products = await Product.find({
    name: { $regex: search, $options: 'i' },
  });
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name } = req.query;
  const queryObject = {};

  // koleksiyonumuzun içerdiği aynı özelliklere sahip queryleri aldıktan sonra queryObject objesine aktarıyoruz. Bu sayede queryler boş gelirse queryObject boş bir obje göndereceği için find koleksiyon içindeki bütün verileri çekecek.

  featured && (queryObject.featured = featured);
  company && (queryObject.company = company);

  // $regex ile daha hızlı bir şekilde arama yapabiliriz. 'i' büyük küçük harf duyarlılığı.
  name && (queryObject.name = { $regex: name, $options: 'i' });

  const products = await Product.find(queryObject);

  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
