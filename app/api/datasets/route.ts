import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { parseDatasetQuery, searchDatasets } from "@/lib/opendata";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const query = parseDatasetQuery(request.nextUrl.searchParams);
    const payload = await searchDatasets(query);
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: error.flatten()
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Unable to fetch datasets right now"
      },
      { status: 502 }
    );
  }
}
