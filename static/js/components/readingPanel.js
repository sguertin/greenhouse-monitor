import { template as html, getAll } from '../utility';
/**
 * A reading entry from a sensor
 *
 * @export
 * @class ReadingEntry
 * @extends {HTMLDivElement}
 */
class ReadingEntry extends HTMLDivElement {
    constructor() {
        super();
        this.rendered = false;
        this.attachShadow({ mode: 'open' });
    }
    get data() {
        return {
            temperature: this.temperature,
            humidity: this.humidity,
            location: this.location,
            pin: this.pin,
            unit: this.unit,
            recorded: this.recorded,
        };
    }
    set data({ temperature, humidity, location, pin, unit, recorded }) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.location = location;
        this.pin = pin;
        this.unit = unit;
        this.recorded = recorded;
    }
    render() {
        this.shadowRoot.innerHTML = this.template(this.data);
    }
    get temperature() {
        let attrVal = this.getAttribute('temperature');
        if (attrVal) {
            return parseInt(attrVal);
        }
        return 0;
    }
    set temperature(temperature) {
        this.setAttribute('temperature', temperature.toString());
    }
    get humidity() {
        let attrVal = this.getAttribute('humidity');
        if (attrVal) {
            return parseInt(attrVal);
        }
        return 0;
    }
    set humidity(humidity) {
        this.setAttribute('humidity', humidity.toString());
    }
    get location() {
        return this.getAttribute('location') || 'UNKNOWN';
    }
    set location(location) {
        this.setAttribute('location', location);
    }
    get pin() {
        return parseInt(this.getAttribute('pin')) || -1;
    }
    set pin(pin) {
        this.setAttribute('pin', pin.toString());
    }
    get unit() {
        return this.getAttribute('unit') || 'F';
    }
    set unit(unit) {
        this.setAttribute('unit', unit);
    }
    get recorded() {
        let recorded = this.getAttribute('recorded');
        return recorded ? new Date(recorded) : null;
    }
    set recorded(recorded) {
        if (recorded) {
            this.setAttribute('recorded', recorded.toLocaleString('en-US'));
        }
    }
    static create({ temperature, humidity, location, pin, unit, recorded }) {
        let newEntry = document.createElement('reading-entry');
        newEntry.temperature = temperature;
        newEntry.humidity = humidity;
        newEntry.location = location;
        newEntry.pin = pin;
        newEntry.unit = unit;
        newEntry.recorded = recorded;
        return newEntry;
    }
    get template() {
        return html `            
            <div class="bold col-md-2">
                ${'location'}
            </div>
            <div class="bold col-md-1">
                ${'temperature'}°${'unit'}
            </div>
            <div class="bold col-md-1">
                ${'humidity'}
            </div>
            <div class="bold col-md-1">
                ${'pin'}
            </div>
            <div class="bold col-md-2">
                ${'recorded'}
            </div>                
        `;
    }
    static get observedAttributes() {
        return ['humidity', 'location', 'pin', 'temperature', 'unit', 'recorded'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }
}
export default class ReadingPanel extends HTMLDivElement {
    updateData(data) {
        let entries = getAll('reading-entry', this);
        let existingLocation = entries.filter((entry, index) => entry.location === data.location);
        if (existingLocation) {
            existingLocation[0].data = data;
        }
        else {
            this.appendChild(ReadingEntry.create(data));
        }
    }
    render() {
        this.shadowRoot.innerHTML = this.template();
    }
    get template() {
        return html `            
            <div class="bold col-md-2">
                Location
            </div>
            <div class="bold col-md-1">
                Temperature
            </div>
            <div class="bold col-md-1">
                Humidity
            </div>
            <div class="bold col-md-1">
                Pin
            </div>
            <div class="bold col-md-2">
                Recorded
            </div>
            <slot></slot>
        `;
    }
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' });
        customElements.define('reading-entry', ReadingEntry, { extends: 'div' });
        shadow.innerHTML = this.template();
    }
}
