document.addEventListener('DOMContentLoaded', function() {
    const cityForm = document.getElementById('city');
    const weatherDisplay = document.getElementById('weaterCity');
    const deleteButton = document.getElementById('deleteButton');
    const apiKey = '4288a9190afbd0f09ef19578b5e03910';

    // Ciudades por defecto
    const defaultCities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    // Recuperar ciudades almacenadas del localStorage o iniciar con un arreglo vacío
    let storedCities = JSON.parse(localStorage.getItem('cities')) || [];

    // Función para mostrar las temperaturas de las ciudades
    function displayCities() {
        weatherDisplay.innerHTML = ''; // Limpiar la visualización

        // Mantener la ciudad recién agregada al inicio y ordenar solo las ciudades por defecto
        const allCities = [...storedCities, ...defaultCities.sort()];

        allCities.forEach(city => {
            const cityDiv = document.createElement('div');
            const temperature = localStorage.getItem(city);
            if (temperature) {
                cityDiv.textContent = `La temperatura en ${city} es ${temperature} °C`;
            } else {
                cityDiv.textContent = `No se pudo obtener la temperatura para ${city}`;
            }
            weatherDisplay.appendChild(cityDiv);
        });

        // Ocultar o mostrar el formulario según si hay ciudades almacenadas
        if (storedCities.length > 0) {
            cityForm.style.display = 'none'; // Ocultar formulario si hay ciudades guardadas
        } else {
            cityForm.style.display = 'block'; // Mostrar formulario si no hay ciudades
        }
    }

    // Función para obtener la temperatura de cada ciudad por defecto
    function initializeWeather() {
        defaultCities.forEach(city => {
            getWeather(city); // Obtener la temperatura para cada ciudad por defecto
        });
    }

    initializeWeather(); // Obtener temperaturas de las ciudades por defecto al cargar

    // Manejar el formulario de búsqueda
    cityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const inputCity = document.getElementById('inputWeaterCity').value; // Obtener el valor del input
        if (inputCity) {
            addCity(inputCity); // Llamar a la función para agregar ciudad
        }
    });

    // Función para agregar ciudad
    function addCity(city) {
        // Verificar que la ciudad no esté ya en la lista
        if (!storedCities.includes(city) && !defaultCities.includes(city)) {
            storedCities.unshift(city); // Agregar ciudad al inicio del arreglo
            localStorage.setItem('cities', JSON.stringify(storedCities)); // Guardar en localStorage
            displayCities(); // Actualizar la visualización inmediatamente
            getWeather(city); // Obtener la temperatura
        } else {
            alert('La ciudad ya está en la lista.');
        }
    }

    deleteButton.addEventListener('click', function() {
        localStorage.removeItem('cities'); // Eliminar solo las ciudades personalizadas
        weatherDisplay.innerHTML = ''; // Limpiar la vista
        storedCities = []; // Limpiar el arreglo de ciudades
        displayCities(); // Mostrar ciudades por defecto nuevamente
    });

    // Función para obtener la temperatura de la ciudad
    function getWeather(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`) // Agregar &units=metric para Celsius
        .then(response => response.json())
        .then(data => {
            if (data.main && data.main.temp) {
                const temperature = data.main.temp;
                localStorage.setItem(city, temperature); // Guardar temperatura en localStorage
                displayCities(); // Actualizar la visualización aquí
            } else {
                console.error('No se pudo obtener la temperatura para la ciudad:', city);
                displayCities(); // Asegurarse de que las ciudades se muestren incluso si no se obtuvo la temperatura
            }
        })
        .catch(error => {
            console.error('Error al llamar la API', error);
            weatherDisplay.textContent = 'Error al obtener los datos';
        });
    }

    // Llamar a displayCities inicialmente para mostrar ciudades y ocultar formulario si corresponde
    displayCities();
});
