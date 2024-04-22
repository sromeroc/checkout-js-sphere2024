import { Checkout } from '@bigcommerce/checkout-sdk'
declare var Culqi: any;
const script = document.createElement('script');

const CulqiProcessPayment = (checkoutData: Checkout | undefined) => {
    script.src = 'https://checkout.culqi.com/js/v4';
    script.async = true;

    // Obtenemos el amount
    // const grandTotalString = localStorage.getItem('grandtotal');
    if (checkoutData) {
        let amount = checkoutData.subtotal * 100;
        script.onload = () => {
            const publicKey = 'pk_test_986ab1b486ddd58f';

            Culqi.publicKey = publicKey;

            const url = 'https://api.culqi.com/v2/orders';
            const token = 'Bearer sk_test_kW32mQUjBB3KnfUD';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    currency_code: 'PEN',
                    description: 'Venta de polo',
                    order_number: checkoutData.orderId?.toString(),
                    expiration_date: '1731019303',
                    client_details: {
                        first_name: 'Sandro',
                        last_name: 'Romero',
                        email: 'sandro30@outlook.com',
                        phone_number: '968272374',
                    },
                    confirm: false,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('data.id: ' + data.id);
                    Culqi.settings({
                        title: 'Culqi Store',
                        currency: 'PEN',
                        amount,
                        order: data.id,
                    });
                })
                .catch(error => console.error('Error:', error));

            Culqi.options({
                lang: 'auto',
                installments: false,
                paymentMethods: {
                    tarjeta: true,
                    yape: true,
                    bancaMovil: true,
                    agente: true,
                    billetera: true,
                    cuotealo: true,
                },
                style: {
                    logo: 'http://sphere.com.pe/wp-content/uploads/2023/10/1_310x-1.webp',
                },
            });
        };

        document.head.appendChild(script);
    }
    else {
        console.log('ERROR: CheckoutData is undefined');
    }
}

const culqi = (checkoutData2: Checkout | undefined) => {
    if (checkoutData2) {
        let amount = checkoutData2.subtotal * 100;

        if ( Culqi.token ) {  // ¡Objeto Token creado exitosamente!

            const token = Culqi.token.id;
            console.log( 'Se ha creado un Token: ', token );
            // En esta línea de código, debes enviar el "Culqi.token.id"
            // hacia tu servidor con Ajax
            {
                const data = JSON.stringify({
                    amount,
                    "currency_code": "PEN",
                    "email": "tiendaMascota@outlook.com",
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
                        "first_name": "Sandro2",
                        "last_name": "Romero",
                        "phone_number": "911111111"
                    }
                });

                //var XMLHttpRequest = require('xhr2');
                const xhr = new XMLHttpRequest();
                xhr.withCredentials = false;

                xhr.addEventListener( "readystatechange", function () {
                    if ( this.readyState === this.DONE ) {
                    console.log( this.responseText );
                    }
                });
                
                console.log( 'Antes del cargo' );
                console.log( 'Data: ', data );
                console.log( 'Despues del cargo' );

                xhr.open( "POST", "https://api.culqi.com/v2/charges" );
                xhr.setRequestHeader( "Authorization", "Bearer sk_test_kW32mQUjBB3KnfUD" );
                xhr.setRequestHeader( "content-type", "application/json" );
                
                xhr.send( data );
            }   

        } else if (Culqi.order) {  // ¡Objeto Order creado exitosamente!

            const order = Culqi.order;
            console.log('Se ha creado el objeto Order: ', order);

        } else {

            // Mostramos JSON de objeto error en la consola
            console.log('Error : ', Culqi.error);

        }
    }
}

export const openCulqi = () => Culqi.open();

export const closeCulqi = () => document.head.removeChild(script);

// export OrdenCulqi;

export default CulqiProcessPayment;
export { culqi }