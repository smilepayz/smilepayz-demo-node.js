const https = require('https');
const mySignature = require('../../SignatureUtils')
const moment = require("moment/moment");
const {v4: uuidv4} = require('uuid');
const myContants = require('./ContantsV2')

async function inquiryBalance(merchantId, merchantSecret, baseDomain) {
    //get merchantId from merchant platform
    const inquiryBalanceReq = {
        accountNo: 'your account no',
        balanceTypes: ["BALANCE"]
    }
    const minify = mySignature.minify(inquiryBalanceReq);

    const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    const signData = timestamp + '|' + merchantSecret + '|' + minify;
    const signature = mySignature.sha256RsaSignature(signData, myContants.PRIVATE_KEY)

    //options  you have changge hostname, timestamp,
    const options = {
        hostname: baseDomain,
        port: 443,
        path: '/v2.0/inquiry-balance',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-TIMESTAMP': timestamp,
            'X-SIGNATURE': signature,
            'X-PARTNER-ID': merchantId
        }
    };
    console.log(`request path: ${options.hostname + options.path}`);

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
//sandbox
inquiryBalance(myContants.MERCHANT_ID_SANDBOX, myContants.MERCHANT_SECRET_SANDBOX, myContants.BASE_URL_SANDBOX);


//production
inquiryBalance(myContants.MERCHANT_ID, myContants.MERCHANT_SECRET, myContants.BASE_URL);

//********** end post ***************
