import Ajax from '../ajax';
import {template as html} from '../utility';
export default class PowerStatus extends HTMLDivElement {
    rendered = false;

    get resourceId() {
        return this.getAttribute('resourceId') || 'NONE'
    }
    set resourceId(value) {
        this.setAttribute('resourceId', value);
    }

    get status() {
        return this.getAttribute('status') || 'OFF';
    }

    set status(value) {
        this.setAttribute('status', value);
    }

    get labelText() {
        return this.getAttribute('labelText') || 'Power Status';
    }

    set labelText(value) {
        this.setAttribute('labelText', value);
    }
    get data() {
        return {
            resourceId: this.resourceId,
            status: this.status,
            labelText: this.labelText,
        };
    }
    set data({resourceId, status, labelText}) {
        this.resourceId = resourceId;
        this.status = status;
        this.labelText = labelText;
    }
    togglePower() {
        Ajax.post(this.resourceId).then(response => {
            if (response) {
                console.log(response);
            }            
            // TODO finish implementation
            //this.status = response.status;
            
        }).finally(() => {
            if (this.status === 'OFF') {
                this.status = 'ON';
            } else {
                this.status = 'OFF';
            }            
        });
        
    }

    refreshStatus() {
        Ajax.get(this.resourceId).then((response) => {
            if (response) {
                console.log(response);
            }
            //this.status = response.status;
        });
    }
    render() {
        let color = this.status === 'OFF' ? 'red' : 'green',
            data = {...this.data, color: color };
        
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
        this.querySelector('div.fa-power-off').onclick = this.togglePower;
        this.querySelector('div.fa-refresh').onclick = this.refreshStatus;
    }

    get template () {
        return html`
            <div class="container-fluid">
                <div class="row huge-row">
                    <div class="col-md" >${'labelText'}</div>
                    <div style="color: ${'color'};" class="col-md" >${'status'}</div>
                </div>
                <div class="row huge-row">
                    <div style="color: ${'color'};" class="col-md fa fa-power-off" ></div>
                    <div class="col-md fa fa-refresh" ></div>
                </div>
            </div>
        `;
    }
}
customElements.define('power-status', PowerStatus, { extends: 'div' });