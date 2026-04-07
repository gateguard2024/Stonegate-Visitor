import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.BRIVO_API_KEY;
    const username = process.env.BRIVO_USERNAME;
    const password = process.env.BRIVO_PASSWORD;
    const authBasic = process.env.BRIVO_AUTH_BASIC;

    if (!apiKey || !username || !password || !authBasic) {
      throw new Error("Missing Brivo credentials in Vercel.");
    }

    // 1. Get Temporary Access Token from Brivo using Password Grant
    // (Checks if the word 'Basic ' is already in your variable, adds it if not)
    const authHeader = authBasic.startsWith('Basic') ? authBasic : `Basic ${authBasic}`;

    const tokenResponse = await fetch('https://auth.brivo.com/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'api-key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // We pass the username and password here instead of the client secret
      body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    });

    if (!tokenResponse.ok) throw new Error("Failed to authenticate with Brivo");
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch the User Directory
    const usersResponse = await fetch('https://api.brivo.com/v1/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'api-key': apiKey
      }
    });

    if (!usersResponse.ok) throw new Error("Failed to fetch residents from Brivo");
    const usersData = await usersResponse.json();

    // 3. Clean up the data to send to our frontend
    const formattedUsers = (usersData.data || []).map((user: any) => {
      // Find the phone number
      const phoneNumber = user.phone ? user.phone : (user.customFields?.phone || "");
      
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        phone: phoneNumber
      };
    }).filter((user: any) => user.phone !== ""); // Filter out residents with no phone number

    return NextResponse.json({ success: true, users: formattedUsers });

  } catch (error: any) {
    console.error("Brivo API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to load directory" }, { status: 500 });
  }
}
