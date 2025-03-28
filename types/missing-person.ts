export type MissingPerson = {
  _id: string;
  name: string;
  age: number;
  gender: string;
  description: string;
  lastSeenDate: string;
  lastSeenLocation: string;
  status: "missing" | "found";
  photoUrl: string;
  reportDate: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  daysAgo?: number; // Optional for backward compatibility
};
