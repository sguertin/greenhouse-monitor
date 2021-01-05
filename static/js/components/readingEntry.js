
/**
 * A reading entry from a sensor  
 *
 * @export
 * @class ReadingEntry
 * @extends {HTMLDivElement}
 */
export default class ReadingEntry extends HTMLDivElement  {
    rendered = false;

    
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

    constructor() {
        super();
        this.setAttribute('temperature', 0);
        this.setAttribute('humidity', 0);
        this.setAttribute('location', 'UNKNOWN');
        this.setAttribute('pin', 'UNKNOWN');
        this.setAttribute('unit', 'F');
    }
    
    render() {
        this.innerHTML = `            
            <div class="col-sm">
                ${this.location}
            </div>
            <div class="col-sm">
                ${this.temperature}°${this.unit}
            </div>
            <div class="col-sm">
                ${this.humidity}
            </div>
            <div class="col-sm">
                ${this.pin}
            </div>                
        `;
    }

    static get observedAttributes() {
        return ['humidity', 'location', 'pin', 'temperature', 'unit'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {        
        this.render();
        if (this.rendered === false) {
            this.rendered = true;
        }
    }


    
}
customElements.define('reading-entry', ReadingEntry, { extends: 'div' });