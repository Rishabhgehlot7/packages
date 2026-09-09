import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET() {
  try {
    const plugins = db.getPlugins();
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
