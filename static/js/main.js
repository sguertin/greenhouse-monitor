import Ajax from './ajax.js';


const getReading = () => {
    Ajax.get('/reading').then((result) => {

        let avgTemp = 0, 
            avgHumidity = 0,
            results = result.content;
        for (let i = 0; i < results.length; i++) {
            avgTemp += results[i].temperature;
            avgHumidity += results[i].humidity;
        }
        avgTemp = avgTemp / results.length;
        avgHumidity = avgHumidity / results.length;
    }).catch((reason) => {
        console.log(reason.errorMsg)
    });
}

