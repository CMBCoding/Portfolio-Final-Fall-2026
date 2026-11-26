export function validateFormData(data) {
    console.log("Validation in progress...");

    //Create an array to store the error messages in
    const errors = [];

    //Validate the meeting vector
    const validMeetingVectors = ["none", "In person", "Through an associate", "Through social media"];
    //If the values sent in from the data does not contain the above methods
    if (!validMeetingVectors.includes(data.meetList)) {
        errors.push("Meeting vector is undefined.")
    }

    return {
        //If the length of the errors array is 0, there are no errors
        isValid: errors.length === 0,
        errors
    }
}