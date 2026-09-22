export class BoostButton extends HTMLElement {
  static get observedAttributes() { return ['variant', 'size', 'disabled']; }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  attributeChangedCallback() { this.render(); }

  private get variantStyle(): string {
    const v = this.getAttribute('variant') || 'primary';
    const styles: Record<string, string> = {
      primary: `background:var(--boost-primary,#2563eb);color:var(--boost-on-primary,#fff);`,
      secondary: `background:var(--boost-surface-secondary,#f1f5f9);color:var(--boost-text,#0f172a);`,
      outline: `background:transparent;color:var(--boost-text,#0f172a);border:1px solid var(--boost-border,#cbd5e1);`,
      destructive: `background:var(--boost-destructive,#ef4444);color:#fff;`,
    };
    return styles[v] || styles.primary;
  }

  private get sizeStyle(): string {
    const s = this.getAttribute('size') || 'md';
    return s === 'sm' ? 'padding:6px 14px;font-size:12px;'
      : s === 'lg' ? 'padding:13px 26px;font-size:15px;'
      : 'padding:9px 18px;font-size:14px;';
  }

  render() {
    if (!this.shadowRoot) return;
    const disabled = this.hasAttribute('disabled') ? 'opacity:0.5;pointer-events:none;' : '';
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:inline-flex; cursor:pointer; border-radius:var(--boost-radius,10px); transition:all .15s; }
        :host(:hover) { opacity:.9; }
        :host(:active) { transform:scale(.98); }
        button { font-family:var(--boost-font,system-ui,sans-serif); border:none; cursor:pointer; width:100%; height:100%; box-sizing:border-box; border-radius:inherit; }
      </style>
      <button style="${this.variantStyle}${this.sizeStyle}${disabled}" ?disabled=${this.hasAttribute('disabled')}>
        <slot></slot>
      </button>`;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('boost-button')) {
  customElements.define('boost-button', BoostButton);
}
