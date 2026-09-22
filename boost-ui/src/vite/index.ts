export interface BoostViteOptions {
  cssPath?: string;
  includeDarkMode?: boolean;
}

export interface BoostVitePlugin {
  name: string;
  enforce?: 'pre' | 'post';
  transformIndexHtml?: () => Array<{
    tag: string;
    attrs?: Record<string, any>;
    children?: string;
  }>;
  handleHotUpdate?: (ctx: { server: { ws: { send: (msg: any) => void } } }) => void;
  [key: string]: any;
}

/**
 * boostVitePlugin — Vite plugin that auto-injects BoostEngine CSS variables.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { boostVitePlugin } from '@boostengine/ui/vite';
 * export default defineConfig({ plugins: [boostVitePlugin()] });
 * ```
 */
export function boostVitePlugin(options: BoostViteOptions = {}): BoostVitePlugin {
  return {
    name: '@boostengine/ui',
    enforce: 'pre',
    transformIndexHtml() {
      const darkCss = options.includeDarkMode !== false ? `
      [data-theme="dark"], .dark {
        --boost-primary: #3b82f6; --boost-bg: #090d16; --boost-surface: #0f172a;
        --boost-text: #f8fafc; --boost-text-muted: #94a3b8; --boost-border: #1e293b;
        color-scheme: dark;
      }` : '';
      return [
        {
          tag: 'style',
          attrs: { id: '__boost_ui_defaults__' },
          children: `:root,[data-theme="light"]{
  --boost-primary:#2563eb;--boost-bg:#fff;--boost-surface:#f8fafc;
  --boost-text:#0f172a;--boost-text-muted:#64748b;--boost-border:#e2e8f0;
  --boost-radius:12px;--boost-font:system-ui,sans-serif;
}${darkCss}`,
        },
      ];
    },
    handleHotUpdate({ server }: { server: { ws: { send: (msg: any) => void } } }) {
      server.ws.send({ type: 'full-reload' });
    },
  };
}