import React from "react";
import CulqiProcessPayment, { closeCulqi, openCulqi, culqi} from "./CulqiProcessPayment";
import { useCheckout } from "@bigcommerce/checkout/payment-integration-api";

const CulqiSubmitButton: React.FC = () => {
    const { checkoutState } = useCheckout();
    const { data } = checkoutState;
    // console.log('Checkout data: ', data.getCheckout());
    
    const handleClick = () => {
        CulqiProcessPayment(data.getCheckout())
        culqi(data.getCheckout())
        openCulqi()
        closeCulqi()
    }

    return (
        <button
            id="btn_pagar"
            className="button button--action button--large button--slab optimizedCheckout-buttonPrimary "
            onClick={handleClick}>
            PLACE ORDER WITH CULQI
        </button>
    );
};

export default CulqiSubmitButton;
