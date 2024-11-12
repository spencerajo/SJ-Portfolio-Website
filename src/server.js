const express = require("express");
const path = require("path");
const app = express();
const sqlite3 = require("sqlite3").verbose(); //Use SQLite3 for this application's database.
const port = 3000;

//Connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'user-database.db'), (err) => { //Create a new database connection to 'user-database.db'.
    console.log('Connected to the SQLite database'); //Log to the server that you have connected to the database.
});

//Middleware to parse JSON bodies
app.use(express.json());

//Route to add users to the database:
app.post('/users',(req, res) => {
    const {id, name, email, role, bio } = req.body; //Create a variable that holds all fields for the HTTP request body to put records in the database.
    const query = 'INSERT INTO users (id, name, email, role, bio) VALUES (?, ?, ?, ?, ?);'; //The SQL query that will insert records into the 'users' table. 
    const params = [id, name, email, role, bio]; //Array to hold all values for a user.

    //Format this HTTP response in the following format: 
    db.run(query, params, function (){
        res.json({ id, name, email, role, bio });
    });
}); 

// Route to display all current users
app.get('/users', (req, res) => {
    const query = "SELECT id, name, email, role, bio FROM users;";
    
    db.all(query, [], (err, rows) => { //'[]' is just initializing an empty array to hold all of the rows. Should the query succeed, 'rows' will contain the array of rows returned by the SQL query.
      res.json(rows); // end the rows as a JSON response to the client.
    });
});


//Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

//Root endpoint to serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "public", "index.html"));
});

//Serve the users.html file for the /users route
app.get("/userpage", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "userpage.html"));
});

//Start the server
app.listen(port, () => {
    console.log(`Application is now listening on port ${port}`);
});
