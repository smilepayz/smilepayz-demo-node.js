class ConstantsV2 {
    static get TRADE_TYPE_PAY_IN() {
        return 1;
    }

    static get TRADE_TYPE_PAY_OUT() {
        return 2;
    }

    static get INDIA_CODE() {
        return 12;
    }

    static get INDIA_CURRENCY() {
        return 'INR';
    }

    static get BASE_URL() {
        return 'gateway.smilepayz.com';
    }

    static get BASE_URL_SANDBOX() {
        return 'sandbox-gateway.smilepayz.com';
    }

}

module.exports = ConstantsV2
