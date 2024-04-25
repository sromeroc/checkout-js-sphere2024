import { Checkout } from "@bigcommerce/checkout-sdk";
declare var Culqi: any;

export const setupCheckout = (checkoutData: Checkout | undefined) => {
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