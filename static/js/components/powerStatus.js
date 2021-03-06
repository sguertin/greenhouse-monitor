import Ajax from '../ajax';
import { template as html } from '../utility';
export default class PowerStatus extends HTMLDivElement {
    constructor() {
        super(...arguments);
        this.rendered = false;
    }
    get resourceId() {
        return this.getAttribute('resourceId') || 'NONE';
    }
    set resourceId(resourceId) {
        this.setAttribute('resourceId', resourceId);
    }
    get status() {
        return this.getAttribute('status') || 'OFF';
    }
    set status(status) {
        this.setAttribute('status', status);
    }
    get labelText() {
        return this.getAttribute('labelText') || 'Power Status';
    }
    set labelText(labelText) {
        this.setAttribute('labelText', labelText);
    }
    get data() {
        return {
            resourceId: this.resourceId,
            status: this.status,
            labelText: this.labelText,
        };
    }
    set data({ resourceId, status, labelText }) {
        this.resourceId = resourceId;
        this.status = status;
        this.labelText = labelText;
    }
    togglePower() {
        Ajax.post(this.resourceId)
            .then(response => {
            if (response) {
                console.log(response);
            }
            // TODO finish implementation
            //this.status = response.status;            
        })
            .finally(() => {
            if (this.status === 'OFF') {
                this.status = 'ON';
            }
            else {
                this.status = 'OFF';
            }
        });
    }
    refreshStatus() {
        fetch(this.resourceId)
            .then((response) => {
            if (response) {
                console.log(response);
            }
            //this.status = response.status;
        });
    }
    render() {
        let color = this.status === 'OFF' ? 'red' : 'green', data = Object.assign(Object.assign({}, this.data), { color: color });
        this.shadowRoot.innerHTML = this.template(data);
    }
    static get observedAttributes() {
        return ['labelText', 'status', 'resourceId',];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
        if (this.rendered === false) {
            this.rendered = true;
        }
        let powerButton = this.querySelector('div.fa-power-off'), refreshButton = this.querySelector('div.fa-refresh');
        powerButton.onclick = this.togglePower;
        refreshButton.onclick = this.refreshStatus;
    }
    get template() {
        return html`
            <div class="container-fluid">
                <div class="row huge-row">
                    <div class="col-md">${'labelText'}</div>
                    <div style="color: ${'color'};" class="col-md">${'status'}</div>
                </div>
                <div class="row huge-row">
                    <div style="color: ${'color'};" class="col-md fa fa-power-off"></div>
                    <div class="col-md fa fa-refresh"></div>
                </div>
            </div>
        `;
    }
}
