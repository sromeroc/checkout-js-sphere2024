import React from "react";
import CulqiProcessPayment, { closeCulqi, openCulqi } from "./CulqiProcessPayment";


const CulqiSubmitButton: React.FC = () => {

    const handleClick = () => {
        CulqiProcessPayment()
        openCulqi()
        closeCulqi()
    }
    
    return (
        <button id="btn_pagar" className="button button--action button--large button--slab optimizedCheckout-buttonPrimary " onClick={handleClick}>
            PLACE ORDER
        </button>
    );
};

export default CulqiSubmitButton;
