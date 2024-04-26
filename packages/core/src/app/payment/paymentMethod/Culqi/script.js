const url = 'https://api.culqi.com/v2/orders';
const amount = 600

// Authorization token
const token = 'Bearer sk_test_kW32mQUjBB3KnfUD';


// The data you want to post
const data = {
    amount,
    currency_code: "PEN",
    description: "BigCommerce",
    order_number: "",
    expiration_date: "1731019303",
    client_details: {
        first_name: "Sandro",
        last_name: "Romero",
        email: "sandro30@outlook.com",
        phone_number: "968272374"
    },
    // confirm: false
    /*metadata: {
        dni: "00012347"
    }*/
};



// Options for the fetch function
const options = {
    method: 'POST', // or 'GET', 'PUT', etc.
    headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
};




fetch(url, options)
    .then( response => response.json() ) // assuming the response is in JSON format
    .then( data => { 
        console.log('data.id='+data.id);
        Culqi.settings({
            title: 'Culqi Store',
            currency: 'PEN',  // Este parámetro es requerido para realizar pagos yape
            amount,  // Este parámetro es requerido para realizar pagos yape
            order: data.id //, // Este parámetro es requerido para realizar pagos con pagoEfectivo, billeteras y Cuotéalo
            // xculqirsaid: xculqirsaid, //'sk_test_kW32mQUjBB3KnfUD',
            // rsapublickey: rsapublickey //'pk_test_986ab1b486ddd58f',
        });
    })
    .catch(error => console.error('Error:', error));
// (end fetch)




Culqi.options({
    lang: "auto",
    installments: false,
    paymentMethods: {
        tarjeta: true,
        yape: true,
        bancaMovil: true,
        agente: true,
        billetera: true,
        cuotealo: true,
    }
});



Culqi.options({
    style: {
        logo: 'http://sphere.com.pe/wp-content/uploads/2023/10/1_310x-1.webp', // https://culqi.com/LogoCulqi.png',
        bannerColor: '', // hexadecimal
        buttonBackground: '', // hexadecimal
        menuColor: '', // hexadecimal
        linksColor: '', // hexadecimal
        buttonText: '', // texto que tomará el botón
        buttonTextColor: '', // hexadecimal
        priceColor: '' // hexadecimal
    }
});





const radioCulqi = document.getElementById( 'radioCulqi' );

radioCulqi.addEventListener('change', function () {
    // Habilitar el botón "Pagar" si se selecciona "Pagar con Culqi", de lo contrario, deshabilitarlo.
    if (radioCulqi.checked) {
        btnPagar.removeAttribute('disabled');
    } else {
        btnPagar.setAttribute('disabled', 'true');
    }
});





const btnPagar = document.getElementById( 'btn_pagar' );

btn_pagar.addEventListener( 'click', function (e) {
    // Abre el formulario con la configuración en Culqi.settings y CulqiOptions
    Culqi.open();
    //crearOrden();
    culqi();
    e.preventDefault();
});





function culqi() {

    if ( Culqi.token ) {  // ¡Objeto Token creado exitosamente!

        const token = Culqi.token.id;
        console.log( 'Se ha creado un Token: ', token );
        // En esta línea de código, debes enviar el "Culqi.token.id"
        // hacia tu servidor con Ajax
        {
            const data = JSON.stringify({
                amount,
                "currency_code": "PEN",
                "email": "correo2@outlook.com",
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
};