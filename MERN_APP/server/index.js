const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const authRoutes = require("./routes/auth-routes");
const cors = require("cors");
// const swaggerJSDoc = require("swagger-jsdoc");
// const swaggerui = require("swagger-ui-express");
const app = express();

// swagger options
// const options = {
//   definition: {
    
//     openapi: "3.0.0",
//     info: {
//       title: "Ecommerce REST APi Project (week5)",
//       version: "1.0.0",
//     },
//     servers: [{
//       url:"http://localhost:8000/",
//     }],
//   },
//   apis:["./routes/*.js"],
// }
// const swaggerSpecs = swaggerJSDoc(options);
app.use(cors());
// Body parser middleware
app.use(bodyParser.json());


// to handler cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// app.use(swaggerui.serve, swaggerui.setup(swaggerSpecs));

// Routes
app.get('/', (req, res) => {
  res.send('week 5 day 1 crud api');
});


app.use(routes);
app.use(authRoutes)


// Start server
const PORT = 8000;
mongoose.connect("mongodb+srv://waseem:netixsol.93@netixsol.bvi8glx.mongodb.net/mern-app").then((db) => {
	app.listen(PORT, () => console.log("app is running on port 8000 and db connected"));
});
 