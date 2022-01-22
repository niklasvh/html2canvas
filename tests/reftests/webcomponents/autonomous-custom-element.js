class AutonomousCustomElement extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        const wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        const info = document.createElement('span');
        info.setAttribute('class', 'info');

        info.textContent = this.getAttribute('text');

        const img = document.createElement('img');
        img.src = this.getAttribute('img');

        // Create some CSS to apply to the shadow dom
        const style = document.createElement('style');

        style.textContent = `
      .wrapper {
        position: relative;
      }
      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 10px;
      }
      img {
        width: 100px;
      }
    `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(img);
        wrapper.appendChild(info);
    }

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }
}

customElements.define('autonomous-custom-element', AutonomousCustomElement);
