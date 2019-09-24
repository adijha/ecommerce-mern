const express = require('express');
const router = express();
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');

let temp1;
let temp2;

// const orderSchema = {
//   data: Object
// };

// const Order = mongoose.model('Order', orderSchema);

const Insta = require('instamojo-nodejs');
const url = require('url');

// /api/bid/pay
router.post('/pay', (req, res) =>
{
  console.log("/pay post trigger")
  const body = JSON.parse(req.body);
  temp1 = body;

  Insta.setKeys('test_c496eefc2cceece396905f07440', 'test_b7781fba1a5e484e80cde59e36b');

  const data = new Insta.PaymentData();
  Insta.isSandboxMode(true);

  data.purpose = body.purpose;
  data.amount = body.amount;
  data.buyer_name = body.buyer_name;
  data.redirect_url = body.redirect_url;
  data.email = body.email;
  data.phone = body.phone;
  data.send_email = false;
  data.webhook = 'http://www.example.com/webhook/';
  data.send_sms = false;
  data.allow_repeated_payments = false;

  Insta.createPayment(data, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      const responseData = JSON.parse(response);
      const redirectUrl = responseData.payment_request.longurl;
      res.send(redirectUrl);
    }
  });
});

/**
 * @route GET api/bid/callback/
 * @desc Call back url for instamojo
 * @access public
 */
router.get('/callback/', (req, res) => {
  let url_parts = url.parse(req.url, true),
    responseData = url_parts.query;

  if (responseData.payment_id) {
    temp2 = responseData;
    const order = { ...temp1, ...temp2 };

    
    // const newOrder = new Order({
    //   data: order
    // });
    // newOrder.save(function(err) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     res.send('new user created');
    //   }
    // });


    // console.log('--order->', order);
    return res.redirect('http://157.245.101.109/payment-complete');
  }
});

// We export the router so that the server.js file can pick it up
module.exports = router;
