const { MongoClient } = require("mongodb");

let _db;

const uri = 'mongodb+srv://rebelthyworld:a5a44k6QPmTxd6h6@cluster0.mq49lnp.mongodb.net/shopDb?retryWrites=true&w=majority&appName=Cluster0'

const client = new MongoClient(uri);

const mongoConnect = (cb) => {
  client.connect()
  .then((client)=> {
    console.log('MongoDB connected');
    _db = client.db();
    cb();
  })
  .catch(err=>{
    console.log(err);
    throw err;
  })
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No Database found!!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;