const { getDb } = require('../util/database');
const mongodb = require('mongodb');

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    // this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if(this._id) {
      //update the product
      dbOp = db.collection('products').updateOne({
        // _id: ObjectId.createFromTime(this._id)
        _id: this._id
      }, {
        $set: this
      })
    }
    else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
    .then(result=>{
      console.log(result)
    })
    .catch(err=>console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray()
    .then(products=> {
      return products;
    })
    .catch(err=>console.log(err))
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection('products').find({
      _id: new mongodb.ObjectId(prodId)
      // _id: ObjectId.createFromTime(prodId)
    }).next()
    .then(product=> {
      return product;
    })
    .catch(err=>console.log(err))
  }

  static deleteById(prodId) {
    const db = getDb();
    return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) })
    .then(result=>{
      console.log('DELETED')
    })
    .catch(err=>console.log(err))
  }
}

module.exports = Product;