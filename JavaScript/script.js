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

    function getWeatherCardStyle(weatherCondition) {
        switch (weatherCondition) {
            case 'Clear':
                return { 
                    style: 'background: linear-gradient(to bottom, rgba(135, 206, 250, 0.9), rgba(135, 206, 250, 0.5));', 
                    animationClass: 'float' 
                }; // Soleado
            case 'Clouds':
                return { 
                    style: 'background: linear-gradient(to bottom, rgba(169, 169, 169, 0.9), rgba(169, 169, 169, 0.5));', 
                    animationClass: 'move-clouds' 
                }; // Nublado
            case 'Rain':
                return { 
                    style: 'background: linear-gradient(to bottom, rgba(0, 0, 255, 0.9), rgba(0, 0, 255, 0.5));', 
                    animationClass: '' 
                }; // Lluvioso
            case 'Snow':
                return { 
                    style: 'background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.5));', 
                    animationClass: '' 
                }; // Nevado
            default:
                return { 
                    style: 'background: linear-gradient(to bottom, rgba(128, 128, 128, 0.9), rgba(128, 128, 128, 0.5));', 
                    animationClass: '' 
                }; // Desconocido
        }
    }
    // Función para mostrar las temperaturas de las ciudades
    function displayCities() {
        weatherDisplay.innerHTML = ''; // Limpiar la visualización
        const sortedDefaultCities = defaultCities.sort();
        const allCities = [...storedCities, ...sortedDefaultCities];

        allCities.forEach(city => {
            const cityData = JSON.parse(localStorage.getItem(city));
            const cityDiv = document.createElement('div');
            if (cityData) {
                const temperature = cityData.temperature;
                const weatherCondition = cityData.weatherCondition;
                const { style, animationClass } = getWeatherCardStyle(weatherCondition); // Obtener estilo y clase de animación
                cityDiv.innerHTML = `
                    <div class="card text-white mb-3 ${animationClass}" style="max-width: 18rem; ${style}">
                        <div class="card-body">
                            <h5 class="card-title">${city}</h5>
                            <p class="card-text">${temperature} °C</p>
                        </div>
                    </div>
                `;
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
            cityForm.style.display = 'flex'; // Mostrar formulario si no hay ciudades
        }

        // Mostrar u ocultar el botón de eliminar dependiendo de si hay ciudades almacenadas
        if (storedCities.length === 0) {
            deleteButton.style.display = 'none'; // Ocultar el botón si no hay ciudades almacenadas
        } else {
            deleteButton.style.display = 'block'; // Mostrar el botón si hay ciudades
        }
    }

    
    // Función para mostrar la ciudad más caliente entre todas las ciudades (por defecto y agregadas)
function showHottestCity() {
    let hottestCity = null;
    let highestTemperature = -Infinity;
    let hottestWeatherCondition = ''; // Variable para almacenar el estado del clima

    // Combinar defaultCities y storedCities en una sola lista
    const allCities = [...defaultCities, ...storedCities];

    // Recorrer todas las ciudades (tanto las por defecto como las agregadas)
    allCities.forEach(city => {
        const cityData = JSON.parse(localStorage.getItem(city));
        if (cityData) {
            const temperature = parseFloat(cityData.temperature);
            const weatherCondition = cityData.weatherCondition; // Obtener el estado del clima
            if (temperature > highestTemperature) {
                highestTemperature = temperature;
                hottestCity = city;
                hottestWeatherCondition = weatherCondition; // Actualizar el estado del clima más caliente
            }
        }
    });

    const hottestCityDiv = document.createElement('div');
    if (hottestCity) {
        // Obtener el estilo del clima
        const weatherStyle = getWeatherCardStyle(hottestWeatherCondition);
        
        // Crear la tarjeta Bootstrap con el degradado
        hottestCityDiv.innerHTML = `
        <div class="card text-white mb-3 steam-card" style="max-width: 18rem; background: linear-gradient(to bottom, rgba(255, 99, 71, 0.9), rgba(255, 165, 0, 0.8)); position: relative;">
            <div class="card-header">Hottest City</div>
                <div class="card-body">
                    <h5 class="card-title">
                        <i class="fas fa-sun" style="color: yellow;"></i> ${hottestCity}
                    </h5>
                    <p class="card-text"> ${highestTemperature} °C</p>
                </div>
            <div class="steam"></div>
        </div>
        `;
    } else {
        hottestCityDiv.textContent = 'No se pudo determinar la ciudad más caliente.';
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
            getWeather(city) // Obtener la temperatura y luego actualizar el almacenamiento
                .then(() => {
                    storedCities.unshift(city); // Agregar ciudad al inicio del arreglo
                    localStorage.setItem('cities', JSON.stringify(storedCities)); // Guardar en localStorage
                    displayCities(); // Actualizar la visualización después de obtener el clima

                    // Ocultar el formulario de búsqueda si es la primera ciudad que se agrega
                    if (storedCities.length === 1) {
                        cityForm.style.display = 'none'; // Ocultar formulario de búsqueda
                    }
                })
                .catch(error => {
                    console.error('Error al agregar la ciudad:', error);
                    alert('No se pudo obtener el clima para la ciudad.');
                });
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

    // Función para obtener la temperatura de la ciudad
    function getWeather(city) {
        return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`) // Agregar &units=metric para Celsius
            .then(response => response.json())
            .then(data => {
                if (data.main && data.main.temp) {
                    const temperature = data.main.temp;
                    const weatherCondition = data.weather[0].main; // Obtener el estado del clima
                    localStorage.setItem(city, JSON.stringify({ temperature, weatherCondition })); // Guardar temperatura y estado del clima en localStorage
                } else {
                    console.error('No se pudo obtener la temperatura para la ciudad:', city);
                }
            })
            .catch(error => {
                console.error('Error al llamar la API', error);
            });
    }

    // Manejar el botón de eliminar ciudades
    deleteButton.addEventListener('click', function() {
        localStorage.removeItem('cities'); // Eliminar las ciudades almacenadas en localStorage
        storedCities = []; // Vaciar el arreglo de ciudades almacenadas
        displayCities(); // Actualizar la visualización
    });

    displayCities(); // Mostrar las ciudades al cargar la página
});
