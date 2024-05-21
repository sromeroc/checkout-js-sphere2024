import { PaymentMethod } from '@bigcommerce/checkout-sdk';

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
        supportedCards: [],
        type: "PAYMENT_TYPE_SDK",
        logoUrl: "",
        initializationStrategy: {
            type: "none"
        }
    };
}