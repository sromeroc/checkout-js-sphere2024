import { CheckoutService, PaymentMethod } from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent, useEffect } from 'react';

type CheckoutServiceInstance = InstanceType<typeof CheckoutService>;

export interface Props {
    method: PaymentMethod;
    deinitializePayment: CheckoutServiceInstance['deinitializePayment'];
    initializePayment: CheckoutServiceInstance['initializePayment'];
    onUnhandledError?(error: Error): void;
}

export const CulqiPaymentMethod: FunctionComponent<Props> = (props) => {
    const { method } = props;

    useEffect(() => {
        console.log(method);
    }, [method]);

    return null;
};