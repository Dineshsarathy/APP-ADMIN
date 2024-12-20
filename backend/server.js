const express = require('express');
//DB Import
const connectDB = require('./config/db')
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
//Routing Imports
const templateRouter = require('./routes/templateRouter')// Import your routes
const taskRoutes = require('./routes/taskReports')
const bugreport = require('./routes/bugreport')
const AuthRouter = require('./routes/EmpAuthentication')
const jwtAuthenticate  = require('./middlewares/AuthMiddleWare') 

dotenv.config(); // Load environment variables from .env file

const app = express();

// Connect to MongoDB
connectDB();
  
// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json()); // Parse incoming requests with JSON payloads




// Use the superadminRouter for routes related to templates
app.use('/auth/employee', AuthRouter)
app.use('/api/template', templateRouter,jwtAuthenticate);
app.use('/api/taskreports', taskRoutes);
app.use('/api/bugreport',bugreport)
// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`,process.env.MONGO_URI));
