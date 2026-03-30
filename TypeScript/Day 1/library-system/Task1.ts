// SECTION 1: --- Primitive Types & Annotations ---

// let name = "Anshul";
let username: string = "Virat";
let userAge: number = 39;
let isLoggedIn: boolean = true;

// --- any vs unknown ---
// any allows you to assign any type of value and perform any operation without type checking
let dangeourosValue: any = "Hello";
dangeourosValue = 123; // No error, but can lead to runtime issues
dangeourosValue.toUppercase(); // No error, but can cause runtime error if dangeourosvalue is not a string

// unknown is safer than any
let safeValue: unknown = "Hello";
// safeValue.toUppercase(); // Error: Object is of type 'unknown'. You need to perform type checking before using it
if (typeof safeValue === "string") {
  safeValue.toUpperCase(); // No error, because we have checked that safeValue is a string
}

// --- Arrays ---
let fruits: string[] = ["Apple", "Banana", "Orange"];
let numbers: number[] = [1, 2, 3, 4, 5];
fruits.push("Grapes"); // No error
// numbers.push("Six"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'

const readOnlyFruits: ReadonlyArray<string> = ["Apple", "Banana", "Orange"];
// readOnlyFruits.push("Grapes"); // Error: Property 'push' does not exist on type 'readonly string[]'

// --- Tuples : fixed length arrays with specific types for each element ---
// [name: string, age: number, nickname?: string]
let user: [string, number, string?] = ["Anshul", 20]; // valid tuple
let person: [string, number, string?] = ["Virat", 37, "King"];

// --- as-const : used to create literal types ---
const ROLES = ["Admin", "Editor", "Viewer"] as const;
// this creates a type: "Admin" | "Editor" | "Viewer"
type Role = (typeof ROLES)[number];
let myRole: Role = "Admin"; // valid
// let badRole: Role = "User"; // Error: Type "User" is not assignable to type 'Role'

// SECTION 2: Interfaces & Type Aliases

// --- Interfaces: User ---
interface User {
  name: string;
  age: number;
  email?: string; // optional property
  readonly createdAt: Date; // read-only property
}

const user1: User = {
  name: "Anshul",
  age: 20,
  createdAt: new Date(),
  // Email is optional, so we can Skip it
};
// user1.createdAt = "2024-01-01"; // Error: Cannot assign to 'createdAt' because it is a read-only property

// --- Extending Interfaces ---
interface Employee extends User {
  role: "Admin" | "Editor" | "Viewer";
}

const admin: Employee = {
  name: "Virat",
  age: 37,
  email: "virat@gmail.com", // optional but we can include it
  createdAt: new Date(),
  role: "Admin",
};

// --- Type Aliases: same as interfaces but more flexible ---
type UserType = {
  id: number;
  name: string;
};

type Address = {
  city: string;
  pinCode: number;
  country: string;
};

// --- Intersection Types: combine multiple types into one ---
type UserWithAddress = UserType & Address;
const fullUser: UserWithAddress = {
  id: 1,
  name: "Divy",
  city: "Ahmedabad",
  pinCode: 380015,
  country: "India",
};

// --- Index Signatures: for dynamic properties ---
interface StringMap {
  [key: string]: string;
}

const translations: StringMap = {
  hello: "Namaste",
  Bye: "Alvida",
  Thanks: "Dhanyavaad",
  // can add any key-value pair as long as value is a string
};

// --- Declaration Merging: declare the same interface multiple times and TypeScript will merge them ---

// TypeScript MERGES them into one! Only works with interface, not type alias.
interface config {
  theme: "light" | "dark";
}

interface config {
  // same name — TypeScript merges these
  language: string;
}

// Now config has both theme and language properties
const appConfig: config = {
  theme: "dark",
  language: "Gujarati",
};

// SECTION 3: Union, Literal, Intersection

// --- Union Types: a variable can hold one of several types ---
let employeeId: number | string; // can be either number or string
employeeId = 123; // valid
employeeId = "EMP001"; // also valid

function printId(id: number | string) {
  if (typeof id === "number") {
    console.log(`Employee ID (Number) : ${id}`);
  }
  if (typeof id === "string") {
    console.log(`Employwee ID (String) : ${id}`);
  }
}

// --- Literal Types: a variable can only hold a specific value ---
type Direction = "North" | "South" | "East" | "West";
let moveDirection: Direction;
moveDirection = "North"; // valid
// moveDirection = "Up"; // Error: Type '"Up"' is not assignable to type 'Direction'

type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let roll : DiceRoll;
roll = 3; // valid
// roll = 7; // Error: Type '7' is not assignable to type 'DiceRoll'

