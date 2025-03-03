const https = require('https');
const mySignature = require('../mexico/SignatureUtils')
const moment = require("moment/moment");
const {v4: uuidv4} = require('uuid');
const myContants = require('../mexico/ContantsV2')

async function inquiryOrderStatus(env,merchantId, merchantSecret,privateKey,tradeNo,orderNo,tradeType) {
    let baseDomain = myContants.BASE_URL_SANDBOX
    if (env === 'production') {
        baseDomain = myContants.BASE_URL
    }
    //get merchantId from merchant platform
    const inquiryOrderStatusReq = {
        tradeType: tradeType,
        tradeNo: tradeNo,
        orderNo: orderNo
    }
    const minify = mySignature.minify(inquiryOrderStatusReq);

    const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    const signData = timestamp + '|' + merchantSecret + '|' + minify;
    const signature = mySignature.sha256RsaSignature(signData, privateKey)

    //options  you have changge hostname, timestamp,
    const options = {
        hostname: baseDomain,
        port: 443,
        path: '/v2.0/inquiry-status',
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


inquiryOrderStatus("","","","","","","");


//********** end post ***************
