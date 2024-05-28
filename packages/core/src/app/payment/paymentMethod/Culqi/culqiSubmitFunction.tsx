import { PaymentFormValues } from "@bigcommerce/checkout/payment-integration-api";

declare global {
    interface Window {
        Culqi: any;
        culqi: any; // Generated-order handler 
    }
}

window.Culqi.publicKey = "pk_test_986ab1b486ddd58f";
// const culqiSecretKey = "sk_test_kW32mQUjBB3KnfUD"

window.culqi = () => {
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

const culqiSubmitFunction = (values: PaymentFormValues) => {
    // Add Culqi Checkout
    const script = document.createElement('script');
    script.src = "https://checkout.culqi.com/js/v4";
    script.async = true;
    script.onload = () => onCulqiLoad(values);
    document.body.appendChild(script);

    // TODO: remove script
}

const onCulqiLoad = (values: PaymentFormValues) => {
    console.log('Values onCulqiLoad:', values);

    // TODO: Configure Custom Culqi Checkout to tokenize the card

    // Show culqi checkout
    if (window.Culqi) {
        window.Culqi.open()
    }
}

export default culqiSubmitFunction;