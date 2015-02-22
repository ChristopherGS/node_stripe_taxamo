__Purpose__

New EU regulations mean that those selling digital goods must calculate VAT rate by customer country from January 1st, 2015.

Clearly, this creates development challenges. If you use Stripe as your payment processor, then [Taxamo](http://taxamo.com/) can help you.

This repo shows an example setup with node.js, Stripe and Taxamo for a subscription payment model.

I am in not way affiliated with Stripe or Taxamo. Errors in the code are my own. I just wanted to put something helpful together for others because
I was tearing my hair out over this problem for ages.


__Setup Instructions__

1. Install node dependencies from package.json with npm install
2. Install front end dependencies with bower (cd into 'site' folder and do bower install)
3. Replace Stripe and Taxamo Public and Private keys with yours in the config file and in index.html
4. Setup Stripe webhooks for Taxamo as explained here: http://www.taxamo.com/doc/payment_providers/braintree/subscriptions/
5. Setup Stripe webhooks (in your Stripe dashboard) according to the webhooks route - you may need to deploy your app to test the webhooks
6. Run the server (node server.js)



__Solution Steps__

1. Ajax to query app DB if username/email is already taken

2. If username/email is available, use the taxamo.js doSubscription function to create the subscription

3. Update the app DB with additional user information using webhooks


__Notes__

*For any developers like me who live in China, you will need to use an advanced VPN like Astrill VPN dialer in order to access the Taxamo API.

