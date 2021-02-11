import { template as html, getAll } from '../utility';

interface Reading {
    temperature: number,
    humidity: number,
    location: string,
    pin: number,
    unit: string,
    recorded: Date
}

/**
 * A reading entry from a sensor  
 *
 * @export
 * @class ReadingEntry
 * @extends {HTMLDivElement}
 */
class ReadingEntry extends HTMLDivElement  {
    rendered = false;
    get data(): Reading {
        return { 
            temperature: this.temperature,
            humidity: this.humidity,
            location: this.location,
            pin: this.pin,
            unit: this.unit,
            recorded: this.recorded,
        };
    }
    set data({temperature, humidity, location, pin, unit, recorded}: Reading) {
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
    get temperature(): number {
        let attrVal = this.getAttribute('temperature');
        if (attrVal) {
            return parseInt(attrVal)
        }
        return 0;
    }
    set temperature(temperature: number) {
        this.setAttribute('temperature', temperature.toString());
    }
    get humidity(): number {
        let attrVal = this.getAttribute('humidity');
        if (attrVal) {
            return parseInt(attrVal)
        }
        return 0;
    }
    set humidity(humidity: number) {
        this.setAttribute('humidity', humidity.toString());
    }
    get location(): string {
        return this.getAttribute('location') || 'UNKNOWN';
    }
    set location(location: string) {
        this.setAttribute('location', location);
    }
    get pin(): number {
        return parseInt(this.getAttribute('pin')) || -1;
    }
    set pin(pin: number) {
        this.setAttribute('pin', pin.toString());
    }
    get unit(): string {
        return this.getAttribute('unit') || 'F';
    }
    set unit(unit: string) {
        this.setAttribute('unit', unit);
    }
    get recorded(): Date {
        let recorded = this.getAttribute('recorded');

        return recorded ? new Date(recorded) : null;
    }
    set recorded(recorded: Date) {
        if (recorded) {
            this.setAttribute('recorded', recorded.toLocaleString('en-US'));
        }
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static create({temperature, humidity, location, pin, unit, recorded}: Reading) {
        let newEntry: ReadingEntry = document.createElement('reading-entry') as ReadingEntry;
        newEntry.temperature = temperature;
        newEntry.humidity = humidity;
        newEntry.location = location;
        newEntry.pin = pin;
        newEntry.unit = unit;
        newEntry.recorded = recorded;
        return newEntry;
    }

    get template(): Function {
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

    static get observedAttributes(): Array<string> {
        return ['humidity', 'location', 'pin', 'temperature', 'unit', 'recorded'];
    }
    attributeChangedCallback(name: string, oldValue: any, newValue: any) {        
        this.render();
    }
}

export default class ReadingPanel extends HTMLDivElement {

    updateData(data: Reading) {
        let entries: ReadingEntry[] = getAll('reading-entry', this) as ReadingEntry[];

        let existingLocation: ReadingEntry[] = entries.filter((entry, index) => entry.location === data.location);
        if (existingLocation) {
            existingLocation[0].data = data;
        } else {
            this.appendChild(
                ReadingEntry.create(data)
            );
        }
    }

    render() {
        this.shadowRoot.innerHTML = this.template();
    }
    
    get template(): Function {
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
        let shadow = this.attachShadow({ mode: 'open' });
        customElements.define('reading-entry', ReadingEntry, { extends: 'div' });
        shadow.innerHTML = this.template();
    }
}
