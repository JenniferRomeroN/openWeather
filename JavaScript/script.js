document.addEventListener('DOMContentLoaded', function() {
    const cityForm = document.getElementById('city');
    const weatherDisplay = document.getElementById('weaterCity');
    const deleteButton = document.getElementById('deleteButton');
    const defaultCityInput = document.getElementById('defaultCityInput');
    const addCityButton = document.getElementById('addCityButton');
    const apiKey = '4288a9190afbd0f09ef19578b5e03910';

    let defaultCities = JSON.parse(localStorage.getItem('defaultCities')) || ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    let storedCities = JSON.parse(localStorage.getItem('cities')) || [];
    let welcomeMessageShown = false;

    function getWeatherCardStyle(weatherCondition) {
        switch (weatherCondition) {
            case 'Clear':
                return { 
                    style: 'background: linear-gradient(to bottom, rgba(135, 206, 250, 0.9), rgba(135, 206, 250, 0.5));', 
                    animationClass: 'float'
                };
            case 'Clouds':
                return { 
                    style: 'background: linear-gradient(to bottom, rgba(169, 169, 169, 0.9), rgba(169, 169, 169, 0.5));', 
                    animationClass: 'move-clouds'
                };
            case 'Rain':
                return { 
                    style: 'background: linear-gradient(to bottom, rgba(0, 0, 255, 0.9), rgba(0, 0, 255, 0.5));', 
                    animationClass: ''
                };
            case 'Snow':
                return { 
                    style: 'background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.5));', 
                    animationClass: ''
                };
            default:
                return { 
                    style: 'background: linear-gradient(to bottom, rgba(128, 128, 128, 0.9), rgba(128, 128, 128, 0.5));', 
                    animationClass: ''
                };
        }
    }

    function displayCities() {
        weatherDisplay.innerHTML = '';
        const sortedDefaultCities = defaultCities.sort();
        const allCities = [...storedCities, ...sortedDefaultCities];

        allCities.forEach(city => {
            const cityData = JSON.parse(localStorage.getItem(city));
            const cityDiv = document.createElement('div');
            if (cityData) {
                const temperature = cityData.temperature;
                const weatherCondition = cityData.weatherCondition;
                const iconCode = cityData.icon;  // Obtén el código del icono de la API
                const { style, animationClass } = getWeatherCardStyle(weatherCondition);
                
                // La URL del icono
                const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

                cityDiv.innerHTML = `
                    <div class="card text-white mb-3 ${animationClass}" style="max-width: 18rem; ${style}">
                        <div class="card-body">
                            <h5 class="card-title">
                                ${city} 
                                <i class="fas fa-trash-alt delete-city-icon" data-city="${city}" style="cursor: pointer; float: right;"></i>
                            </h5>
                            <p class="card-text">${temperature} °C</p>
                            <img src="${iconUrl}" alt="${weatherCondition}" style="width: 50px; height: 50px;"> <!-- Muestra la imagen obtenida de la API -->
                        </div>
                    </div>
                `;
            } else {
                cityDiv.textContent = `No se pudo obtener la temperatura para ${city}`;
            }
            weatherDisplay.appendChild(cityDiv);
        });

        showHottestCity();

        if (storedCities.length > 0) {
            defaultCityInput.style.display = 'block';
            addCityButton.style.display = 'block';
            cityForm.style.display = 'none';
        } else {
            defaultCityInput.style.display = 'none';
            addCityButton.style.display = 'none';
            cityForm.style.display = 'flex';
        }

        if (storedCities.length === 0) {
            deleteButton.style.display = 'none';
        } else {
            deleteButton.style.display = 'block';
        }
    }

    function showHottestCity() {
        let hottestCity = null;
        let highestTemperature = -Infinity;
        let hottestWeatherCondition = '';

        const allCities = [...defaultCities, ...storedCities];

        allCities.forEach(city => {
            const cityData = JSON.parse(localStorage.getItem(city));
            if (cityData) {
                const temperature = parseFloat(cityData.temperature);
                const weatherCondition = cityData.weatherCondition;
                if (temperature > highestTemperature) {
                    highestTemperature = temperature;
                    hottestCity = city;
                    hottestWeatherCondition = weatherCondition;
                }
            }
        });

        const hottestCityDiv = document.createElement('div');
        if (hottestCity) {
            const weatherStyle = getWeatherCardStyle(hottestWeatherCondition);
            hottestCityDiv.innerHTML = `
            <div class="card text-white mb-3 steam-card" style="max-width: 18rem; background: linear-gradient(to bottom, rgba(255, 99, 71, 0.9), rgba(255, 165, 0, 0.8)); position: relative;">
                <div class="card-header">Ciudad más caliente</div>
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

    function initializeWeather() {
        defaultCities.forEach(city => {
            getWeather(city);
        });
    }

    initializeWeather();

    cityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const inputCity = document.getElementById('inputWeaterCity').value.trim();
        if (inputCity) {
            addCity(inputCity);
            document.getElementById('inputWeaterCity').value = '';
        }
    });

    function addCity(city) {
        if (!storedCities.includes(city) && !defaultCities.includes(city)) {
            getWeather(city)
                .then(() => {
                    storedCities.unshift(city);
                    localStorage.setItem('cities', JSON.stringify(storedCities));
                    displayCities();
                    
                    if (!welcomeMessageShown) {
                        const cityData = JSON.parse(localStorage.getItem(city));
                        const cityDiv = document.createElement('div');
                        const { style, animationClass } = getWeatherCardStyle(cityData.weatherCondition);
                        const iconUrl = `http://openweathermap.org/img/wn/${cityData.icon}@2x.png`;
                        cityDiv.innerHTML = `
                            <div class="card text-white mb-3 ${animationClass}" style="max-width: 18rem; ${style}">
                                <div class="card-body">
                                    <h5 class="card-title">¡Bienvenid@ a la aplicación del clima!</h5>
                                    <p class="card-text">El clima en ${city} es de ${cityData.temperature} °C.</p>
                                    <img src="${iconUrl}" alt="${cityData.weatherCondition}" style="width: 50px; height: 50px;"> <!-- Imagen bienvenida -->
                                </div>
                            </div>
                        `;
                        weatherDisplay.prepend(cityDiv);
                        welcomeMessageShown = true;
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

    addCityButton.addEventListener('click', function() {
        const defaultCity = defaultCityInput.value.trim();
        if (defaultCity && !defaultCities.includes(defaultCity) && !storedCities.includes(defaultCity)) {
            defaultCities.push(defaultCity);
            defaultCities.sort();
            localStorage.setItem('defaultCities', JSON.stringify(defaultCities));
            defaultCityInput.value = '';
            displayCities();
            getWeather(defaultCity);
        } else {
            alert('La ciudad ya está en la lista o es inválida.');
        }
    });

    function getWeather(city) {
        return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                if (data.main && data.main.temp) {
                    const temperature = data.main.temp;
                    const weatherCondition = data.weather[0].main;
                    const icon = data.weather[0].icon; // Icono del clima
                    localStorage.setItem(city, JSON.stringify({ temperature, weatherCondition, icon }));
                } else {
                    console.error('No se pudo obtener la temperatura para la ciudad:', city);
                }
            })
            .catch(error => {
                console.error('Error al llamar la API', error);
            });
    }

    deleteButton.addEventListener('click', function() {
        localStorage.removeItem('cities');
        storedCities = [];
        welcomeMessageShown = false;
        displayCities();
    });

    displayCities();
});
