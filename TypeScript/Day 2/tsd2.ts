export {};

interface circle {
  kind: "circle";
  radius: number;
}

interface square {
  kind: "square";
  sideLength: number;
}

interface rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

type shape = circle | square | rectangle;

function area(s: shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius ** 2;
    case "square":
      return s.sideLength ** 2;
    case "rectangle":
      return s.width * s.height;
    default:
      const _exhaustiveCheck: never = s;
      return _exhaustiveCheck;
  }
}

const c: shape = { kind: "circle", radius: 10 };
console.log(area(c));

const s: shape = { kind: "square", sideLength: 5 };
console.log(area(s));

// --- Generic functions ---
// T is generic type parameter - like a placeholder
// Typescript infers T from whatever you pass in

function wrap<T>(value: T): T {
  return value;
}

console.log(wrap(5));
console.log(wrap("Virat Kohli"));
console.log(
  wrap({
    name: "Virat Kohli",
    age: 39,
    Nickname: "King Kohli",
    spause: "Anushka Sharma",
  }),
);
console.log(wrap(true));
console.log(wrap([1, 2, "Anshul", 3.14, false]));
// rarely used, but you can also explicitly specify the type argument when calling the function
console.log(wrap<string>(`Wrap :Anshul Panchal`));

function getLengthWithoutExtend<T>(value: T): number {
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length;
  }
  return 0;
}

function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

console.log(`Length of Anshul is : ${getLength("Anshul")}`);
// console.log(getLength(5));
console.log(`Length of [1, 2, 3, 4, 5] is : ${getLength([1, 2, 3, 4, 5])}`);
console.log(
  `Length of {length: 11, name:"Virat Kohli"} is : ${getLength({ length: 11, name: "Virat Kohli" })}`,
);
console.log(
  `Length without extend of {name:"Anshul"} is : ${getLengthWithoutExtend("Anshul Panchal")}`,
);
// console.log(getLengthWithoutExtend(5));
console.log(
  `Length without extend of {name:"Anshul"} is : ${getLengthWithoutExtend([1, 2, 3, 4, 5, 6, 7])}`,
);

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "AB de Villiers",
  email: "abd@gmail.com",
};

console.log(getProperty(user, "name"));
console.log(getProperty(user, "email"));
// console.log(getProperty(user, "age")); // Error: Argument of type '"age"' is not         assignable to parameter of type '"id" | "name" | "email"'.

// Generic interface — describes a box holding any type
interface Box<T> {
  value: T;
  label: string;
}

const stringBox: Box<string> = {
  value: "Hello, World!",
  label: "Greeting",
};

const numberBox: Box<number> = {
  value: 18,
  label: "Virat's jersey number",
};

// Multiple type parameters like key-value pair
interface Pair<K, V> {
  key: K;
  value: V;
}

const p: Pair<string, number> = {
  key: "Virat's age",
  value: 39,
};

// Defaul type parameter - if not specified, it will be string
interface Container<T = string> {
  data: T;
}

const defaultContainer: Container = {
  data: "Default is string",
};

const numberContainer: Container<number> = {
  data: 123546,
};

// Utility types - built-in generic types provided by TypeScript
// instead of writing this types ourselves, we can transform existing types using utility types

// This is our base — every utility type example uses this
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

// Every firld becomes optional
type PartialUser = Partial<User>;
// same as { id?: number; name?: string; email?: string; age?: number}

// Real use case: update function you only send what changed
function updateUser(id: number, newData: Partial<User>): void {
  // changes can have any combination of fields - not all fields are required
  console.log(`Updating user ${id} with data:`, newData);             
}

updateUser(1, { name: "New Name" });         // only name
updateUser(1, { email: "new@mail.com" });    // only email
updateUser(1, { name: "X", email: "Y" });   // both

// Required 
// Opposite of Partial — removes all ? from every field
type RequiredUser = Required<User>;
// same as: { id: number; name: string; email: string; age: number }
// Notice age is now required even though it was optional!

// Real use: after validation, when you KNOW all fields are present
function saveUser(user: Required<User>): void {
  // guaranteed all fields exist — safe to save
}

type FrozenUser = Readonly<User>;

const user2: FrozenUser = { id: 1, name: "Arjun", email: "a@b.com" };
// user.name = "Priya"; // ❌ ERROR — cannot reassign readonly property

// Real use: config objects, constants passed around the app