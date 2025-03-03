const https = require('https');
const mySignature = require('../brazil/SignatureUtils')
const moment = require("moment/moment");
const {v4: uuidv4} = require('uuid');
const myContants = require('../brazil/ContantsV2')

async function inquiryBalance(env,merchantId, merchantSecret,privateKey,accountNo) {
    //get merchantId from merchant platform
    const inquiryBalanceReq = {
        accountNo: accountNo,
        balanceTypes: ["BALANCE"]
    }
    const minify = mySignature.minify(inquiryBalanceReq);

    const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    const signData = timestamp + '|' + merchantSecret + '|' + minify;
    const signature = mySignature.sha256RsaSignature(signData, privateKey)
    let baseDomain = myContants.BASE_URL_SANDBOX
    if (env === 'production'){
        baseDomain = myContants.BASE_URL
    }

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

inquiryBalance("","","","","");

//********** end post ***************
