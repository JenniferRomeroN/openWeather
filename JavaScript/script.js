document.addEventListener('DOMContentLoaded', function(){
    const weatherDisplay = document.getElementById('weaterCity');  
    const apiKey = '4288a9190afbd0f09ef19578b5e03910';

    let storedCity = localStorage.getItem('city');
    
    if(storedCity){
        //si ya esta almacenada, obtenemos la temperatura
        getWeather(storedCity, apiKey);
    } else{
        //si no hay, el usuario pondra una
        const cityForm = document.getElementById('city');
        cityForm.addEventListener('submit', function(e){
            e.preventDefault();
            const inputCity = document.getElementById('inputWeaterCity').value; //obtenemos el valor del input  
            if(inputCity){
                localStorage.setItem('city', inputCity);
                //obtenemos la temperatura
                getWeather(inputCity, apiKey);
            }
        });
    }
    
function getWeather(city, apikey){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        if(data.main  && data.main.temp){
            const temperature = data.main.temp;
            //guardar en el localStorage
            localStorage.setItem('temperature', temperature);
            //mostrar la temperatura en la pagina
        weatherDisplay.innerHTML = `La temperatura en ${city} es ${temperature} °C`
        }else{
            weatherDisplay.innerHTML = `No se pudo encontrar la temperatura`
        }
    })
    .catch(error=>{
        console.error('Error al llamar la API', error);
        weatherDisplay.textContent = 'Error al obtener los datos';
    })
}
});
