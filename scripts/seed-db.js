const { MongoClient } = require("mongodb");
const { hash } = require("bcrypt");
require("dotenv").config({ path: ".env.local" });

// Sample data for missing persons
const missingPersons = [
  {
    name: "Jane Doe",
    age: 24,
    gender: "female",
    lastSeenDate: new Date("2023-05-15"),
    lastSeenLocation: "Central Park, New York",
    description:
      "Jane was last seen wearing a blue jacket and jeans. She has blonde hair and green eyes.",
    photoUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    coordinates: {
      lat: 40.785091,
      lng: -73.968285,
    },
    region: "North America",
    status: "missing",
    contactInfo: {
      name: "John Doe",
      relationship: "Brother",
      phone: "555-123-4567",
      email: "john.doe@example.com",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Michael Smith",
    age: 17,
    gender: "male",
    lastSeenDate: new Date("2023-06-22"),
    lastSeenLocation: "Brighton Beach, London",
    description:
      "Michael is a high school student who didn't return home from school. He has brown hair and was wearing his school uniform.",
    photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    coordinates: {
      lat: 51.509865,
      lng: -0.118092,
    },
    region: "Europe",
    status: "found",
    foundDate: new Date("2023-07-02"),
    foundLocation: "Camden Town, London",
    contactInfo: {
      name: "Sarah Smith",
      relationship: "Mother",
      phone: "555-987-6543",
      email: "sarah.smith@example.com",
    },
    createdAt: new Date("2023-06-22"),
    updatedAt: new Date("2023-07-02"),
  },
  {
    name: "Sophia Chen",
    age: 31,
    gender: "female",
    lastSeenDate: new Date("2023-04-10"),
    lastSeenLocation: "Downtown Vancouver, Canada",
    description:
      "Sophia disappeared after a night out with friends. She has long black hair and was wearing a red dress.",
    photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    coordinates: {
      lat: 49.2827,
      lng: -123.1207,
    },
    region: "North America",
    status: "missing",
    contactInfo: {
      name: "David Chen",
      relationship: "Husband",
      phone: "555-222-3333",
      email: "david.chen@example.com",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Lucas Garcia",
    age: 8,
    gender: "male",
    lastSeenDate: new Date("2023-07-14"),
    lastSeenLocation: "Copacabana Beach, Rio de Janeiro",
    description:
      "Lucas went missing during a family beach trip. He has dark hair and was wearing blue swim shorts.",
    photoUrl: "https://randomuser.me/api/portraits/men/12.jpg",
    coordinates: {
      lat: -22.9682,
      lng: -43.1779,
    },
    region: "South America",
    status: "found",
    foundDate: new Date("2023-07-15"),
    foundLocation: "Ipanema, Rio de Janeiro",
    contactInfo: {
      name: "Maria Garcia",
      relationship: "Mother",
      phone: "555-444-5555",
      email: "maria.garcia@example.com",
    },
    createdAt: new Date("2023-07-14"),
    updatedAt: new Date("2023-07-15"),
  },
  {
    name: "Emma Wilson",
    age: 19,
    gender: "female",
    lastSeenDate: new Date("2023-03-20"),
    lastSeenLocation: "University of Sydney Campus",
    description:
      "Emma is a university student who didn't return to her dormitory. She has short brown hair and was wearing a university hoodie.",
    photoUrl: "https://randomuser.me/api/portraits/women/28.jpg",
    coordinates: {
      lat: -33.8882,
      lng: 151.1872,
    },
    region: "Australia/Oceania",
    status: "missing",
    contactInfo: {
      name: "Robert Wilson",
      relationship: "Father",
      phone: "555-666-7777",
      email: "robert.wilson@example.com",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Sample data for admin user
const adminUser = {
  name: "Admin User",
  email: "admin@findthem.com",
  password: "admin123",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Function to seed the database
async function seedDatabase() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error(
      "Please define the DATABASE_URL environment variable in .env.local"
    );
    return;
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();

    // Clear existing collections
    await db.collection("missingPersons").deleteMany({});
    await db.collection("users").deleteMany({});
    await db.collection("reports").deleteMany({});

    // Insert missing persons
    const missingPersonsResult = await db
      .collection("missingPersons")
      .insertMany(missingPersons);
    console.log(
      `${missingPersonsResult.insertedCount} missing persons inserted`
    );

    // Hash admin password and insert admin user
    const hashedPassword = await hash(adminUser.password, 12);
    const adminUserWithHashedPassword = {
      ...adminUser,
      password: hashedPassword,
    };

    await db.collection("users").insertOne(adminUserWithHashedPassword);
    console.log("Admin user inserted");

    console.log("Database seeded successfully");
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seeding function
seedDatabase();

// Display helpful information
console.log("\nSeeding complete! You can now:");
console.log("1. Sign in with the admin account:");
console.log("   Email: admin@findthem.com");
console.log("   Password: admin123");
console.log("2. Browse the sample missing persons data");
console.log("3. Test all functionality of the application\n");
