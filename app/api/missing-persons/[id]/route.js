import { NextResponse } from "next/server";
import {
  getMissingPersonById,
  updateMissingPerson,
  deleteMissingPerson,
} from "@/lib/services/missing-persons";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const person = await getMissingPersonById(id);

    if (!person) {
      return NextResponse.json(
        { error: "Missing person not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(person);
  } catch (error) {
    console.error(`Error fetching missing person with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch missing person" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // Check if the person exists
    const existingPerson = await getMissingPersonById(id);

    if (!existingPerson) {
      return NextResponse.json(
        { error: "Missing person not found" },
        { status: 404 }
      );
    }

    const updatedPerson = await updateMissingPerson(id, data);

    return NextResponse.json(updatedPerson);
  } catch (error) {
    console.error(`Error updating missing person with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update missing person" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if the person exists
    const existingPerson = await getMissingPersonById(id);

    if (!existingPerson) {
      return NextResponse.json(
        { error: "Missing person not found" },
        { status: 404 }
      );
    }

    await deleteMissingPerson(id);

    return NextResponse.json(
      { message: "Missing person deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting missing person with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete missing person" },
      { status: 500 }
    );
  }
}
