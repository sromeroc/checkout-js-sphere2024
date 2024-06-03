import { PaymentMethod } from '@bigcommerce/checkout-sdk';

export function getPaymentMethodCulqi(): PaymentMethod {
    return {
        id: 'culqi',
        gateway: undefined,
        method: 'hosted',
        config: {
            displayName: 'Pagar con Culqi - Sphere',
            hasDefaultStoredInstrument: false,
            helpText: "Puede pagar con Yape, Cuotéalo BCP y PagoEfectivo ",
            testMode: true
        },
        supportedCards: [],
        type: "PAYMENT_TYPE_CULQI",
        logoUrl: "",
        initializationStrategy: {
            type: "none"
        }
    };
}