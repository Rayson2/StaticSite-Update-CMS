import { NextResponse } from "next/server";

/**
 * This route exists to explicitly block unsupported methods
 * on /api/images and guide consumers to proper endpoints.
 */

export async function GET() {
  return NextResponse.json(
    {
      message: "Use /api/images/list to fetch images"
    },
    { status: 405 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      message: "Use /api/images/upload to upload images"
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Use /api/images/delete/[id] to delete images"
    },
    { status: 405 }
  );
}
