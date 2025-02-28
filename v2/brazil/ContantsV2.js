class ConstantsV2 {
    static get TRADE_TYPE_PAY_IN() {
        return 1;
    }

    static get TRADE_TYPE_PAY_OUT() {
        return 2;
    }

    static get INDONESIA_CODE() {
        return 10;
    }
    static get THAILAND_CODE() {
        return 11;
    }
    static get INDIA_CODE() {
        return 12;
    }
    static get BRAZIL_CODE() {
        return 13;
    }
    static get MEXICO_CODE() {
        return 14;
    }


    static get INDONESIA_CURRENCY() {
        return 'IDR';
    }
    static get THAILAND_CURRENCY() {
        return 'THB';
    }
    static get INDIA_CURRENCY() {
        return 'INR';
    }
    static get BRAZIL_CURRENCY() {
        return 'BRL';
    }
    static get MEXICO_CURRENCY() {
        return 'MXN';
    }
    static get BASE_URL() {
        return 'gateway-test.smilepayz.com';
    }

    static get BASE_URL_SANDBOX() {
        return 'sandbox-gateway-test.smilepayz.com';
    }

    static get MERCHANT_ID() {
        return 'your merchant id';
    }

    static get MERCHANT_ID_SANDBOX() {
        return 'merchant id in sandbox';
    }

    static get MERCHANT_SECRET() {
        return 'merchant secret';
    }

    static get MERCHANT_SECRET_SANDBOX() {
        return 'merchant secret in sandbox ';
    }

    

    static get PRIVATE_KEY() {
        return 'merchant private key ';
    }


    static get PUBLIC_KEY() {
        return 'platform public key';
    }


}
module.exports = ConstantsV2
