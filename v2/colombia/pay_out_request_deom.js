const crypto = require('crypto');
const https = require('https');
const mySignature = require('../colombia/SignatureUtils')
const moment = require("moment/moment");
const {v4: uuidv4} = require('uuid');
const myContants = require('../colombia/ContantsV2')


async function payoutRequest(env, merchantId, merchantSecret, privateKey, paymentMethod, amount,cashAccount, cashAccountType
    , name, email, phone, idType, identity) {
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
        cashAccountType: cashAccountType,
        paymentMethod: paymentMethod,
        money: {
            currency: myContants.PERU_CURRENCY,
            amount: amount,
        },
        merchant: {
            merchantId: merchantId,
        },
        receiver: {
            name: name,
            email: email,
            phone: phone,
            idType: idType,
            identity: identity,
        },
        area: myContants.PERU_CODE,
    }
    const minify = JSON.stringify(payInParam);

    console.log(`minify: ${minify}`);

    const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    const signData = timestamp + '|' + merchantSecret + '|' + minify;
    const signature = mySignature.sha256RsaSignature(signData, myContants.PRIVATE_KEY)


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

const merchant_id = '';
const privateKey = '';
const merchant_secret = "";
const payment_method = '';
const amount = 100;
const cash_account = "";
//CORRIENTE or AHORROS
const cash_account_type = "" ;
const name = "";
const email = '';
const phone = "";
//For Colombia: CC : Domestic documents,CE：Foreigner documents
const idType = "";
const identity = "";
payoutRequest("", merchant_id, merchant_secret, privateKey, payment_method, amount,cash_account,cash_account_type,
    name,email,phone,idType,identity);


//********** end post ***************
