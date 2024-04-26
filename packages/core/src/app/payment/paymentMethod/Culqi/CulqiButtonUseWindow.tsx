import React, { useEffect } from "react";
import { useCheckout } from "@bigcommerce/checkout/payment-integration-api";

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
            setTimeout(() => {
                const Culqi = window.Culqi;
                Culqi.publicKey = pk;
                Culqi.init();
                Culqi.settings({
                    title: 'Tienda de Mascotas',
                    currency: 'PEN',
                    amount: checkoutData.subtotal ? checkoutData.subtotal * 100 : 600,
                });
                setTimeout(() => { }, 2000);
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

function culqi() {
    const Culqi = window.Culqi;
    if (Culqi.token) {  // ¡Objeto Token creado exitosamente!

        const token = Culqi.token.id;
        console.log('Se ha creado un Token: ', token);
        // En esta línea de código, debes enviar el "Culqi.token.id"
        // hacia tu servidor con Ajax
        {
            const data = JSON.stringify({
                "amount": 2360,
                "currency_code": "PEN",
                "email": "correo3@outlook.com",
                "source_id": token,
                "capture": true,
                "description": "Prueba",
                "installments": 0,
                "metadata": {
                    "dni": "09928494"
                },
                "antifraud_details": {
                    "address": "Avenida Lima 213",
                    "address_city": "Lima",
                    "country_code": "PE",
                    "first_name": "Sandrox",
                    "last_name": "Romero",
                    "phone_number": "968272374"
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
            xhr.setRequestHeader("Authorization", `Bearer sk_test_kW32mQUjBB3KnfUD`);
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

export default CulqiButtonUseWindow;

