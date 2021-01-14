import Ajax from './ajax.js';
import { getFirst as $, getAll as $$ } from './utility.js';
import ReadingEntry from './components/readingEntry.js';
const model = { unit: 'F' },
    temperatureDisplay = $('#avg-temperature'),
    humidityDisplay = $('#avg-humidity'),
    sensorList = $('#sensor-list'),
    heaterStatus = $('#heater-status-text'), 
    heaterRefreshButton = $('#heater-refresh'), 
    heaterPowerButton = $('#heater-power'),
    humidifierStatus = $('#humidifier-status-text'),
    humidifierRefreshButton = $('#humidifier-refresh'),
    humidifierPowerButton = $('#humidifier-power'),
    fahrenheitLabel = $('#fahrenheit'),
    celsiusLabel = $('#celsius'),
    unitToggle = $('#unit-toggle');

fahrenheitLabel.onclick = () => {
    unitToggle.checked = true;
}

celsiusLabel.onclick = () => {
    unitToggle.checked = false;
}

unitToggle.onclick = () => {
    let entries = $$('reading-entry');
    model.unit = unitToggle.checked ? 'F' : 'C';

    for (let i = 0; i < entries.length; i++) {
        entries[i].unit = model.unit;
    }
}
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
            results = response.results;
        console.log(`Greenhouse Reading Request HttpStatus Response: ${status}`);
        while (sensorList.firstChild) {
            sensorList.removeChild(
                sensorList.firstChild
            );
        }        
        for (let i = 0; i < results.length; i++) {
            results[i].unit = model.unit;
            let entry = ReadingEntry.create(results[i]);
            avgTemp += results[i].temperature;
            avgHumidity += results[i].humidity;            
            sensorList.appendChild(entry);
        }

        avgTemp = (avgTemp / results.length);
        avgHumidity = (avgHumidity / results.length);

        temperatureDisplay.textContent = ` ${avgTemp}°F`;
        humidityDisplay.textContent = ` ${avgHumidity}%`;        

    }).catch((reason) => {
        console.log(reason.errorMsg)
    });
}

setInterval(() => getReading(), 10000);
//setInterval(() => getHumidifierStatus(), 5000);
//setInterval(() => getHeaterStatus(), 5000);