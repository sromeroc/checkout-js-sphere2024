import { CheckoutService, PaymentMethod } from '@bigcommerce/checkout-sdk';
import { FunctionComponent, useCallback } from 'react';


type CheckoutServiceInstance = InstanceType<typeof CheckoutService>;

export interface CulqiPaymentMethodProps {
    method: PaymentMethod;
    deinitializePayment: CheckoutServiceInstance['deinitializePayment'];
    initializePayment: CheckoutServiceInstance['initializePayment'];
    onUnhandledError?(error: Error): void;
}

const CulqiPaymentMethod: FunctionComponent<CulqiPaymentMethodProps> = ({
    initializePayment,
    method,
}) => {
    const initializeCulqiPayment = useCallback(
        (options) =>
            initializePayment({
                ...options,
                culqi: {
                    container: `${method.id}`,
                },
            }),
        [initializePayment, method.id],
    );

    return null;
};
export default CulqiPaymentMethod;