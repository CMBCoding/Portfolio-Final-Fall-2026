/* Get the form element from the HTML file on submit */
 document.getElementById("contact-form").onsubmit = () => {
    
    //Create a boolean value to check the status of form validation
    let valid = true;

    /*With every press (valid) of the submit button, 
    call the wipeErrors() */
    wipeErrors();

    let meet = "";

    //Create and assign variables for the form elements
    //Get the value of first name, trim and store it.
    let fname = document.getElementById("fname").value.trim(); 
    //Get the value of last name, trim and store it.
    let lname = document.getElementById("lname").value.trim();
    //Get the value of job title, trim and store it.
    let jobTitle = document.getElementById("jobTitle").value.trim();
    //Get the value of company, trim and store it.
    let company = document.getElementById("company").value.trim();
    //Get the value of email, trim and store it.
    let email = document.getElementById("email").value;
    let linkedIn = document.getElementById("linkedIn").value.trim();
    //Get the value of meet-list, trim and and store it.
    let meetList = document.getElementById("meetList").value.trim();
    //Get the value of meet-other, trim and store it.
    let meetOther = document.getElementById("meetOther").value.trim();
    //Get the value of mail-list and store it.
    let mailList = document.getElementById("mailList");
    //Get the value of meet-other, trim and store it.
    let message = document.getElementById("message").value.trim();

    return valid;
 };


//Function that clears out the error displays
function wipeErrors() {
    //Grab all of the error display elements
    let errorMsgs = document.getElementsByClassName("error-msg");

    //For the length of the errorMsgs nodelist
    for (let i = 0; i < errorMsgs.length; i++) {
        /*Get the element at position i in the nodelist, change
        it's visibility back to "hidden" */
        errorMsgs[i].style.visibility = "hidden";
    };
    
};

