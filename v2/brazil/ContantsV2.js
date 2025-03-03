class ConstantsV2 {
    static get TRADE_TYPE_PAY_IN() {
        return 1;
    }

    static get TRADE_TYPE_PAY_OUT() {
        return 2;
    }

    static get BRAZIL_CODE() {
        return 13;
    }

    static get BRAZIL_CURRENCY() {
        return 'BRL';
    }

    static get BASE_URL() {
        return 'gateway.smilepayz.com';
    }

    static get BASE_URL_SANDBOX() {
        return 'sandbox-gateway.smilepayz.com';
    }
}

module.exports = ConstantsV2
