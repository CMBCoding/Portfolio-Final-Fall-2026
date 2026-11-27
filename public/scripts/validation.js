export function validateFormData(data) {
    console.log("Validation in progress...");

    //Create an array to store the error messages in
    const errors = [];

    //Create a regular expression that tests for emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    /* Checks for [any string of characters] + 
    [@] + [any string of characters] + 
    [.] + [any string of characters] */

    //Create a regular expression that tests for linkedIn links
    const liRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/.*/;
    /* Checks for [https or not] + [www. or not] + [linkedin.com] +
     [any string of characters] */

    //Validate the names
    //If there is no first name or the field is empty
    if (!data.fname || data.fname.trim() === "") {
        errors.push("First name field is incomplete/undefined.");
    }
    //If there is no last name or the field is empty
    if (!data.lname || data.lname.trim() === "") {
        errors.push("Last name field is incomplete/undefined.");
    }

    //Get and store the email
    const email = (data.email || "").trim();
    const mailListYes = data.mailList === "Yes";

    //Get and store the linkedIn
    const linkedIn = (data.linkedIn || "").trim();

    //Get and store the value of the other feild
    const meetOther = (data.meetOther).trim();

    //If the mail list is selected.
    if (mailListYes) {
        if (email === "") {
            errors.push("Email required to add to mailing list.");
        }
        //If the data format is neither HTML or Text
        if (!["HTML", "Text"].includes(data.format)) {
            errors.push("Please select a format for the mailing list.")
        }
    }

    //If the LinkedIn link is not in the correct format...
    if (linkedIn !== "" && (!liRegex.test(linkedIn))) {
        errors.push("Please enter a valid LinkedIn URL.");
    }

    //Validate the email
    if (email !== ""  && (!emailRegex.test(email))) {
        errors.push("Please enter a valid email.");
    }

    //Validate the meeting vector
    const validMeetingVectors = ["In person", "Through an associate", "Through social media"];
    //If the values sent in from the data does not contain the above methods
    if (!validMeetingVectors.includes(data.meetList) && meetOther === "") {
        errors.push("Meeting vector is undefined.")
    }

    return {
        //If the length of the errors array is 0, there are no errors
        isValid: errors.length === 0,
        errors
    }
}