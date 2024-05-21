import { PaymentMethod } from '@bigcommerce/checkout-sdk';

export function getPaymentMethod(): PaymentMethod {
    return {
        id: 'authorizenet',
        gateway: undefined,
        logoUrl: '',
        method: 'credit-card',
        supportedCards: ['VISA', 'AMEX', 'MC'],
        initializationData: {
            payPalCreditProductBrandName: { credit: '' },
        },
        config: {
            displayName: 'Authorizenet',
            cardCode: true,
            enablePaypal: undefined,
            hasDefaultStoredInstrument: false,
            helpText: '',
            is3dsEnabled: undefined,
            isVisaCheckoutEnabled: undefined,
            merchantId: undefined,
            testMode: false,
        },
        type: 'PAYMENT_TYPE_API',
    };
}

export function getPaymentMethodCulqi(): PaymentMethod {
    return {
        id: 'culqi',
        gateway: undefined,
        config: {
            displayName: 'Pagar con Culqi Nuevo - Sphere',
            hasDefaultStoredInstrument: false,
            helpText: "",
            testMode: true
        },
        method: 'hosted',
        supportedCards: ['VISA', 'MC'],
        type: "PAYMENT_TYPE_SDK",
        logoUrl: "",
        initializationStrategy: {
            type: "not_applicable" // !! none
        }
    };
}

export function getPaypalCreditPaymentMethod(): PaymentMethod {
    return {
        config: {},
        supportedCards: [],
        id: 'paypalcommercecredit',
        gateway: undefined,
        logoUrl: '',
        method: 'paypal',
        initializationData: {
            payPalCreditProductBrandName: { credit: 'Pay in 3' },
        },
        type: 'PAYMENT_TYPE_API',
    };
}

export function getMobilePaymentMethod(): PaymentMethod {
    return {
        id: 'authorizenetMobile',
        gateway: undefined,
        logoUrl: '',
        method: 'credit-card',
        supportedCards: ['VISA', 'AMEX', 'MC'],
        initializationData: {
            showOnlyOnMobileDevices: true,
        },
        config: {
            displayName: 'Authorizenet',
            cardCode: true,
            enablePaypal: undefined,
            hasDefaultStoredInstrument: false,
            helpText: '',
            is3dsEnabled: undefined,
            isVisaCheckoutEnabled: undefined,
            merchantId: undefined,
            testMode: false,
        },
        type: 'PAYMENT_TYPE_API',
    };
}

export function getCreditCardSphere(): PaymentMethod {
    return {
        id: 'mercado_pago.card',
        gateway: undefined, // !! null
        logoUrl: '',
        method: 'card',
        supportedCards: ['VISA', 'MC', 'AMEX'],
        // providesShippingAddress: true,
        config: {
            cardCode: true,
            displayName: "Credit Card - LuisDev",
            enablePaypal: undefined,
            hasDefaultStoredInstrument: false,
            helpText: "",
            is3dsEnabled: undefined,
            isHostedFormEnabled: true,
            isVaultingCvvEnabled: undefined,
            isVaultingEnabled: false,
            isVisaCheckoutEnabled: undefined,
            logo: undefined,
            merchantId: undefined,
            requireCustomerCode: false,
            showCardHolderName: undefined,
            testMode: true
        },
        type: 'PAYMENT_TYPE_SDK',
        initializationStrategy: {
            type: 'card_ui'
        },
        nonce: undefined,
        initializationData: null,
        clientToken: undefined,
        returnUrl: undefined,
    };
}
