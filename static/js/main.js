import Ajax from './ajax.js';
import { getFirst as $ } from './utility.js';
import ReadingEntry from './components/readingEntry.js';

const temperatureDisplay = $('#avg-temperature'),
    humidityDisplay = $('#avg-humidity'),
    sensorList = $('#sensor-list'),
    heaterStatus = $('#heater-status-text'), 
    heaterRefreshButton = $('#heater-refresh'), 
    heaterPowerButton = $('#heater-power'),
    humidifierStatus = $('#humidifier-status-text'),
    humidifierRefreshButton = $('#humidifier-refresh'),
    humidifierPowerButton = $('#humidifier-power');

const getHumidifierStatus = () => {
    Ajax.get('/humidifier').then(({response}) => {
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
    Ajax.get('/heater').then(({response}) => {
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
        console.log(`Greenhouse Reading Request HttpStatus Response: ${status}`);
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

        temperatureDisplay.textContent = ` ${avgTemp}°F`;
        humidityDisplay.textContent = ` ${avgHumidity}%`;        

    }).catch((reason) => {
        console.log(reason.errorMsg)
    });
}

setInterval(() => getReading(), 3000);
setInterval(() => getHumidifierStatus(), 5000);
setInterval(() => getHeaterStatus(), 5000);