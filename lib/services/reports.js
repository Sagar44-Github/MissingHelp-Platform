import clientPromise from "../db";
import { ObjectId } from "mongodb";

export async function createReport(data) {
  const client = await clientPromise;
  const db = client.db();

  const report = {
    ...data,
    createdAt: new Date(),
    status: "pending", // pending, verified, false
  };

  const result = await db.collection("reports").insertOne(report);

  // Update the missing person with the new sighting
  await db.collection("missingPersons").updateOne(
    { _id: new ObjectId(data.personId) },
    {
      $push: {
        sightings: {
          _id: result.insertedId,
          location: data.location,
          date: data.sightingDate,
          status: "pending",
          createdAt: new Date(),
        },
      },
      $set: { updatedAt: new Date() },
    }
  );

  return {
    ...report,
    _id: result.insertedId,
  };
}

export async function getReportsByPersonId(personId) {
  const client = await clientPromise;
  const db = client.db();

  return await db
    .collection("reports")
    .find({ personId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function updateReportStatus(id, status) {
  const client = await clientPromise;
  const db = client.db();

  const report = await db
    .collection("reports")
    .findOne({ _id: new ObjectId(id) });

  await db.collection("reports").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    }
  );

  // Also update the status in the sightings array
  await db.collection("missingPersons").updateOne(
    {
      _id: new ObjectId(report.personId),
      "sightings._id": new ObjectId(id),
    },
    {
      $set: {
        "sightings.$.status": status,
        updatedAt: new Date(),
      },
    }
  );

  // If status is "verified" and it's a confirmation of the person being found
  if (status === "verified" && report.foundPerson) {
    await db.collection("missingPersons").updateOne(
      { _id: new ObjectId(report.personId) },
      {
        $set: {
          status: "found",
          updatedAt: new Date(),
          foundDate: new Date(),
          foundLocation: report.location,
        },
      }
    );
  }

  return {
    ...report,
    status,
    updatedAt: new Date(),
  };
}

export async function getAllReports() {
  const client = await clientPromise;
  const db = client.db();

  return await db
    .collection("reports")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}
