
/**
 * A reading entry from a sensor  
 *
 * @export
 * @class ReadingEntry
 * @extends {HTMLDivElement}
 */
export default class ReadingEntry extends HTMLDivElement {
    get temperature() {
        return this.#temperature;
    }
    set temperature(temperature) {
        this.#temperatureEl.textContent =  ` ${temperature} °${this.#unit}`;;
        this.#temperature = temperature;
    }

    get humidity() {
        return this.#humidity;
    }
    set humidity(humidity) {
        this.#humidity = humidity;
        this.#humidityEl.textContent =  `${humidity}%`;
    }

    get location() {
        return this.#location;
    }
    set location(location) {
        this.#location = location;
        this.#locationEl.textContent = location;
    }

    get index() {
        return this.#index;
    }

    #temperature;
    #temperatureEl;
    #humidity;
    #humidityEl;
    #location;
    #locationEl;
    #index;
    #unit;

    constructor(temperature, humidity, location, index, unit = 'F') {
        super();
        this.#unit = unit;
        this.#index = index;                
        this.setAttribute('tabIndex', index);        
        this.setAttribute('class', 'ReadingEntry');
        
        this.#temperatureEl = new HTMLSpanElement();
        this.#temperatureEl.setAttribute('class', 'Temperature');
        this.temperature = temperature;
        
        this.#humidityEl = new HTMLSpanElement();
        this.#humidityEl.setAttribute('class', 'Humidity');
        this.humidity = humidity;

        this.#locationEl = new HTMLSpanElement();
        this.#locationEl.setAttribute('class', 'Location');
        this.location = location;

        this.appendChild(this.#temperatureEl);
        this.appendChild(this.#humidityEl);
        this.appendChild(this.#locationEl);
        
    }
}
