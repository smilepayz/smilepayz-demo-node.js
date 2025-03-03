const crypto = require('crypto');
const https = require('https');
const mySignature = require('../indonesia/SignatureUtils')
const moment = require("moment/moment");
const {v4: uuidv4} = require('uuid');
const myContants = require('../indonesia/ContantsV2')

async function payInRequest(env, merchantId, merchantSecret, privateKey, paymentMethod, amount, ovoAccount) {
    let baseDomain = myContants.BASE_URL_SANDBOX
    if (env === 'production') {
        baseDomain = myContants.BASE_URL
    }
    const orderNo = merchantId.replace("sandbox-", "S") + mySignature.generateRandomString(16);
    //get merchantId from merchant platform
    const payInParam = {
        orderNo: orderNo.substring(0, 32),
        purpose: 'demo for node.js',
        paymentMethod: paymentMethod,
        money: {
            currency: myContants.INDONESIA_CURRENCY,
            amount: amount,
        },
        merchant: {
            merchantId: merchantId
        },
        area: myContants.INDONESIA_CODE,
        payer: {
            phone: ovoAccount
        }
    }
    const minify = JSON.stringify(payInParam);
    console.log(`minify String: ${minify}`);

    const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    const signData = timestamp + '|' + merchantSecret + '|' + minify;
    const signature = mySignature.sha256RsaSignature(signData, privateKey)

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

// if paymentMethod == W_OVO ,then ovoAccount is required
payInRequest("", "", "", "", "", "", "");

//********** end post ***************
