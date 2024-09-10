// 1. Bug: Division by zero (logical error)
function divide(a, b) {
    return a / b; // Doesn't check for division by zero
}
console.log(divide(5, 0)); // This will result in Infinity instead of error

// 2. Vulnerability: Hardcoded credentials
const password = "secretPassword123"; // Sensitive information hardcoded

// 3. Code Smell: Duplicate code
function square(num) {
    return num * num;
}
function doubleSquare(num) {
    return num * num; // Duplicates square logic
}

// 4. Security Risk: Insecure randomness
function generateToken() {
    return Math.random().toString(36).substr(2); // Insecure token generation
}
console.log("Generated Token: ", generateToken());

// 5. Code Smell: Magic numbers
function calculateCircleArea(radius) {
    return radius * 3.14159 * radius; // Hardcoded Pi value (magic number)
}

console.log("Circle area: ", calculateCircleArea(5));


// Unused variable (SonarQube should detect this)
const unusedVar = "This variable is never used";

// Example of a function with code duplication
function duplicateFunction() {
    console.log("This is a duplicated line.");
    console.log("This is a duplicated line.");
    return true;
}

function anotherDuplicateFunction() {
    console.log("This is a duplicated line.");
    console.log("This is a duplicated line.");
    return true;
}

// Improper error handling (catch block does nothing)
function errorProneFunction() {
    try {
        let a = 1;
        let b = 0;
        let c = a / b;  // Division by zero
    } catch (error) {
        // Catch block does nothing
    }
}

// Function without proper exception handling
function riskyFunction() {
    JSON.parse("{ malformed json }");  // This will throw an error
}

// Cyclomatic complexity issue (too many if-else blocks)
function complexFunction(n) {
    if (n === 1) {
        return "One";
    } else if (n === 2) {
        return "Two";
    } else if (n === 3) {
        return "Three";
    } else if (n === 4) {
        return "Four";
    } else {
        return "Unknown number";
    }
}

// Inefficient loop
function inefficientLoop() {
    for (let i = 0; i < 1000000; i++) {
        console.log(i);  // This will unnecessarily log a large number of items
    }
}

// Hardcoded credentials (Security issue SonarQube should detect)
const username = "admin";
const password = "password123";

// Dead code
function deadCodeFunction() {
    return;
    console.log("This line will never be reached.");
}

module.exports = {
    duplicateFunction,
    anotherDuplicateFunction,
    errorProneFunction,
    riskyFunction,
    complexFunction,
    inefficientLoop,
    deadCodeFunction
};

