// Este archivo maneja la lógica de envío del formulario de contacto

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío por defecto del formulario

        const formData = new FormData(form);
        const data = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            telefono: formData.get('telefono'),
            asunto: formData.get('asunto') || 'Consulta desde web',
            mensaje: formData.get('mensaje')
        };

        // Mostrar mensaje de carga
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        // Intentar enviar al backend primero (si está disponible)
        // Detectar si estamos en red local o localhost
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isLocalNetwork = window.location.hostname.startsWith('192.168.');
        
        let backendUrl;
        if (isLocalhost) {
            backendUrl = 'http://localhost:5000/api/contactos';
        } else if (isLocalNetwork) {
            backendUrl = 'http://192.168.0.210:5000/api/contactos';
        } else {
            backendUrl = 'https://alarmas-centauro-backend.onrender.com/api/contactos';
        }
        
        // Aumentar timeout a 30 segundos para dar tiempo a Render
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            signal: controller.signal
        })
        .then(response => {
            clearTimeout(timeoutId);
            if (response.ok) {
                // Redirigir a la página de agradecimiento
                window.location.href = 'gracias.html';
            } else {
                throw new Error('Error al enviar el mensaje');
            }
        })
        .catch(error => {
            clearTimeout(timeoutId);
            // Mostrar error más claro
            if (error.name === 'AbortError') {
                alert('⏱️ El servidor está tardando demasiado. Por favor, inténtalo de nuevo en unos segundos.');
            } else {
                alert('❌ No se pudo conectar con el servidor. Por favor, contáctanos por teléfono al +34 667 942 136 o email: alarmascentauro1@gmail.com');
            }
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    });
});