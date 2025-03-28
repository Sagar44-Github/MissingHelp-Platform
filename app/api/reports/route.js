import { NextResponse } from "next/server";
import {
  createReport,
  getAllReports,
  getReportsByPersonId,
} from "@/lib/services/reports";
import { getMissingPersonById } from "@/lib/services/missing-persons";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const personId = searchParams.get("personId");

    let reports;

    if (personId) {
      // First check if the person exists
      const person = await getMissingPersonById(personId);

      if (!person) {
        return NextResponse.json(
          { error: "Missing person not found" },
          { status: 404 }
        );
      }

      reports = await getReportsByPersonId(personId);
    } else {
      reports = await getAllReports();
    }

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "personId",
      "reporterName",
      "reporterContact",
      "location",
      "sightingDate",
      "description",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if the person exists
    const person = await getMissingPersonById(data.personId);

    if (!person) {
      return NextResponse.json(
        { error: "Missing person not found" },
        { status: 404 }
      );
    }

    // Convert sightingDate to a Date object if it's a string
    if (typeof data.sightingDate === "string") {
      data.sightingDate = new Date(data.sightingDate);
    }

    // Add coordinates if provided
    if (data.coordinates) {
      if (!data.coordinates.lat || !data.coordinates.lng) {
        return NextResponse.json(
          { error: "Invalid coordinates format" },
          { status: 400 }
        );
      }
    }

    const newReport = await createReport(data);

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
