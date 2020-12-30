import Ajax from './ajax.js';
import { ReadingEntry } from './components/readingEntry.js';

const temperatureElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');
const listElement = document.getElementById('sensor-list');

const getReading = () => {
    Ajax.get('/reading').then(({response, status}) => {
        let avgTemp = 0, 
            avgHumidity = 0,
            results = response;

        while (listElement) {
            listElement.removeNode(listElement.firstChild);
        }
        for (let i = 0; i < results.length; i++) {
            avgTemp += results[i].temperature;
            avgHumidity += results[i].humidity;
            listElement.appendChild(
                new ReadingEntry(
                    results[i].temperature, 
                    results[i].humidity, 
                    results[i].location,
                    i,
                )
            );
        }

        avgTemp = avgTemp / results.length;
        avgHumidity = avgHumidity / results.length;

        temperatureElement.textContent = ` ${avgTemp}F`;
        humidityElement.textContent = ` ${avgHumidity}%`;        

    }).catch((reason) => {
        console.log(reason.errorMsg)
    });
}

setInterval(() => getReading(), 3000);