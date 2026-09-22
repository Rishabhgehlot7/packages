export class BoostBadge extends HTMLElement {
  static get observedAttributes() { return ['variant']; }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  attributeChangedCallback() { this.render(); }

  private get variantStyle(): string {
    const v = this.getAttribute('variant') || 'default';
    const styles: Record<string, string> = {
      default: `background:var(--boost-surface-secondary,#f1f5f9);color:var(--boost-text,#0f172a);`,
      success: `background:var(--boost-success-bg,rgba(22,163,74,0.1));color:var(--boost-success-text,#15803d);`,
      warning: `background:var(--boost-warning-bg,rgba(245,158,11,0.1));color:var(--boost-warning-text,#b45309);`,
      destructive: `background:var(--boost-destructive-bg,rgba(239,68,68,0.1));color:var(--boost-destructive-text,#dc2626);`,
      info: `background:var(--boost-info-bg,rgba(37,99,235,0.1));color:var(--boost-info-text,#1d4ed8);`,
    };
    return styles[v] || styles.default;
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:inline-flex; font-family:var(--boost-font,system-ui,sans-serif); }
        span { font-size:12px; font-weight:600; padding:2px 10px; border-radius:9999px; }
      </style>
      <span style="${this.variantStyle}"><slot></slot></span>`;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('boost-badge')) {
  customElements.define('boost-badge', BoostBadge);
}