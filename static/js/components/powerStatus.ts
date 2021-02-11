import Ajax from '../ajax';
import { template as html } from '../utility';

interface PowerData {
    resourceId: string;
    status: string;
    labelText: string;
}

export default class PowerStatus extends HTMLDivElement {
    rendered: boolean = false;

    get resourceId(): string {
        return this.getAttribute('resourceId') || 'NONE'
    }
    set resourceId(resourceId: string) {
        this.setAttribute('resourceId', resourceId);
    }

    get status(): string {
        return this.getAttribute('status') || 'OFF';
    }

    set status(status: string) {
        this.setAttribute('status', status);
    }

    get labelText(): string {
        return this.getAttribute('labelText') || 'Power Status';
    }

    set labelText(labelText: string) {
        this.setAttribute('labelText', labelText);
    }
    get data(): PowerData {
        return {
            resourceId: this.resourceId,
            status: this.status,
            labelText: this.labelText,
        };
    }
    set data({ resourceId, status, labelText }: PowerData) {
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
                } else {
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
        let color = this.status === 'OFF' ? 'red' : 'green',
            data = { ...this.data, color: color };

        this.shadowRoot.innerHTML = this.template(data);
    }

    static get observedAttributes(): string[] {
        return ['labelText', 'status', 'resourceId',];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
        if (this.rendered === false) {
            this.rendered = true;
        }
        let powerButton = this.querySelector('div.fa-power-off') as HTMLDivElement,
            refreshButton = this.querySelector('div.fa-refresh') as HTMLDivElement;

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
