// import { PaymentFormValues } from "@bigcommerce/checkout/payment-integration-api";
import { useCheckout } from "@bigcommerce/checkout/payment-integration-api";

declare global {
    interface Window {
        Culqi: any;
        culqi: any; // Generated-order handler 
    }
}

const culqi = () => {
    const Culqi = window.Culqi;
    if (Culqi.token) {  // ¡Objeto Token creado exitosamente!

        console.log('Se ha creado un Token: ', Culqi.token);

        // TODO: Create charge

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
    const culqiSecretKey = "sk_test_kW32mQUjBB3KnfUD"
    window.culqi = culqi
    const createOrderUrl = 'https://api.culqi.com/v2/orders'

    const { checkoutState } = useCheckout();
    const checkoutData = checkoutState.data.getCheckout()

    console.log('checkoutData onCulqiLoad:', checkoutData);
    if (!checkoutData) {
        console.error('Checkout data not found');
        return;
    }

    // Generate metadata

    const cartCreationDate = new Date(checkoutData.cart.createdTime)
    const orderMetadata = {
        amount: Math.floor(checkoutData.grandTotal * 100),
        creationDate: cartCreationDate.getTime() / 1000,
        expirationDate: cartCreationDate.setFullYear(cartCreationDate.getFullYear() + 1) / 1000,
        currencyCode: checkoutData.cart.currency.code,
        number: generateUniqueID(),
        title: 'Tienda de Mascotas',
        description: "BigCommerce",
    }

    const clientMetadata = {
        firstName: checkoutData.billingAddress?.firstName,
        lastName: checkoutData.billingAddress?.lastName,
        email: checkoutData.billingAddress?.email,
        address: checkoutData.billingAddress?.address1,
        phone: checkoutData.billingAddress?.phone,
        city: checkoutData.billingAddress?.city,
        countryCode: checkoutData.billingAddress?.countryCode,
    }

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