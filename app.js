const KEY = 'c19e82453bc0307a83bf6faa72335c8e';
const CELSIUS = 'celsius';
const FAHRENHEIT = 'fahrenheit';
const KELVIN = 273.15;

const clickable = document.querySelector('.degree-section');
const timezoneEl = document.querySelector('.location-B');
const iconEl = document.querySelector('.image');
const descriptionEl = document.querySelector('.temperature-description');
const temperatureEl = document.querySelector('.temperature-degree');



const weather = {
	temperature: {
		value: undefined,
		unit: CELSIUS,
	},
	city: '',
	country: '',
	description: '',
	iconId: '',
};

const displayWeather = () => {
	timezoneEl.innerHTML = `${weather.city}, ${weather.country}`;
	iconEl.innerHTML = `<img src = "icons/${weather.iconId}.png">`;
	descriptionEl.innerHTML = weather.description;
	temperatureEl.innerHTML = `${weather.temperature.value} ° <span> C </span> `;
};

const getLocationHandler = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const location = {
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				};

				fetchData(location);
			},
			(error) => {
				weather.description =
					'Could not get location - please allow the geolocation retrieval';
			}
		);
	} else {
		weather.description =
			'Could not get location - please allow the geolocation retrieval';
	}
};

const fetchData = (location) => {
	// const proxy = `https://cors-anywhere.herokuapp.com/`;
	const api = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${KEY}`;

	fetch(api)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			console.log(data);
			weather.temperature.value = Math.floor(data.main.temp - KELVIN);
			weather.description = data.weather[0].description;
			weather.city = data.name;
			weather.iconId = data.weather[0].icon;
			weather.country = data.sys.country;
		})
		.then(() => {
			displayWeather();
		});
};

const convertToFahrenheit = (temperature) => {
	return (temperature * 9) / 2 + 32;
};

const toggleTemperHandler = () => {
	if (weather.temperature.unit === undefined) {
		return;
	}
	if (weather.temperature.unit === CELSIUS) {
		let fahrenheit = convertToFahrenheit(weather.temperature.value);
		fahrenheit = Math.floor(fahrenheit);
		temperatureEl.innerHTML = `${fahrenheit} ° <span> F </span> `;
    weather.temperature.unit = FAHRENHEIT;
  } else {
    temperatureEl.innerHTML = `${weather.temperature.value} ° <span> C </span> `;
    weather.temperature.unit = CELSIUS;
  }

}
  
  

window.addEventListener('load', getLocationHandler);
clickable.addEventListener('click', toggleTemperHandler);

