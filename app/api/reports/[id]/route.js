import { NextResponse } from "next/server";
import { updateReportStatus } from "@/lib/services/reports";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    if (!data.status) {
      return NextResponse.json(
        { error: "Status field is required" },
        { status: 400 }
      );
    }

    // Validate status field
    const validStatuses = ["pending", "verified", "false"];
    if (!validStatuses.includes(data.status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updatedReport = await updateReportStatus(id, data.status);

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error(`Error updating report with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}
