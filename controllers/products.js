const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort('-name price');
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort } = req.query;
  const queryObject = {};

  // koleksiyonumuzun içerdiği aynı özelliklere sahip queryleri aldıktan sonra queryObject objesine aktarıyoruz. Bu sayede queryler boş gelirse queryObject boş bir obje göndereceği için find koleksiyon içindeki bütün verileri çekecek.

  featured && (queryObject.featured = featured);
  company && (queryObject.company = company);

  // $regex ile daha hızlı bir şekilde arama yapabiliriz. 'i' büyük küçük harf duyarlılığı.
  name && (queryObject.name = { $regex: name, $options: 'i' });

  // Arama sonucunu result değişkenine atıyoruz.
  let result = Product.find(queryObject);

  // Eğer gelen queryler içerisinde sort key'i doluysa
  if (sort) {
    // birden fazla sort istediğini("name,price") sort metodunun anlayacağı şekilde parçalayıp birleştiriyoruz("name price").
    const sortList = sort.split(',').join(' ');
    // ve sort metodunun içerisine gönderip sıralamayı yaptırıyoruz.
    result = result.sort(sortList);
  } else {
    // eğer sort adında bir query yoksa kendi belirlediğimiz bir değere göre sıralatıyoruz.
    result = result.sort('createdAt');
  }

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
