require('dotenv').config();

const connectDB = require('./db/connect');
const Product = require('./models/product');

const jsonProducts = require('./products.json');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    // Product koleksiyonun içerisindeki verileri sil.
    await Product.deleteMany();
    // Product koleksiyonun içerisine jsonProduts içeirisindeki verileri ekle.
    await Product.create(jsonProducts);

    console.log('Success!!!!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
