// app/api/extract/route.js
import { NextResponse } from "next/server";
// import { extractJobData } from "@/lib/extractJobData";

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // const jobData = await extractJobData(url);

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
