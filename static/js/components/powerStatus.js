import Ajax from '../ajax';

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
    _powerClick() {
        Ajax.post(this.resourceId).then((response)=> {
            if (this.status === 'OFF') {
                this.status = 'ON';
            } else {
                this.status = 'OFF';
            }
        });
        // TODO finish implementation
    }

    _refreshClick() {
        Ajax.get(this.resourceId).then((response) => {
            this.status = response.status;
        })
    }

    static get observedAttributes() {
        return ['labelText', 'status', 'resourceId',];
    }
    attributeChangedCallback(name, oldValue, newValue) {        
        this.render();
        if (this.rendered === false) {
            this.rendered = true;
        }
        this.querySelector('.fa-power-off').onclick = this._powerClick;
        this.querySelector('.fa-refresh').onclick = this._refreshClick;
    }

    render () {
        this.innerHTML = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm" >${this.labelText}</div>
                <div class="col-sm" >${this.status}</div>
            </div>
            <div class="row">
                <div class="col-sm fa fa-power-off" ></div>
                <div class="col-sm fa fa-refresh" ></div>
            </div>
        </div>
        `;
    }
}
customElements.define('power-status', PowerStatus, { extends: 'div' });