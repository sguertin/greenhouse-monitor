import { template as html } from '../utility';
import PowerStatus from './powerStatus';
import ReadingPanel from './readingPanel';
customElements.define('power-status', PowerStatus, { extends: 'div' });
customElements.define('reading-panel', ReadingPanel, { extends: 'div' });
export default class DefaultView extends HTMLDivElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = this.template();
    }
    get template() {
        return html `
            <power-status resourceId="/heater" status="OFF" labelText="Heater" />
            <power-status resourceId="/humidifier" status="OFF" labelText="Humidifier" />
            <reading-panel></reading-panel>
        `;
    }
    static get observedAttributes() {
        return [];
    }
}
