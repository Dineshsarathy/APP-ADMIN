const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    Template_ID: { type: String, required: true, unique: true }, // Unique identifier for the template
    Template_Name: { type: String, required: true }, // Template name
    Bug_ID: { type: String, required: true }, // Bug identifier
    Summary: { type: String, required: true }, // Summary of the task/bug
    Screenshot: { type: String, default: null }, // URL or path to screenshot
    Priority: { type: String, required: true, enum: ['Low', 'Medium', 'High'] }, // Priority of the task
    Severity: { type: String, required: true, enum: ['Minor', 'Major', 'Critical'] }, // Severity of the bug
    Status: { 
      type: String, 
      required: true, 
      enum: ['Pending', 'In Progress', 'Completed', 'Delayed'], // Status options
      default: 'Pending' 
    }, 
    Assigned_To: { type: String, required: true }, // Name or ID of the person assigned to
    Assigned_Date: { type: Date, required: true }, // Date task was assigned
    Assigned_Due_Date: { type: Date, required: true }, // Due date for task completion
    Completed_Date: { type: Date, default: null }, // Actual completion date (nullable)
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('TaskReport', taskSchema);
