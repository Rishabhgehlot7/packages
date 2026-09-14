import { NextResponse } from 'next/server';
import { db } from '@/data/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const plugins = db.getPlugins();

    // Sync with boost.config.json if available
    try {
      const configPath = path.join(process.cwd(), 'boost.config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config && config.features) {
          plugins.forEach((p) => {
            const featKey = p.id.replace('boost-', '');
            if (config.features[featKey] && typeof config.features[featKey].enabled === 'boolean') {
              p.enabled = config.features[featKey].enabled;
            }
          });
        }
      }
    } catch (e) {
      // Fallback silently to db in-memory defaults
    }

    return NextResponse.json({ success: true, count: plugins.length, data: plugins });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch plugins' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, enabled, settings } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Plugin ID required' }, { status: 400 });
    }

    let updatedPlugin = null;

    if (typeof enabled === 'boolean') {
      updatedPlugin = db.togglePlugin(id, enabled);

      // Persist to boost.config.json if present
      try {
        const configPath = path.join(process.cwd(), 'boost.config.json');
        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          const featKey = id.replace('boost-', '');
          if (!config.features) config.features = {};
          if (!config.features[featKey]) config.features[featKey] = {};
          config.features[featKey].enabled = enabled;
          fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
        }
      } catch (e) {
        // Silently skip if file not writeable
      }
    }

    if (settings && typeof settings === 'object') {
      updatedPlugin = db.updatePluginSettings(id, settings);
    }

    if (!updatedPlugin) {
      return NextResponse.json({ success: false, error: 'Plugin not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedPlugin });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update plugin' },
      { status: 500 }
    );
  }
}
