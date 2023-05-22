//Code is taken from https://vlegalwaymayo.atu.ie/mod/folder/view.php?id=688942 //

const express = require('express');
const app = express();
const bodyParser = require("body-parser");

// Configure app to use bodyParser middleware for handling form data
app.use(bodyParser.urlencoded({extended: true}));

// Set EJS as the view engine for rendering pages
app.set("view engine", "ejs");




// Import the custom authentication module
const auth = require('./auth.js');

// Create two users for testing authentication
auth.createUser("user", "pass");
auth.createUser("user", "pass");


// Import and configure MySQL database connection
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'T1mmyR0ss',
  database: 'G00425678'
});

// Establish connection with the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
  } else {
    console.log('Connected to database!');
  }
}); 
// Server static files from public directory
app.use(express.static("home"));

app.get("/home", function(req, res){
 res.render("home.ejs");
})


// Route to handle login form submission
 app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
  
    const authenticated = auth.authenticateUser(username, password);
    console.log(authenticated);
  
    // Check if authentication is successful
    if(authenticated) {
      console.log("Authentication was successful!");
      res.render("home");
    } else {
      console.log("Authentication was NOT successful!");
      res.render("failed");
    }
  }); 

app.get("/shop", function(req, res){
    const ID = req.query.cat;
    connection.query("SELECT * FROM excel2g00425678 WHERE ID = ?", [ID], function(err, rows, fields)
    {
        if(err) 
      {
        console.error("Error retrieving data from database:", err);
        res.status(500).send("Error retreiving data from database");
      }
       else if(rows.length === 0)
      {
        console.error("No rows found for ID $[ID]");
        
      } 
      else 
      {
        // Log retrieved data and render the product page with the data
        console.log("Data retrieved from the Database!");
        console.log(rows[0].Product);
        console.log(rows[0].Price);
        const prodName = rows[0].Product;
        const prodPrice = rows[0].Price;
        //const prodManufacturer = rows[0].Manufacturer;
        const image = rows[0].Image;
        
        res.render("test.ejs", {myMessage: prodName, price: prodPrice, myImage: image});


    }
})
});



// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server started on port 3000');
    });
