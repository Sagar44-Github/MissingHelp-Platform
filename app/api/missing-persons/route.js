import { NextResponse } from "next/server";
import {
  getMissingPersons,
  createMissingPerson,
  getMissingPersonsByFilters,
} from "@/lib/services/missing-persons";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Check if we have filters
    const filters = {};

    if (searchParams.has("status")) {
      filters.status = searchParams.get("status");
    }

    if (searchParams.has("region")) {
      filters.region = searchParams.get("region");
    }

    if (searchParams.has("gender")) {
      filters.gender = searchParams.get("gender");
    }

    if (searchParams.has("minAge") && searchParams.has("maxAge")) {
      filters.ageRange = [
        parseInt(searchParams.get("minAge")),
        parseInt(searchParams.get("maxAge")),
      ];
    }

    if (searchParams.has("keyword")) {
      filters.keyword = searchParams.get("keyword");
    }

    let persons;

    // If filters exist, use the filtered function
    if (Object.keys(filters).length > 0) {
      persons = await getMissingPersonsByFilters(filters);
    } else {
      persons = await getMissingPersons();
    }

    return NextResponse.json(persons);
  } catch (error) {
    console.error("Error fetching missing persons:", error);
    return NextResponse.json(
      { error: "Failed to fetch missing persons" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "age",
      "gender",
      "lastSeenDate",
      "lastSeenLocation",
      "description",
      "photoUrl",
      "coordinates",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate coordinates
    if (!data.coordinates.lat || !data.coordinates.lng) {
      return NextResponse.json(
        { error: "Missing coordinates (lat or lng)" },
        { status: 400 }
      );
    }

    const newPerson = await createMissingPerson(data);

    return NextResponse.json(newPerson, { status: 201 });
  } catch (error) {
    console.error("Error creating missing person:", error);
    return NextResponse.json(
      { error: "Failed to create missing person" },
      { status: 500 }
    );
  }
}
