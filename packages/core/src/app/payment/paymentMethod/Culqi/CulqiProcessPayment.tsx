

declare var Culqi: any;
const script = document.createElement('script');

const CulqiProcessPayment = () => {
    script.src = 'https://checkout.culqi.com/js/v4';
    script.async = true;
    
    // Obtenemos el amount
    let amount = 600
    const grandTotalString = localStorage.getItem('grandtotal');
    if (grandTotalString !== null) {
        amount = parseFloat(grandTotalString) * 100;
    }

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
                order_number: '3007',
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


export const openCulqi = () => Culqi.open();

export const closeCulqi = () => document.head.removeChild(script);


export default CulqiProcessPayment;