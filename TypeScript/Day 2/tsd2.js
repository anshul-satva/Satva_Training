"use strict";
function area(s) {
    switch (s.kind) {
        case "circle":
            return Math.PI * s.radius ** 2;
        case "square":
            return s.sideLength ** 2;
        case "rectangle":
            return s.width * s.height;
        default:
            const _exhaustiveCheck = s;
            return _exhaustiveCheck;
    }
}
const c = { kind: "circle", radius: 10 };
console.log(area(c));
const s = { kind: "square", sideLength: 5 };
console.log(area(s));
// --- Generic functions ---
// T is generic type parameter - like a placeholder
// Typescript infers T from whatever you pass in
function wrap(value) {
    return value;
}
console.log(wrap(5));
console.log(wrap("Virat Kohli"));
console.log(wrap({
    name: "Virat Kohli",
    age: 39,
    Nickname: "King Kohli",
    spause: "Anushka Sharma",
}));
console.log(wrap(true));
console.log(wrap([1, 2, "Anshul", 3.14, false]));
// rarely used, but you can also explicitly specify the type argument when calling the function
console.log(wrap(`Wrap :Anshul Panchal`));
function getLengthWithoutExtend(value) {
    if (typeof value === "string" || Array.isArray(value)) {
        return value.length;
    }
    return 0;
}
function getLength(value) {
    return value.length;
}
console.log(`Length of Anshul is : ${getLength("Anshul")}`);
// console.log(getLength(5));
console.log(`Length of [1, 2, 3, 4, 5] is : ${getLength([1, 2, 3, 4, 5])}`);
console.log(`Length of {length: 11, name:"Virat Kohli"} is : ${getLength({ length: 11, name: "Virat Kohli" })}`);
console.log(`Length without extend of {name:"Anshul"} is : ${getLengthWithoutExtend("Anshul Panchal")}`);
// console.log(getLengthWithoutExtend(5));
console.log(`Length without extend of {name:"Anshul"} is : ${getLengthWithoutExtend([1, 2, 3, 4, 5, 6, 7])}`);
function getProperty(obj, key) {
    return obj[key];
}
const user = {
    id: 1,
    name: "AB de Villiers",
    email: "abd@gmail.com",
};
console.log(getProperty(user, "name"));
console.log(getProperty(user, "email"));
const stringBox = {
    value: "Hello, World!",
    label: "Greeting",
};
const numberBox = {
    value: 18,
    label: "Virat's jersey number",
};
const p = {
    key: "Virat's age",
    value: 39,
};
const defaultContainer = {
    data: "Default is string",
};
const numberContainer = {
    data: 123546,
};
// Utility types - built-in generic types provided by TypeScript
// instead of writing this types ourselves, we can transform existing types using utility types
