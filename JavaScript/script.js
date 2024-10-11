document.addEventListener('DOMContentLoaded', function() {
    const cityForm = document.getElementById('city');
    const weatherDisplay = document.getElementById('weaterCity');
    const deleteButton = document.getElementById('deleteButton');
    const defaultCityInput = document.getElementById('defaultCityInput'); // Referencia al input para ciudad por defecto
    const addCityButton = document.getElementById('addCityButton'); // Referencia al botón para agregar ciudad
    const apiKey = '4288a9190afbd0f09ef19578b5e03910';

    // Recuperar ciudades por defecto del localStorage o iniciar con un arreglo vacío
    let defaultCities = JSON.parse(localStorage.getItem('defaultCities')) || ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    // Recuperar ciudades almacenadas del localStorage o iniciar con un arreglo vacío
    let storedCities = JSON.parse(localStorage.getItem('cities')) || [];

    // Función para mostrar las temperaturas de las ciudades
    function displayCities() {
        weatherDisplay.innerHTML = ''; // Limpiar la visualización

        // Ordenar ciudades por defecto cada vez que se muestran
        const sortedDefaultCities = defaultCities.sort();
        // Mantener la ciudad recién agregada al inicio y combinar con ciudades por defecto
        const allCities = [...storedCities, ...sortedDefaultCities];

        // Mostrar temperaturas de todas las ciudades
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

        // Mostrar la ciudad más caliente
        showHottestCity();

        // Mostrar u ocultar el input y botón de agregar ciudad por defecto
        if (storedCities.length > 0) {
            defaultCityInput.style.display = 'block'; // Mostrar campo de entrada
            addCityButton.style.display = 'block'; // Mostrar botón de agregar ciudad
            cityForm.style.display = 'none'; // Ocultar el formulario de búsqueda
        } else {
            defaultCityInput.style.display = 'none'; // Ocultar campo de entrada
            addCityButton.style.display = 'none'; // Ocultar botón de agregar ciudad
            cityForm.style.display = 'block'; // Mostrar formulario si no hay ciudades
        }

        // Mostrar u ocultar el botón de eliminar dependiendo de si hay ciudades almacenadas
        if (storedCities.length === 0) {
            deleteButton.style.display = 'none'; // Ocultar el botón si no hay ciudades almacenadas
        } else {
            deleteButton.style.display = 'block'; // Mostrar el botón si hay ciudades
        }
    }

    // Función para mostrar la ciudad más caliente entre las ciudades por defecto
    function showHottestCity() {
        let hottestCity = null;
        let highestTemperature = -Infinity;
    
        defaultCities.forEach(city => {
            const temperature = parseFloat(localStorage.getItem(city));
            if (temperature !== null && temperature > highestTemperature) {
                highestTemperature = temperature;
                hottestCity = city;
            }
        });
    
        const hottestCityDiv = document.createElement('div');
        if (hottestCity) {
            // Crear la tarjeta Bootstrap con un degradado
            hottestCityDiv.innerHTML = `
 <div class="card text-white mb-3 steam-card" style="max-width: 18rem; background: linear-gradient(to bottom, rgba(255, 99, 71, 0.9), rgba(255, 165, 0, 0.8)); position: relative;">
            <div class="card-header">Ciudad más caliente</div>
            <div class="card-body">
                <h5 class="card-title">
                    <i class="fas fa-sun" style="color: yellow;"></i> ${hottestCity}
                </h5>
                <p class="card-text">La temperatura es ${highestTemperature} °C</p>
            </div>
            <div class="steam"></div>
        </div>
            `;
        } else {
            hottestCityDiv.textContent = `No se pudo determinar la ciudad más caliente.`;
        }
    
        weatherDisplay.appendChild(hottestCityDiv);
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
        const inputCity = document.getElementById('inputWeaterCity').value.trim(); // Obtener el valor del input
        if (inputCity) {
            addCity(inputCity); // Llamar a la función para agregar ciudad
            document.getElementById('inputWeaterCity').value = ''; // Limpiar el campo de entrada
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

            // Ocultar el formulario de búsqueda si es la primera ciudad que se agrega
            if (storedCities.length === 1) {
                cityForm.style.display = 'none'; // Ocultar formulario de búsqueda
            }
        } else {
            alert('La ciudad ya está en la lista.');
        }
    }

    // Manejar el botón para agregar ciudades por defecto
    addCityButton.addEventListener('click', function() {
        const defaultCity = defaultCityInput.value.trim(); // Obtener la ciudad del input
        if (defaultCity && !defaultCities.includes(defaultCity) && !storedCities.includes(defaultCity)) {
            defaultCities.push(defaultCity); // Agregar ciudad a la lista de ciudades por defecto
            defaultCities.sort(); // Ordenar ciudades por defecto alfabéticamente
            localStorage.setItem('defaultCities', JSON.stringify(defaultCities)); // Guardar en localStorage
            defaultCityInput.value = ''; // Limpiar el campo de entrada
            displayCities(); // Actualizar la visualización
            getWeather(defaultCity); // Obtener la temperatura para la nueva ciudad
        } else {
            alert('La ciudad ya está en la lista o es inválida.');
        }
    });

    // Eliminar ciudades almacenadas
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
