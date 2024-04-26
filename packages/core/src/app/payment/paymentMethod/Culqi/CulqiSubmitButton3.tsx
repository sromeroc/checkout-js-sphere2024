import React, { useEffect } from "react";

declare var Culqi: any;

const CulqiSubmitButton3: React.FC = () => {
    
    // Integrate Culqi Checkout
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://checkout.culqi.com/js/v4";
        document.body.appendChild(script);
        
        const script2 = document.createElement('script');
        script2.src = `${window.location.origin}/script.js`;
        document.body.appendChild(script2);
        
        return () => {
            document.body.removeChild(script);
            document.body.removeChild(script2);
        };
    }, []);
    
    const handleClick = () => {
        Culqi.open()
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

export default CulqiSubmitButton3;

