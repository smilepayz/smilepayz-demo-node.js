const crypto = require('crypto');
const https = require('https');
const mySignature =require('../../SignatureUtils')
const moment = require("moment/moment");
const { v4: uuidv4 } = require('uuid');
const myContants = require('./ContantsV2')



async function payoutRequest(merchantId,merchantSecret,domain){
    const orderNo = merchantId.replace("sandbox-","S") + mySignature.generateRandomString(16);

    //get merchantId from merchant platform
    const payInParam = {
        orderNo: orderNo.substring(0,32),
        purpose: 'test',
        //fixme cashAccount  paymentMethod
        cashAccount: 'the cash account like:bank account number,e-wallet account number',
        paymentMethod: 'the payment method',
        money:{
            //fixme currency for indonesia transaction,you need to change if you want to do other regions
            currency: myContants.INDONESIA_CURRENCY,
            amount: 200000,
        },
        merchant:{
            merchantId: merchantId,
        },
        //fixme currency for indonesia transaction,you need to change if you want to do other regions
        area: myContants.INDONESIA_CODE,
        payer: {
            name: 'payer name',
            phone: '12345678'
        },
        receiver:{
            name: 'payer name',
            phone: '12345678'
        },
        //below field is optional
        additionalParam: {
            //fixme  Only for India Pay out to Bank
            ifscCode: 'YESB0000097',
            //fixme Only for Brazil pay out , which method is CPF/CNPJ ,this is tax number for CPF/CNPJ
            taxNumber: '1234567890',
        },
        itemDetailList: [
            {
                name: "mac",
                quantity: 1,
                price: 100
            }
        ],
        billingAddress: {
            address: 'Ayu 1 No.B1 Pluit',
            city: 'jakarta',
            postalCode: '14450',
            phone: '018922990',
            countryCode: 'BRAZIL',
        },
        shippingAddress: {
            address: 'Ayu 1 No.B1 Pluit',
            city: 'jakarta',
            postalCode: '14450',
            phone: '018922990',
            countryCode: 'BRAZIL',
        }
    }
    const minify = JSON.stringify(payInParam);

    console.log(`minify: ${minify}`);

    const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    const signData = timestamp + '|' +  merchantSecret + '|' + minify;
    const signature = mySignature.sha256RsaSignature(signData,myContants.PRIVATE_KEY)


    //options  you have changge hostname, timestamp,
    const options = {
        hostname: domain,
        port: 443,
        path: '/v2.0/disbursement/pay-out',
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
payoutRequest(myContants.MERCHANT_ID,myContants.MERCHANT_SECRET,myContants.BASE_URL);

//sandbox
payoutRequest(myContants.MERCHANT_ID_SANDBOX,myContants.MERCHANT_SECRET_SANDBOX,myContants.BASE_URL_SANDBOX);


//********** end post ***************
