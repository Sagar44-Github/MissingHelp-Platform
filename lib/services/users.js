import clientPromise from "../db";
import { ObjectId } from "mongodb";
import { hash } from "bcrypt";

export async function getUserByEmail(email) {
  const client = await clientPromise;
  const db = client.db();

  return await db.collection("users").findOne({ email: email.toLowerCase() });
}

export async function getUserById(id) {
  const client = await clientPromise;
  const db = client.db();

  return await db.collection("users").findOne({ _id: new ObjectId(id) });
}

export async function createUser(data) {
  const client = await clientPromise;
  const db = client.db();

  // Check if user already exists
  const existingUser = await getUserByEmail(data.email);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash the password
  const hashedPassword = await hash(data.password, 12);

  const newUser = {
    name: data.name,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    role: data.role || "user", // Default role is 'user'
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("users").insertOne(newUser);

  const user = {
    ...newUser,
    _id: result.insertedId,
  };

  // Remove the password from the returned user object
  delete user.password;

  return user;
}

export async function updateUser(id, data) {
  const client = await clientPromise;
  const db = client.db();

  // Check if user exists
  const existingUser = await getUserById(id);

  if (!existingUser) {
    throw new Error("User not found");
  }

  const updateData = {
    ...data,
    updatedAt: new Date(),
  };

  // If password is being updated, hash it
  if (data.password) {
    updateData.password = await hash(data.password, 12);
  }

  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

  const updatedUser = await getUserById(id);

  // Remove the password from the returned user object
  delete updatedUser.password;

  return updatedUser;
}
