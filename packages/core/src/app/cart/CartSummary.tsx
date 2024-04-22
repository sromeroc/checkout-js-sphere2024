import { Checkout, ShopperCurrency, StoreCurrency } from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent } from 'react';

import { withCheckout } from '../checkout';
import { isBuyNowCart } from '../common/utility';
import OrderSummary from '../order/OrderSummary';

import EditLink from './EditLink';
import mapToCartSummaryProps from './mapToCartSummaryProps';
import { RedeemableProps } from './Redeemable';
import withRedeemable from './withRedeemable';

export type WithCheckoutCartSummaryProps = {
    checkout: Checkout;
    cartUrl: string;
    isUpdatedCartSummayModal: boolean;
    storeCurrency: StoreCurrency;
    shopperCurrency: ShopperCurrency;
    storeCreditAmount?: number;
} & RedeemableProps;

const CartSummary: FunctionComponent<WithCheckoutCartSummaryProps> = ({ cartUrl, ...props }) => {
    const headerLink = isBuyNowCart() ? null : <EditLink url={cartUrl} />;

    console.log("At CartSummary, cartUrl: ", cartUrl);
    console.log("At CartSummary, Checkout: ", props.checkout);
    // localStorage.setItem('grandtotal', props.checkout.grandTotal.toString());
    
    return withRedeemable(OrderSummary)({
        ...props,
        cartUrl,
        headerLink,
    });
};

export default withCheckout(mapToCartSummaryProps)(CartSummary);
