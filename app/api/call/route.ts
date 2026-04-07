import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Call requested:", body);
    
    // We will add the Twilio and Google Forms logic back here next!
    
    return NextResponse.json({ success: true, message: "Call initiated" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to initiate call" }, { status: 500 });
  }
}
