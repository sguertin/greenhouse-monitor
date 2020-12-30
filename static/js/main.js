import Ajax from './ajax.js';
import { ReadingEntry } from './components/readingEntry.js';

const temperatureDisplay = document.getElementById('temperature');
const humidityDisplay = document.getElementById('humidity');
const sensorList = document.getElementById('sensor-list');

const heaterStatus = document.getElementById('heater-status-text');
const heaterRefreshButton = document.getElementById('heater-refresh');
const heaterPowerButton = document.getElementById('heater-power');

const humidifierStatus = document.getElementById('humidifier-status-text');
const humidifierRefreshButton = document.getElementById('humidifier-refresh');
const humidifierPowerButton = document.getElementById('humidifier-power');

const getHumidifierStatus = () => {
    Ajax.get('/humidifier').then(({response, status}) => {
        humidifierStatus.textContent = response.status;
    });
};
humidifierRefreshButton.onclick = getHumidifierStatus;
humidifierPowerButton.onclick = () => {
    Ajax.post('/humidifier').then(() => {
        getHumidifierStatus();
    });
};

const getHeaterStatus = () => {
    Ajax.get('/heater').then(({response, status}) => {
        heaterStatus.textContent = response.status;
    });
};
heaterRefreshButton.onclick = getHeaterStatus;
heaterPowerButton.onclick = () => {
    Ajax.post('/heater').then(() => {
        getHeaterStatus();
    });
};

const getReading = () => {
    Ajax.get('/reading').then(({response, status}) => {
        let avgTemp = 0, 
            avgHumidity = 0,
            results = response;

        while (sensorList.firstChild) {
            sensorList.removeNode(
                sensorList.firstChild
            );
        }
        for (let i = 0; i < results.length; i++) {
            avgTemp += results[i].temperature;
            avgHumidity += results[i].humidity;
            sensorList.appendChild(
                new ReadingEntry(
                    results[i].temperature, 
                    results[i].humidity, 
                    results[i].location,
                    i,
                )
            );
        }

        avgTemp = (avgTemp / results.length);
        avgHumidity = (avgHumidity / results.length);

        temperatureDisplay.textContent = ` ${avgTemp}F°`;
        humidityDisplay.textContent = ` ${avgHumidity}%`;        

    }).catch((reason) => {
        console.log(reason.errorMsg)
    });
}

setInterval(() => getReading(), 3000);
setInterval(() => getHumidifierStatus(), 5000);
setInterval(() => getHeaterStatus(), 5000);