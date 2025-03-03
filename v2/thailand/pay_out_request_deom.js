const crypto = require('crypto');
const https = require('https');
const mySignature = require('../thailand/SignatureUtils')
const moment = require("moment/moment");
const {v4: uuidv4} = require('uuid');
const myContants = require('../thailand/ContantsV2')


async function payoutRequest(env, merchantId, merchantSecret, privateKey, paymentMethod, cashAccount, amount) {
    let baseDomain = myContants.BASE_URL_SANDBOX
    if (env === 'production') {
        baseDomain = myContants.BASE_URL
    }
    const orderNo = merchantId.replace("sandbox-", "S") + mySignature.generateRandomString(16);

    //get merchantId from merchant platform
    const payInParam = {
        orderNo: orderNo.substring(0, 32),
        purpose: 'test',
        cashAccount: cashAccount,
        paymentMethod: paymentMethod,
        money: {
            currency: myContants.THAILAND_CURRENCY,
            amount: amount,
        },
        merchant: {
            merchantId: merchantId,
        },
        area: myContants.THAILAND_CODE,
    }
    const minify = JSON.stringify(payInParam);

    console.log(`minify: ${minify}`);

    const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    const signData = timestamp + '|' + merchantSecret + '|' + minify;
    const signature = mySignature.sha256RsaSignature(signData, privateKey)


    //options  you have changge hostname, timestamp,
    const options = {
        hostname: baseDomain,
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

payoutRequest("","","","","","",500);



//********** end post ***************
