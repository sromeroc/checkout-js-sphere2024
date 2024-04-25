import React, { useEffect } from "react";
import { useCheckout } from "@bigcommerce/checkout/payment-integration-api";
import { Checkout } from "@bigcommerce/checkout-sdk";
declare var Culqi: any;

const CulqiSubmitButton2: React.FC = () => {
    // Use checkcoutContext
    const { checkoutState } = useCheckout();
    const { data } = checkoutState;
    const checkoutData = data.getCheckout()
    console.log('Checkout data: ', checkoutData);

    // Integrate Culqi Checkout
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.culqi.com/js/v4';
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
            setupCheckout(checkoutData)
            const culqi = () => {
                if (Culqi.token) {  // ¡Objeto Token creado exitosamente!
                    if (checkoutData) {
                        const token = Culqi.token.id;
                        console.log('Se ha creado un Token: ', token);
                        // En esta línea de código, debes enviar el "Culqi.token.id"
                        // hacia tu servidor con Ajax
                        const data = JSON.stringify({
                            "amount": 600,
                            "currency_code": "PEN",
                            "email": checkoutData.billingAddress?.email,
                            "source_id": token,
                            "capture": true,
                            "description": "BigCommerce",
                            "installments": 0,
                            "metadata": {
                                "dni": "09928494"
                            },
                            "antifraud_details": {
                                "address": checkoutData.billingAddress?.address1,
                                "address_city": checkoutData.billingAddress?.city,
                                "country_code": checkoutData.billingAddress?.countryCode,
                                "first_name": checkoutData.billingAddress?.firstName,
                                "last_name": checkoutData.billingAddress?.lastName,
                                "phone_number": checkoutData.billingAddress?.phone
                            }
                        });
            
                        //var XMLHttpRequest = require('xhr2');
                        const xhr = new XMLHttpRequest();
                        xhr.withCredentials = false;
            
                        xhr.addEventListener("readystatechange", function () {
                            if (this.readyState === this.DONE) {
                                console.log(this.responseText);
                            }
                        });
            
                        console.log('Antes del cargo');
                        console.log('Data: ', data);
                        console.log('Despues del cargo');
            
                        xhr.open("POST", "https://api.culqi.com/v2/charges");
                        xhr.setRequestHeader("Authorization", "Bearer sk_test_kW32mQUjBB3KnfUD");
                        xhr.setRequestHeader("content-type", "application/json");
            
                        xhr.send(data);
                    }
                    else {
                        console.log('ERROR at culqi: CheckoutData is undefined');
                    }
                } else {
            
                    // Mostramos JSON de objeto error en la consola
                    console.log('Error : ', Culqi.error);
            
                }
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleClick = () => {
        openCulqi()
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


const setupCheckout = (checkoutData: Checkout | undefined) => {
    if (checkoutData) {
        Culqi.publicKey = 'pk_test_986ab1b486ddd58f';
        Culqi.settings({
            title: 'BigCommerce',
            currency: 'PEN',
            amount: checkoutData.subtotal * 100,
            // xculqirsaid: 'Inserta aquí el id de tu llave pública RSA',
            // rsapublickey: 'Inserta aquí tu llave pública RSA',
        });
    }
    else {
        console.log('ERROR at setupCheckout: CheckoutData is undefined');
    }
}

const openCulqi = () => Culqi.open();

export default CulqiSubmitButton2;

