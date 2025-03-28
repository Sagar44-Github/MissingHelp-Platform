import clientPromise from "../db";
import { ObjectId } from "mongodb";

export async function getMissingPersons() {
  const client = await clientPromise;
  const db = client.db();

  return await db
    .collection("missingPersons")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getMissingPersonById(id) {
  const client = await clientPromise;
  const db = client.db();

  return await db
    .collection("missingPersons")
    .findOne({ _id: new ObjectId(id) });
}

export async function createMissingPerson(data) {
  const client = await clientPromise;
  const db = client.db();

  const person = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "missing",
  };

  const result = await db.collection("missingPersons").insertOne(person);

  return {
    ...person,
    _id: result.insertedId,
  };
}

export async function updateMissingPerson(id, data) {
  const client = await clientPromise;
  const db = client.db();

  const updatedPerson = {
    ...data,
    updatedAt: new Date(),
  };

  await db
    .collection("missingPersons")
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedPerson });

  return {
    ...updatedPerson,
    _id: id,
  };
}

export async function deleteMissingPerson(id) {
  const client = await clientPromise;
  const db = client.db();

  return await db
    .collection("missingPersons")
    .deleteOne({ _id: new ObjectId(id) });
}

export async function getMissingPersonsByFilters(filters) {
  const client = await clientPromise;
  const db = client.db();

  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.region) {
    query.region = filters.region;
  }

  if (filters.gender) {
    query.gender = filters.gender;
  }

  if (filters.ageRange) {
    const [min, max] = filters.ageRange;
    query.age = { $gte: min, $lte: max };
  }

  if (filters.keyword) {
    query.$or = [
      { name: { $regex: filters.keyword, $options: "i" } },
      { description: { $regex: filters.keyword, $options: "i" } },
      { lastSeenLocation: { $regex: filters.keyword, $options: "i" } },
    ];
  }

  return await db
    .collection("missingPersons")
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();
}
