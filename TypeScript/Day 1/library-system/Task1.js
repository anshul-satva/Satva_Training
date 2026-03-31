"use strict";
// SECTION 1: --- Primitive Types & Annotations ---
Object.defineProperty(exports, "__esModule", { value: true });
// let name = "Anshul";
let username = "Virat";
let userAge = 39;
let isLoggedIn = true;
// --- any vs unknown ---
// any allows you to assign any type of value and perform any operation without type checking
let dangeourosValue = "Hello";
dangeourosValue = 123; // No error, but can lead to runtime issues
// dangeourosValue.toUppercase(); // No error, but can cause runtime error if dangeourosvalue is not a string
// unknown is safer than any
let safeValue = "Hello";
// safeValue.toUppercase(); // Error: Object is of type 'unknown'. You need to perform type checking before using it
if (typeof safeValue === "string") {
    safeValue.toUpperCase(); // No error, because we have checked that safeValue is a string
}
// --- Arrays ---
let numbers = [1, 2, 3, 4, 5, 6, 18];
let name = ["Anshul", "Divy", "Dhruv", 18];
name.push("Virat"); // No error, because fruits can contain both strings and numbers
name.push(11); // No error
// numbers.push("Six"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'
printNumbers(numbers);
function printNumbers(nums) {
    nums.forEach((num) => console.log(num + " is a number"));
}
const readOnlyFruits = ["Apple", "Banana", "Orange"];
// readOnlyFruits.push("Grapes"); // Error: Property 'push' does not exist on type 'readonly string[]'
// --- Tuples : fixed length arrays with specific types for each element ---
// [name: string, age: number, nickname?: string]
let user = ["Anshul", 20]; // valid tuple
let person = ["Virat", 37, "King"];
person.push("Chennai"); // valid, because the third element is optional
person.pop(); // valid, removes the last element (Chennai) and now person is back to 3 elements
person.pop(); // valid, removes the last element (King) and now person is back to 2 elements
person.pop(); // valid, removes the last element (37) and now person is back to 1 element
person.push("Anshul"); // valid, because the first element is a string
console.log(person);
// --- as-const : used to create literal types ---
const ROLES = ["Admin", "Editor", "Viewer"];
let myRole = "Admin"; // valid
const user1 = {
    name: "Anshul",
    age: 20,
    createdAt: new Date(),
    // Email is optional, so we can Skip it
};
const admin = {
    name: "Virat",
    age: 37,
    email: "virat@gmail.com", // optional but we can include it
    createdAt: new Date(),
    role: "Admin",
};
const fullUser = {
    id: 1,
    name: "Divy",
    city: "Ahmedabad",
    pinCode: 380015,
    country: "India",
};
const translations = {
    hello: "Namaste",
    Bye: "Alvida",
    Thanks: "Dhanyavaad",
    // can add any key-value pair as long as value is a string
};
// Now config has both theme and language properties
const appConfig = {
    theme: "dark",
    language: "Gujarati",
};


// SECTION 3: Union, Literal, Intersection
// --- Union Types: a variable can hold one of several types ---
let employeeId; // can be either number or string
employeeId = 123; // valid
employeeId = "EMP001"; // also valid
function printId(id) {
    if (typeof id === "number") {
        console.log(`Employee ID (Number) : ${id}`);
    }
    if (typeof id === "string") {
        console.log(`Employwee ID (String) : ${id}`);
    }
}
let moveDirection;
moveDirection = "North"; // valid
let roll;
roll = 3; // valid
// roll = 7; // Error: Type '7' is not assignable to type 'DiceRoll'
//# sourceMappingURL=Task1.js.map