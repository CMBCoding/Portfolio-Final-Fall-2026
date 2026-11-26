/* Import the node express module */
import express from 'express';
/* Import express sessiosn */
import session from 'express-session';
/* Import the mysql2 module */
import mysql2 from 'mysql2'
/* Import validation.js script for server-side validation */
import { validateFormData } from './public/scripts/validation.js';
/* Import the donenve module */
import dotnev from 'dotenv'
dotnev.config();

//Create an instance of an Express application
const app = express();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

//Set up and define a port number where the server will listen
const PORT = 3010;

//Enable static file serving
app.use(express.static('public'));

//Add view engine
app.set('view engine', 'ejs');

//Add middleware for the app
app.use(express.urlencoded({extended: true}));

//Create sessions middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 66}
}));

//Array to hold contact info
const contacts = [];

//Login method that takes in a login request, response and next.
function requireLogin(req, res, next) {
    //If the user is logged in, send them forward
    if (req.session.loggedIn) {
        next();
    } else {
    //Else, redirect back to the login page
        res.redirect('/login')
    }
}

//Define the default route ("/")
app.get('/', (req, res) => {
    //In response to the request, send the html file at the directory.
    res.render('home', {title : 'Portfolio - Home'});
});

//Add a route to the confirmation page
app.get('/confirm', (req, res) => {
    res.render('confirm', {title : 'Portfolio - Confirm'})
});

//Add a route to the contact page
app.get('/contact', (req, res) => {
    res.render('contact', { errors: [], title: 'Portfolio - Contact'})
});

//Add a route to the login page
app.get('/login', (req, res) => {
    res.render('login', {error: null, title: 'Portfolio - Login'});
});

//Add login user and password check to the login page
app.post('/login', (req, res) => {
    //Pull out the values from the user submitted username and password
    const username = req.body.login_user;
    const password = req.body.login_pwd;

    //Compare the user submitted username and password with those stored in the .env file
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
        //If both match, then log the user in
        req.session.loggedIn = true;
        res.redirect('/admin');
    } else {
        //If they do not, redirect to the login page and display the error message.
        res.render('login', {error: 'Invalid username or password', title: 'Portfolio - Login' });
    }
});

//Add a route to the admin page
app.get('/admin', requireLogin, async(req, res) => {
    try {
        //Attempt to fetch the contacts table from the database
        const contacts = await pool.query(`SELECT * FROM Contacts ORDER BY id DESC`);
        console.log(contacts[0]);

        //Render the table onto the admin page
        res.render('admin', {contacts : contacts[0], title : 'Portfolio - Admin'})
    } catch (error) {
        console.log("Database error", error);
        res.status(500).send(`Database error ${error.message}`) 
    }
});

//Add a route to the resume page
app.get('/resume', (req, res) => {
    res.render('resume', {title: 'Porfolio - Resume'})
});

//Add a route to the porfolio page
app.get('/portfolio', (req, res) => {
    res.render('portfolio', {title: 'Porfolio - Projects'})
});

//Post the data from the contacts page into the admin pages
app.post('/confirm', async(req, res) => {
    try {    
        console.log(req.body);

        //Create a JSON object to store the data from each submission from the contacts posting
        const contact = req.body;
        //Validate the data on the servers
        const valid = validateFormData(contact);

        //If the data is not valid..
        if (!valid.isValid) {
            console.log(valid); //Log an error
            res.render('contact', { errors: valid.errors, title: 'Portfolio - Contact'}) //Reroute back the contact form
            return; //Halt execution via a return statement.
        }

        //Pull out and use one meeting vector to store to the DB.
        if (contact.meetList && contact.meetList !== 'none') {
            contact.meeting = contact.meetList;
        } else {
            contact.meeting = contact.meetOther;
        }

        //SQL insert query to add data back into the database.
        const sqlInject = `INSERT INTO Contacts (FirstName, LastName, JobTitle, Company, LinkedIn, 
        Email, Meeting, Message, MailList, Format)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

        //Set the parameters to fill the placeholder values in the sql injection.
        const params = [
            contact.fname, 
            contact.lname,
            contact.jobTitle,
            contact.company,
            contact.linkedIn,
            contact.email,
            contact.meeting,
            contact.message,
            contact.mailList || "none", 
            contact.format || "none"
        ]

        //Execute the above query using the parameters defined above
        const [result] = await pool.execute(sqlInject, params);

        //Render the submission result on the confirm page
        res.render('confirm', {contact : contact, title : 'Portfolio - Confirm'})
    }  catch (error) {
        console.log("Error in form data submission", error);
        res.status(500).send(`Unfortunately, there was an error in processing the form data. Please try again.`) 
    }
});

//Start a server in the designated port
app.listen(PORT, () => {
    console.log(`Server running in port http://localhost:${PORT}`);
});