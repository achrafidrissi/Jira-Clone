import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    //const { email, subject, message } = await req.json();
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);
    console.log("🔍 JSON envoyé à Appwrite:", JSON.stringify(body, null, 2));

    // Appwrite API call
    const response = await fetch("https://cloud.appwrite.io/v1/functions/67767470003db7bba9ff/executions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? "",
        "X-Appwrite-Key": process.env.NEXT_APPWRITE_KEY ?? "",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    console.log("🔍 Réponse Appwrite:", result);
    console.log("🔍 Réponse Appwrite:", process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
    console.log("🔍 Réponse Appwrite:", process.env.NEXT_APPWRITE_KEY);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
