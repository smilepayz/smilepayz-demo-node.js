const crypto = require('crypto');
const https = require('https');
const mySignature =require('../../SignatureUtils')
const moment = require("moment/moment");
const { v4: uuidv4 } = require('uuid');
const myContants = require('./ContantsV2')

async function payInRequest(merchantId,merchantSecret,baseDomain){
    const orderNo = merchantId.replace("sandbox-","S") + mySignature.generateRandomString(16);
    //get merchantId from merchant platform
    const payInParam = {
        orderNo: orderNo.substring(0,32),
        purpose: 'demo for node.js',
        paymentMethod: 'the payment method you need ',
        money:{
            //fixme currency for indonesia transaction,you need to change if you want to do other regions
            currency: myContants.INDONESIA_CURRENCY,
            amount: 100000,
        },
        merchant:{
            merchantId: merchantId
        },
        //fixme demo for indonesia transaction,you need to change if you want to do other regions
        area: myContants.INDONESIA_CODE,
        //Conditional Mandatory
        additionalParam: {
            //fixme only for Thailand pay in,this is means your paying bank account no
            payerAccountNo: '123456789',
        },
        //below field is optional
        payer: {
            name: 'payer name',
            phone: '12345678'
        },
        receiver:{
            name: 'payer name',
            phone: '12345678'
        },
        productDetail: 'details',
        itemDetailList: [
            {
                name: "mac",
                quantity: 1,
                price: 100
            }
        ],
        billingAddress: {
            address: 'No.B1 Pluit',
            city: 'jakarta',
            postalCode: '14450',
            phone: '098754321',
            countryCode: '111111',
        },
        shippingAddress: {
            address: 'No.B1 Pluit',
            city: 'jakarta',
            postalCode: '14450',
            phone: '098754321',
            countryCode: '111111',
        }
    }
    const minify = JSON.stringify(payInParam);
    console.log(`minify String: ${minify}`);

    const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    const signData = timestamp + '|' +  merchantSecret + '|' + minify;
    const signature = mySignature.sha256RsaSignature(signData,myContants.PRIVATE_KEY)

    //options  you have changge hostname, timestamp,
    const options = {
        hostname: baseDomain,
        port: 443,
        path: '/v2.0/transaction/pay-in',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-TIMESTAMP': timestamp,
            'X-SIGNATURE': signature,
            'X-PARTNER-ID': merchantId
        }
    };

    //post request
    const req = https.request(options, (res) => {
        console.log(`Status Code: ${res.statusCode}`);

        res.on('data', (chunk) => {
            console.log(`Response Body: ${chunk}`);
        });
    });

    req.on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });

    req.write(minify);
    req.end();
}
//production
payInRequest(myContants.MERCHANT_ID,myContants.MERCHANT_SECRET,myContants.BASE_URL);

//sandbox
payInRequest(myContants.MERCHANT_ID_SANDBOX,myContants.MERCHANT_SECRET_SANDBOX,myContants.BASE_URL_SANDBOX);

//********** end post ***************
