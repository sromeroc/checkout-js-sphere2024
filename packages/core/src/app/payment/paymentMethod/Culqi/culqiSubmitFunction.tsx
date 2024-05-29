// import { PaymentFormValues } from "@bigcommerce/checkout/payment-integration-api";
// import { useCheckout } from "@bigcommerce/checkout/payment-integration-api";
const culqiSecretKey = "sk_test_kW32mQUjBB3KnfUD"

declare global {
    interface Window {
        Culqi: any;
        culqi: any; // Generated-order handler 
    }
}

type OrderMetadata = {
    amount: number;
    creationDate: number;
    expirationDate: number;
    currencyCode: string;
    number: string;
    title: string;
    description: string;
};

type ClientMetadata = {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    city: string;
    countryCode: string;
};

const createCulqiCharge = (orderMetadata: OrderMetadata, clientMetadata: ClientMetadata) => {
    const Culqi = window.Culqi;
    if (Culqi.token) {  // ¡Objeto Token creado exitosamente!

        console.log('Se ha creado un Token: ', Culqi.token);

        // En esta línea de código, debes enviar el "Culqi.token.id"
        // hacia tu servidor con Ajax

        const data = JSON.stringify({
            "amount": orderMetadata.amount,
            "currency_code": orderMetadata.currencyCode,
            "email": clientMetadata.email,
            "source_id": Culqi.token.id,
            "capture": true,
            "description": orderMetadata.description,
            "installments": 0,
            "antifraud_details": {
                "address": clientMetadata.address,
                "address_city": clientMetadata.city,
                "country_code": orderMetadata.currencyCode,
                "first_name": clientMetadata.firstName,
                "last_name": clientMetadata.lastName,
                "phone_number": clientMetadata.phone,
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
        xhr.setRequestHeader("Authorization", `Bearer ${culqiSecretKey}`);
        xhr.setRequestHeader("content-type", "application/json");

        xhr.send(data);

    } else if (Culqi.order) {  // ¡Objeto Order creado exitosamente!

        const order = Culqi.order;
        console.log('Se ha creado el objeto Order: ', order);

    } else {

        // Mostramos JSON de objeto error en la consola
        console.log('Error : ', Culqi.error);

    }
};

const culqiSubmitFunction = () => {
    // Add Culqi Checkout
    const script = document.createElement('script');
    script.src = "https://checkout.culqi.com/js/v4";
    script.async = true;
    script.onload = () => onCulqiLoad();
    document.body.appendChild(script);

    // TODO: remove script
}

const onCulqiLoad = () => {

    // Culqi Checkout Configuration

    window.Culqi.publicKey = "pk_test_986ab1b486ddd58f";
    const createOrderUrl = 'https://api.culqi.com/v2/orders'

    // const { checkoutState } = useCheckout();
    // const checkoutData = checkoutState.data.getCheckout()
    // console.log('checkoutData onCulqiLoad:', checkoutData);

    // if (!checkoutData) {
    //     console.error('Checkout data not found');
    //     return;
    // }

    // Generate metadata

    // const cartCreationDate = new Date(checkoutData.cart.createdTime)
    const cartCreationDate = new Date()
    const orderMetadata: OrderMetadata = {
        // amount: Math.floor(checkoutData.grandTotal * 100),
        amount: Math.floor(6000),
        creationDate: cartCreationDate.getTime() / 1000,
        expirationDate: cartCreationDate.setFullYear(cartCreationDate.getFullYear() + 1) / 1000,
        // currencyCode: checkoutData.cart.currency.code,
        currencyCode: 'PEN',
        number: generateUniqueID(),
        title: 'Tienda de Mascotas',
        description: "BigCommerce",
    }

    const clientMetadata: ClientMetadata = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'luis.mesajil@sphere.com.pe',
        address: 'Jiron cabo nicolas',
        phone: '999999999',
        city: 'Lima',
        countryCode: 'PE',
        // firstName: checkoutData.billingAddress?.firstName,
        // lastName: checkoutData.billingAddress?.lastName,
        // email: checkoutData.billingAddress?.email,
        // address: checkoutData.billingAddress?.address1,
        // phone: checkoutData.billingAddress?.phone,
        // city: checkoutData.billingAddress?.city,
        // countryCode: checkoutData.billingAddress?.countryCode,
    }

    window.culqi = () => createCulqiCharge(orderMetadata, clientMetadata);

    // Create Culqi order

    const orderData = {
        amount: orderMetadata.amount,
        currency_code: orderMetadata.currencyCode,
        description: orderMetadata.description,
        order_number: orderMetadata.number,
        creation_date: orderMetadata.creationDate,
        expiration_date: orderMetadata.expirationDate,
        client_details: {
            first_name: clientMetadata.firstName,
            last_name: clientMetadata.lastName,
            email: clientMetadata.email,
            phone_number: clientMetadata.phone,
        },
        confirm: false
    };

    const orderOptions = {
        method: 'POST', // or 'GET', 'PUT', etc.
        headers: {
            'Authorization': `Bearer ${culqiSecretKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData) // body data type must match "Content-Type" header
    };

    fetch(createOrderUrl, orderOptions)
        .then(response => response.json()) // assuming the response is in JSON format
        .then(data => {
            console.log('data.id:', data.id);

            // Checkout settings
            window.Culqi.settings({
                title: orderMetadata.title,
                currency: orderMetadata.currencyCode,  // Este parámetro es requerido para realizar pagos yape
                amount: orderMetadata.amount,  // Este parámetro es requerido para realizar pagos yape
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

            // Show culqi checkout

            if (window.Culqi) {
                window.Culqi.open()
            }
            else {
                console.error('Culqi not loaded');
            }
        })
        .catch(error => console.error('Error at creating Culqi order:', error));
}

const generateUniqueID = () => {
    const currentDate = new Date();
    const milliseconds = currentDate.getTime();
    const uniqueIdentifier = milliseconds.toString();
    return uniqueIdentifier;
}

export default culqiSubmitFunction;