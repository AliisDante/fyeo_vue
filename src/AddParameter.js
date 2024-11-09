// Function to add a new parameter with its regex pattern
function addNewParameter(parameters, paramName) {
    // Check if the parameter already exists
    if (!(paramName in parameters)) {
        // Ask the user for the regex pattern (assuming it's provided as input)
        const regexPattern = prompt(`Enter regex pattern for parameter "${paramName}" (e.g., /${paramName}/i):`);
        try {
            // Try to create a regex object from the input pattern
            const regex = eval(regexPattern); // Using eval to dynamically create a regex object
            // Add the new parameter to the parameters object
            parameters[paramName] = { value: true, regex: [regex] };
            console.log(`Parameter "${paramName}" added successfully with regex pattern: ${regex}`);
        } catch (error) {
            console.error('Invalid regex pattern entered. Please try again.');
        }
    } else {
        console.error(`Parameter "${paramName}" already exists.`);
    }
}

// Example usage:
// Define the parameters object
let parameters = {};

// Call the function to add a new parameter
addNewParameter(parameters, "name");
