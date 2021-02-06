import { template as html, getAll } from '../utility';

/**
 * A reading entry from a sensor  
 *
 * @export
 * @class ReadingEntry
 * @extends {HTMLDivElement}
 */
class ReadingEntry extends HTMLDivElement  {
    rendered = false;
    get data() {
        return { 
            temperature: this.temperature,
            humidity: this.humidity,
            location: this.location,
            pin: this.pin,
            unit: this.unit,
        };
    }
    set data({temperature, humidity, location, pin, unit}) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.location = location;
        this.pin = pin;
        this.unit = unit;
    }

    render() {
        this.shadowRoot.innerHTML = this.template(this.data);
    }
    get temperature() {
        return this.getAttribute('temperature') || 0;
    }
    set temperature(temperature) {
        this.setAttribute('temperature', temperature);
    }
    get humidity() {
        return this.getAttribute('humidity') || 0;
    }
    set humidity(humidity) {
        this.setAttribute('humidity', humidity);
    }
    get location() {
        return this.getAttribute('location') || 'UNKNOWN';
    }
    set location(location) {
        this.setAttribute('location', location);
    }
    get pin() {
        return this.getAttribute('pin') || 'UNKNOWN';
    }
    set pin(pin) {
        this.setAttribute('pin', pin);
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
            let dateRecorded = new Date(recorded.toString());
            this.setAttribute('recorded', dateRecorded.toLocaleString('en-US'));
        }
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static create({temperature, humidity, location, pin, unit, recorded}) {
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
        return html`            
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
        let existingLocation = getAll('reading-entry', this)
            .filter(e => e.location.toLowerCase() === data.location.toLowerCase());

        if (existingLocation) {
            existingLocation.data = data;
        } else {
            this.appendChild(
                ReadingEntry.create(data)
            );
        }
    }

    render() {
        this.shadowRoot.innerHTML = this.template();
    }
    
    get template() {
        return html`            
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
        this.attachShadow({ mode: 'open' });
        customElements.define('reading-entry', ReadingEntry, { extends: 'div' });
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {        
        this.render();
    } 
}
