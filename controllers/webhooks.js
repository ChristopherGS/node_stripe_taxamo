// __Dependencies__
var express = require('express');
var config = require('config');
var stripe = require('stripe')(
  config.stripe.secret
);
var schemata = require('../schemata/user.js');
var User = schemata.userModel;

// __Module Definition__
var controller = module.exports = express();



// we listen for POST requests to our webhook endpoint
//http://gaarf.info/2013/06/25/securing-stripe-webhooks-with-node-js/

controller.post('/', function(req, res, next) {
	  
	// first, make sure the posted data looks like we expect
	if(req.body.object!=='event') {
		return res.status(400); // respond with HTTP bad request
	}
	  
	// we only care about the event id - we use it to query the Stripe API    
	stripe.events.retrieve(req.body.id, function(err, event){
 
		// the request to Stripe was signed - so if the event id is invalid
		//  (eg it doesnt belong to our account), the API will respond with an error,
		//  & if there was a problem on Stripe's side, we might get no data.
		if(err || !event) {
		  logger.error(err);
		  return res.status(401); // respond with HTTP forbidden
		  
		} else if (event.type==='customer.subscription.created') {
			
			var o = event.data.object;
			
			console.log("all webhook data: "+ o);
			var customerID = o.customer;
			
			stripe.customers.retrieve(o.customer, function(err, customer) {
				// asynchronously called
				if(err) {
					console.log(err);
				} else {
					User.findOne({ email: customer.email }, function (err, user) {
						
						if(err){
							logger.error("failed to find user: "+ err);
							return res.status(200).send( 'Could not find user' ); //webhooks need a 200 response
						}
						
						
						console.log("customer ID: "+ customer.id);
						user.customerID = customer.id;
						
						console.log("subscription ID: "+ customer.subscriptions.data[0].id);
						user.subscriptionID = customer.subscriptions.data[0].id;
						
						console.log("subscription level: "+customer.subscriptions.data[0].plan.id);
						user.subscriptionLevel = customer.subscriptions.data[0].plan.id;
						
						console.log("taxamo transaction ID: "+customer.metadata.taxamo_transaction_key);
						user.taxamo_transaction_key = customer.metadata.taxamo_transaction_key;
						
						user.save(function(err) {
							if(err){
								logger.error(err);
								return res.status(200).send( 'Error updating user subscription info' );
							} else {
								logger.info('user: ' + user + ' saved');
								return res.status(200).send('OK');
							}
						});
					});

					
					//Good spot to put some email code to tell customers their subscription is confirmed
				}
			});
			
		} else {
			logger.warn("unhandled stripe event", event.type);
			return res.status(200).send('OK');
		}
	});

});