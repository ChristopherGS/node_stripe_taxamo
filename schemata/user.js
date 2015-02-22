// __Dependencies__
var mongoose = require('mongoose');

// __Module Definition__

exports.mongoose = mongoose;

// __Schema__

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSchema = mongoose.Schema({

  //payment info 
  //NOTE: to update these indexes you need to first use the db.users.dropIndexes() method
 
  subscriptionID: { type: String, required: false, unique: true, sparse: true },
  customerID: { type: String, required: false, unique: true, sparse: true },
  subscriptionLevel: {type: String, required: false, unique: false},
  
  //taxamo
  
  taxamo_transaction_key: { type: String, required: false, unique: true, sparse: true }, 

  //user info

  username: { type: String, required: false, unique: true },
  email: { type: String, required: false, unique: true, sparse: false },
  password: { type: String, required: false},

  //other user stats

  wins: {type: String, required: false},
  losses: {type: String, required: false},
});

// Export user model
var userModel = mongoose.model('User', userSchema); //This is where the db collection name is created
exports.userModel = userModel;

