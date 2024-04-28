import React, { useEffect } from "react";
import { useCheckout } from "@bigcommerce/checkout/payment-integration-api";
import { generateUniqueID } from './utils'

const sk = "sk_test_kW32mQUjBB3KnfUD"
const pk = "pk_test_986ab1b486ddd58f"
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
    console.log('Checkout data: ', checkoutData);

    // Integrate Culqi Checkout
    useEffect(() => {
        if (checkoutData) {
            // Create script
            const script = document.createElement('script');
            script.src = "https://checkout.culqi.com/js/v4";

            // Checkout data
            const amount = checkoutData.grandTotal * 100
            const createdTime = new Date(checkoutData.cart.createdTime)
            const creationDate = createdTime.getTime() / 1000;
            const expirationDate = createdTime.setFullYear(createdTime.getFullYear() + 1) / 1000
            const currency = checkoutData.cart.currency.code
            const title = 'Tienda de Mascotas'
            const description = "BigCommerce"

            // Client details
            const firstName = checkoutData.customer?.firstName
            const lastName = checkoutData.customer?.lastName
            const email = checkoutData.customer?.email
            const address = checkoutData.billingAddress?.address1
            const phone = checkoutData.customer?.addresses[0].phone
            const city = checkoutData.customer?.addresses[0].city
            const countryCode = checkoutData.customer?.addresses[0].countryCode


            setTimeout(() => {
                const Culqi = window.Culqi;
                Culqi.publicKey = pk;
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
                };
                // Define order options
                const orderOptions = {
                    method: 'POST', // or 'GET', 'PUT', etc.
                    headers: {
                        'Authorization': `Bearer ${sk}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData) // body data type must match "Content-Type" header
                };
                // Create order
                fetch('https://api.culqi.com/v2/orders', orderOptions)
                    .then(response => response.json()) // assuming the response is in JSON format
                    .then(data => {
                        console.log('data.id:', data.id);
                        // Checkout settings
                        Culqi.settings({
                            title,
                            currency,  // Este parámetro es requerido para realizar pagos yape
                            amount,  // Este parámetro es requerido para realizar pagos yape
                            order: data.id //, // Este parámetro es requerido para realizar pagos con pagoEfectivo, billeteras y Cuotéalo
                            // xculqirsaid: xculqirsaid, //'sk_test_kW32mQUjBB3KnfUD',
                            // rsapublickey: rsapublickey //'pk_test_986ab1b486ddd58f',
                        });
                        // Checkout options
                        Culqi.options({
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
                    })
                    .catch(error => console.error('Error when post order:', error));
                // Wait for 2 seconds
                setTimeout(() => { }, 2000);
                // Define culqi funtion
                function culqi() {
                    const Culqi = window.Culqi;
                    if (Culqi.token) {  // ¡Objeto Token creado exitosamente!

                        const token = Culqi.token;
                        console.log('Se ha creado un Token: ', token);
                        // En esta línea de código, debes enviar el "Culqi.token.id"
                        // hacia tu servidor con Ajax
                        {
                            const data = JSON.stringify({
                                "amount": amount.toString(),
                                "currency_code": "PEN",
                                "email": token.email,
                                "source_id": token.id,
                                "capture": true,
                                "description": description,
                                "installments": 0,
                                "metadata": {
                                    "dni": token.metadata.dni
                                },
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
            }, 2000)

            // Add script to the body
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
        else {
            console.log('ERROR at culqi: CheckoutData is undefined');
        }

    }, []);

    const handleClick = () => {
        const Culqi = window.Culqi;
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

export default CulqiButtonUseWindow;

