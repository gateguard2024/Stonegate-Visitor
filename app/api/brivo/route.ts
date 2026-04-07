import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // We will add the Brivo fetch logic back here next!
    return NextResponse.json({ success: true, users: [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch directory" }, { status: 500 });
  }
}
