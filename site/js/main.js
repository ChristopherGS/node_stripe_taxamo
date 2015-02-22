(function(){


	Taxamo.verifyToken(function(data) {
		alert(data.tokenOK ? 'Correct token' : 'Invalid token');
	});//demo only
	
	$('form').on('submit', preTaxamo);
	
	function preTaxamo(e){
		e.preventDefault();
		console.log('commence front end validation');

		//front-end validation
		if(!e.currentTarget.checkValidity()){
			console.log('found errors');
			$('taxamo-L').removeAttr("disabled");
		} else {
			console.log('no errors');
			this.activateStripe(e);
		}
	};
	
	function checkServer(e){
		console.log('commence prechecks');
		var self = this;
		var subscriberEmail = $('#registration_email').val();
		var subscriberUserName = $('#registration_username').val();
		var subscriberPassword = $('#registration_password').val();
		
		var subscriptionPlan = "Silver"; //Here you would update with the name of one of your Stripe plans
		
		var querystring = "&email="+subscriberEmail+"&username="+subscriberUserName+"&password="+subscriberPassword;
			
			$.ajax({
				url: "/api/payment/taxamo",
				type: "POST",
				data: querystring,
				
				success: function (jqxhr, status, error){
					self.taxamoWrapper(subscriptionPlan, subscriberUserName, subscriberEmail);
				}, 
				error: function(jqxhr, status, error) {
					$('#taxamo-L').removeAttr("disabled");
					alert("sorry, something went wrong on the server");
				}
			});
	};
	
	function taxamoWrapper(subscriptionPlan, subscriberUserName, subscriberEmail){
		console.log('hit the taxamo function');
		
		//b2c_plan_id, b2b_plan_id, provider, resultHandler, options
		Taxamo.doSubscriptionCheckout(subscriptionLevel, 'silver', 'stripe', //the second paramater is 'b2b plan' which is never used - set to a stripe plan to avoid errors
			function(data) { //success handler, you should place more complex logic here
				console.log("Finished checkout:" + JSON.stringify(data, null, '\t'));
				alert('Your Membership has been created! Please login');
				
				//TO CHECK: do I need to ajax this key to the server? Or is it stored in Stripe already?
				var transaction_key = data.payment_result.key;	
				
				//login logic e.g.
				//window.location.replace('#/login');
			},
			{vat_number_field_hidden: true,
			 email_field_hidden: true,
			 email_field_optional: false,
			 custom_id: '',
			 description: 'does not show up', 
			 buyer_email: subscriberEmail,
			 custom_fields: [{'key': 'username', 'value': subscriberUserName}, {'key':'email', 'value':subscriberEmail}]
			}
		);
	};

})();