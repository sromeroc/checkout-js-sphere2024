import React from "react";
import CulqiProcessPayment, { closeCulqi, openCulqi } from "./CulqiProcessPayment";

interface CulqiData {
    cartItem: number;
}

const CulqiSubmitButton: React.FC<CulqiData> = ({cartItem}) => {

    const handleClick = () => {
        CulqiProcessPayment()
        openCulqi()
        closeCulqi()
    }

    return (
        <button
            id="btn_pagar"
            className="button button--action button--large button--slab optimizedCheckout-buttonPrimary "
            onClick={handleClick}>
            PLACE ORDER WITH CULQI + {cartItem}
        </button>
    );
};

export default CulqiSubmitButton;
