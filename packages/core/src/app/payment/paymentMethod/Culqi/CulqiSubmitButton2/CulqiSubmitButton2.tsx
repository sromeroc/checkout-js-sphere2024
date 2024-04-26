import React, { useEffect } from "react";
import { useCheckout } from "@bigcommerce/checkout/payment-integration-api";
import { setupCheckout } from "./setupCheckout";

declare var window: any;
declare var Culqi: any;
const sk = "sk_test_kW32mQUjBB3KnfUD"
const script = document.createElement('script');

// Create promise to load culqi checkout
const loadScript = (url: string) => {
    return new Promise((resolve, reject) => {
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
    });
};

const CulqiSubmitButton2: React.FC = () => {
    // Use checkcoutContext
    const { checkoutState } = useCheckout();
    const { data } = checkoutState;
    const checkoutData = data.getCheckout()
    console.log('Checkout data: ', checkoutData);

    // Integrate Culqi Checkout
    useEffect(() => {
        if (checkoutData) {
            // Create script
            loadScript('https://checkout.culqi.com/js/v4')
                .then(() => {
                    console.log('Script cargado correctamente:', script);

                    // Culqi function
                    const culqi = () => {
                        if (Culqi.token) {  // ¡Objeto Token creado exitosamente!
                            const token = Culqi.token.id;
                            console.log('Se ha creado un Token: ', token);
                            // En esta línea de código, debes enviar el "Culqi.token.id"
                            // hacia tu servidor con Ajax
                            const data = JSON.stringify({
                                "amount": checkoutData.subtotal ? checkoutData.subtotal * 100 : 0,
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
                            xhr.setRequestHeader("Authorization", `Bearer ${sk}`);
                            xhr.setRequestHeader("content-type", "application/json");
                
                            xhr.send(data);
                        } else {
                    
                            // Mostramos JSON de objeto error en la consola
                            console.log('Error : ', Culqi.error);
                    
                        }
                    }    

                    window.onload = culqi

                    script.onload = () => {
                        // Setup Checkout
                        setupCheckout(checkoutData)
                    };

                    // Add script to the body
                    document.body.appendChild(script);

                })
                .catch((error) => {
                    // Hubo un error al cargar el script
                    console.error('Error al cargar el script:', error);
                });

        }
        else {
            console.log('ERROR at culqi: CheckoutData is undefined');
        }

        return () => {
            document.body.removeChild(script);
        };
    }, [checkoutData]);

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

export default CulqiSubmitButton2;

