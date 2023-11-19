const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const path = require("path");

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fafoo_store",
});
db.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

 app.use(cors(
  {
     origin: "http://192.168.2.17:8080/signup_page", 
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
   credentials: true,
  }
)
);
app.use(bodyParser.json());

app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, password], (err) => {
    if (err) {
      res.status(500).send("Error saving user to database");
    } else {
      res.status(200).send("User registered successfully");
    }
  });
});

// Xử lý GET request cho trang đăng ký
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/Sign_Page.vue"));
});


// -------------------------------------------------------------------------------------------------


app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

  db.query(query, (err, result) => {
    if (err) {
      console.log("Error querying MySQL:", err);
      res.status(500).send("Internal Server Error");
    } else {
      if (result.length > 0) {
        res.status(200).send("Login successful");
      } else {
        res.status(401).send("Invalid username or password");
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});