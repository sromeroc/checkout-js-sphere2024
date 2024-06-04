import { Checkout } from '@bigcommerce/checkout-sdk';
import axios from 'axios';

const createOrderWithAPI = async (checkoutData: Checkout | undefined) => {

    if (!checkoutData)
        throw new Error(`Error creating order: checkoutData is undefined`)

    // Checkout data
    // const amount = Math.floor(checkoutData.grandTotal * 100)
    // const createdTime = new Date(checkoutData.cart.createdTime)
    // const creationDate = createdTime.getTime() / 1000;
    // const expirationDate = createdTime.setFullYear(createdTime.getFullYear() + 1) / 1000
    // const currency = checkoutData.cart.currency.code
    // const title = 'Tienda de Mascotas'
    // const description = "BigCommerce"

    // Client details
    const firstName = checkoutData.billingAddress?.firstName
    const lastName = checkoutData.billingAddress?.lastName
    const email = checkoutData.billingAddress?.email
    // const address = checkoutData.billingAddress?.address1
    // const phone = checkoutData.billingAddress?.phone
    const city = checkoutData.billingAddress?.city
    // const countryCode = checkoutData.billingAddress?.countryCode
    const lineItems = checkoutData.cart.lineItems.physicalItems;

    try {
        const response = await axios.post(
            'https://api.bigcommerce.com/stores/rv37bc8pui/v2/orders',
            {
                billing_address: {
                    first_name: firstName,
                    last_name: lastName,
                    street_1: city,
                    city,
                    // state,
                    // zip: values.billingAddress.zip,
                    // country: values.billingAddress.country,
                    // country_iso2: values.billingAddress.countryIso2,
                    email,
                },
                products: lineItems.map(product => ({
                    name: product.name,
                    quantity: product.quantity,
                    price_inc_tax: 10,
                    price_ex_tax: 10,
                })),
            },
            {
                headers: {
                    'X-Auth-Token': 'j11mmhwdxphf6u6senw6srsg0r2gbvt',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        );

        // Si la respuesta tiene un error, lanza una excepción
        if (response.data.errors) {
            throw new Error(response.data.errors);
        }

        // Devuelve el ID del pedido creado
        return response.data.id;
    } catch (error: any) {
        // Maneja cualquier error que ocurra durante la solicitud
        throw new Error(`Error creating order: ${error.message}`);
    }
};

export default createOrderWithAPI;