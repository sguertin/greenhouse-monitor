export default class ReadingEntry extends HTMLDivElement {
    temperature;
    humidity;
    location;
    index;

    constructor(temperature, humidity, location, index) {
        super();
        this.temperature = temperature;
        this.humidity = humidity;
        this.location = location;
        this.index = index;
    }    
}