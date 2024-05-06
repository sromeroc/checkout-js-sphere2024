import React, { useEffect } from "react";
import { useCheckout } from "@bigcommerce/checkout/payment-integration-api";
import { generateUniqueID } from './utils'

declare global {
    interface Window {
        culqi: any;
        Culqi: any;
    }
}

const CulqiButtonUseWindow: React.FC = () => {
    // Use checkcoutContext
    const { checkoutState } = useCheckout();
    const { data } = checkoutState;
    const checkoutData = data.getCheckout()
    const ordernes = data.getOrder();
    console.log('Checkout data: ', checkoutData);
    console.log('Data Order>>: ', ordernes);

    const onCulqiLoad = () => {
        if (checkoutData) {
            // Checkout data
            const amount = Math.floor(checkoutData.grandTotal * 100)
            const createdTime = new Date(checkoutData.cart.createdTime)
            const creationDate = createdTime.getTime() / 1000;
            const expirationDate = createdTime.setFullYear(createdTime.getFullYear() + 1) / 1000
            const currency = checkoutData.cart.currency.code
            const title = 'Tienda de Mascotas'
            const description = "BigCommerce"

            // Client details
            const firstName = checkoutData.billingAddress?.firstName
            const lastName = checkoutData.billingAddress?.lastName
            const email = checkoutData.billingAddress?.email
            const address = checkoutData.billingAddress?.address1
            const phone = checkoutData.billingAddress?.phone
            const city = checkoutData.billingAddress?.city
            const countryCode = checkoutData.billingAddress?.countryCode

            // Add Culqi public key
            window.Culqi.publicKey = process.env.REACT_APP_CULQI_PK;

            // Define order data
            const orderData = {
                amount,
                currency_code: currency,
                description,
                order_number: generateUniqueID(),
                creation_date: creationDate,
                expiration_date: expirationDate,
                client_details: {
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone_number: phone,
                },
                confirm: false
            };

            // Define order options
            const sk = process.env.REACT_APP_CULQI_SK
            const orderOptions = {
                method: 'POST', // or 'GET', 'PUT', etc.
                headers: {
                    'Authorization': `Bearer ${sk}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData) // body data type must match "Content-Type" header
            };

            // Create order
            const createOrderUrl = 'https://api.culqi.com/v2/orders'
            fetch(createOrderUrl, orderOptions)
                .then(response => response.json()) // assuming the response is in JSON format
                .then(data => {
                    console.log('data.id:', data.id);
                    // Checkout settings
                    window.Culqi.settings({
                        title,
                        currency,  // Este parámetro es requerido para realizar pagos yape
                        amount,  // Este parámetro es requerido para realizar pagos yape
                        order: data.id //, // Este parámetro es requerido para realizar pagos con pagoEfectivo, billeteras y Cuotéalo
                        // xculqirsaid: xculqirsaid, //'sk_test_kW32mQUjBB3KnfUD',
                        // rsapublickey: rsapublickey //'pk_test_986ab1b486ddd58f',
                    });
                    // Checkout options
                    window.Culqi.options({
                        lang: "auto",
                        installments: false, // Habilitar o deshabilitar el campo de cuotas
                        paymentMethods: {
                            tarjeta: true,
                            yape: true,
                            bancaMovil: true,
                            agente: true,
                            billetera: true,
                            cuotealo: true,
                        }
                    });
                    // Define culqi funtion
                    function culqi() {
                        const Culqi = window.Culqi;
                        if (Culqi.token) {  // ¡Objeto Token creado exitosamente!

                            console.log('Se ha creado un Token: ', Culqi.token);
                            // En esta línea de código, debes enviar el "Culqi.token.id"
                            // hacia tu servidor con Ajax
                            {
                                const data = JSON.stringify({
                                    "amount": amount,
                                    "currency_code": "PEN",
                                    "email": email,
                                    "source_id": Culqi.token.id,
                                    "capture": true,
                                    "description": description,
                                    "installments": 0,
                                    "antifraud_details": {
                                        "address": address,
                                        "address_city": city,
                                        "country_code": countryCode,
                                        "first_name": firstName,
                                        "last_name": lastName,
                                        "phone_number": phone
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
                            }

                        } else if (Culqi.order) {  // ¡Objeto Order creado exitosamente!

                            const order = Culqi.order;
                            console.log('Se ha creado el objeto Order: ', order);

                        } else {

                            // Mostramos JSON de objeto error en la consola
                            console.log('Error : ', Culqi.error);

                        }
                    };
                    // Add the culqi function 
                    window.culqi = culqi;
                })
                .catch(error => console.error(`ERROR ${createOrderUrl}:`, error));
        }
        else {
            console.log('ERROR: CheckoutData is undefined');
        }
    }

    useEffect(() => {
        // Include Culqi Checkout
        const script = document.createElement('script');
        script.src = "https://checkout.culqi.com/js/v4";
        script.async = true;
        script.onload = onCulqiLoad;

        // Add script to the body
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [checkoutData]);

    const handleClick = () => {
        if (window.Culqi) {
            window.Culqi.open()
        }
    }

    return (
        <button
            id="btn_pagar"
            className="button button--action button--large button--slab optimizedCheckout-buttonPrimary "
            onClick={handleClick}
            type="button">
            PLACE ORDER WITH CULQI
        </button>
    );
};

export default CulqiButtonUseWindow;

