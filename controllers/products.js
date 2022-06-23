const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .sort('price')
    .select('name price');
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  // koleksiyonumuzun içerdiği aynı özelliklere sahip queryleri aldıktan sonra queryObject objesine aktarıyoruz. Bu sayede queryler boş gelirse queryObject boş bir obje göndereceği için find koleksiyon içindeki bütün verileri çekecek.

  featured && (queryObject.featured = featured);
  company && (queryObject.company = company);

  // $regex ile daha hızlı bir şekilde arama yapabiliriz. 'i' büyük küçük harf duyarlılığı.
  name && (queryObject.name = { $regex: name, $options: 'i' });

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      match => `-${operatorMap[match]}-`
    ); // price>40,rating>=40 ---(replace)--> price-$gt-40,rating-$gte-40
    console.log(filters);

    const options = ['price', 'rating'];

    filters = filters.split(',').forEach(item => {
      const [field, operator, value] = item.split('-');
      // field=price, operator=$gt, value=40

      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
        // queryObject.price:{$gt: 40}, queryObject.rating: {$gte: 40}
      }
    });
  }
  console.log(queryObject);
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

  // select metodu sadece istenilen alanları göndermemizi sağlar.
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  // page ve limite eğer bir değer girilmezse default bir değer veriyoruz. limit ile bir kerede kaç tane veri istediğimizi beliriyoruz.
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  // skip ile kaç veri atlamamız gerektiğini söylüyoruz. Örneğin çekeceğim veri limiti 10 ise ve 2. sayfaya geçersem bana 2 - 1 * 10 = 10'dan sonraki değerleri getirir. Yani birinci sayfa 1 - 10 arası veri getirirken, ikinci sayfa 11 - ... arası veri getirecek.
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
