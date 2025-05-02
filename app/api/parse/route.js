import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (jobData) {
      return NextResponse.json({ success: true, data: jobData });
    } else {
      return NextResponse.json({
        success: false,
        message: "Required job details not found.",
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
