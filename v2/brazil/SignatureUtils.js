const crypto = require('crypto');


// this is generate signature method when hit pay in/ pay out api
function hmacSHA512(signData, secret) {
    const hmac = crypto.createHmac('sha512', secret);
    hmac.update(signData);
    return hmac.digest('base64');
}

function generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex');
}

function minify(requestBody) {
    return  JSON.stringify(requestBody);
}

const minifyStr = "{\"paymentMethod\":\"QRPAY\",\"payer\":{\"name\":\"payer name\",\"phone\":\"123456789\"},\"receiver\":{\"name\":\"receiver name\",\"phone\":\"123456789\"},\"orderNo\":\"T_1712742988888\",\"purpose\":\"Purpose For Transaction from Java SDK\",\"productDetail\":\"Product details\",\"itemDetailList\":[{\"name\":\"mac A1\",\"quantity\":1,\"price\":100}],\"billingAddress\":{\"address\":\"Jl. Pluit Karang Ayu 1 No.B1 Pluit\",\"city\":\"jakarta\",\"postalCode\":\"14450\",\"phone\":\"018922990\",\"countryCode\":\"THAILAND\"},\"shippingAddress\":{\"address\":\"Jl. Pluit Karang Ayu 1 No.B1 Pluit\",\"city\":\"jakarta\",\"postalCode\":\"14450\",\"phone\":\"018922990\",\"countryCode\":\"THAILAND\"},\"money\":{\"currency\":\"THB\",\"amount\":100},\"merchant\":{\"merchantId\":\"sandbox-20011\"},\"area\":11}";
const hash = crypto.createHash('sha256').update(minifyStr).digest();
const byte2Hex = hash.toString('hex');
const lowerCase = byte2Hex.toLowerCase();
const accessToken = "gp9HjjEj813Y9JGoqwOeOPWbnt4CUpvIJbU1mMU4a11MNDZ7Sg5u9a";
const timestamp = "2020-12-17T10:55:00+07:00";
const signData = "POST:/v1.0/transaction/pay-in:" +accessToken  + ':'  +  lowerCase + ':' + timestamp;
const secret = "1c10756efe3494660442cdc096d402c154bae5d32a4c31fec087b38bc6ad5a29";
const signature = hmacSHA512(signData, secret);
console.log(signature);


// this is to check signature when received the call back after order finished
function checkSha256RsaSignature(content, signed, publicKeyStr, encode) {
    try {

        const beginPublicKey = '-----BEGIN PUBLIC KEY-----\n';
        const endPublicKey = '\n-----END PUBLIC KEY-----';
        const pemFormattedPublicKey = beginPublicKey + publicKeyStr.replace(/(.{64})/g, "$1\n") + endPublicKey;

        const signedBuffer = Buffer.from(signed, 'base64');

        const verifier = crypto.createVerify('RSA-SHA256');
        verifier.update(content, encode);

        return verifier.verify(pemFormattedPublicKey, signedBuffer);
    } catch (error) {
        console.error("Sign doCheck exception:", error);
        return false;
    }
}

// demo
const content = "T111200242404100829509916|2024-04-10T08:45:32+07:00";
const signed = "R5igwg7R5j5U8sWbezoRLIqNqn72mKnZT/Z56UsER1IB8iitgV6AK7zLVcbuACuOvsVSsMg/9sH87vUahxxca6kEq1ejavQeqg5rFWUw3ZAZMbZjs6zpkNDaC5NWZpQQIXzYZJB2B6y4l0LokiWaZyP6bwbjER1Z0EWVsBZ1gbvtDe5dh+1wtTJtkgf9hL6UOWLKLrCYOqZ74sTvY5JbPvjwh0yhtVcS1C9Oh8ot0P4LOw7bUNvs8mx+OROHRn2PrNLADxVSSWIZJcVLOOdGEoiHzgjVNCrIC4aeqDBlBIDiOvFhcWe6rD8WLXd1cEfwEprwQ4f92dsVbMnkX55BSQ==";
const publicKeyString = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvxhX5aHxC9QUN8ivqxPslUnbFsBy0dpWwalgSBlQ7gMdyA2lbMmP76TthIGIuWK3uO5h81c+cchGFaiOer5zGsdE7LMZPzFnDDvbMQRvKDDO7Lg3nGGodRoOLnvOeavhsYa7YORS/QC1h2aCYk24SCrNDjaG3YxDJavCCTZoYF12Hofg7dmGrtx7L+ky3+Gl5059gmz+dZsYBMJqq0VMtI28pIqZ9cHmnf9q0C6JEhfNKG2kRyfheLar12ZLSCbJfGI4hSNpX+oWMENZ11KSEWVzMl3WPiAK/zv9k+5wsYBiJ6rbLrXtm56OF+bHcp5hTkZHtA9Wzc2X3TbpHxqq6wIDAQAB";
const encode = "utf-8";
const result = checkSha256RsaSignature(content, signed, publicKeyString, encode);
console.log(result);


function accessTokenSignature(clientKey,timestamp, privateKeyStr) {

    const stringToSign = `${clientKey}` + '|' + `${timestamp}`;

    return sha256Signature(stringToSign, privateKeyStr);
}

function sha256RsaSignature(stringToSign, privateKeyStr) {
    //********** begin signature ***************
    const privateKeyData = Buffer.from(`${privateKeyStr}`, 'base64');
    const privateKey = crypto.createPrivateKey({
        key: privateKeyData,
        format: 'der',
        type: 'pkcs8',
    });
    const sign = crypto.createSign('SHA256');
    sign.update(stringToSign);
    sign.end();
    const signature = sign.sign(privateKey);
    const signatureBase64 = signature.toString('base64');
    console.log(signatureBase64);
    return signatureBase64;
}

module.exports = {hmacSHA512,accessTokenSignature,sha256RsaSignature,generateRandomString,checkSha256RsaSignature,minify};

