const express = require('express');
const router = express.Router();
const TaskReport = require('../models/TaskReports'); // Import the TaskReport model

// GET all task reports
router.get('/', async (req, res) => {
  try {
    const taskReports = await TaskReport.find(); // Fetch all task reports
    res.json(taskReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a task report by ID
router.get('/:id', async (req, res) => {
  try {
    const taskReport = await TaskReport.findById(req.params.id); // Fetch task report by ID
    if (!taskReport) {
      return res.status(404).json({ message: 'Task report not found' });
    }
    res.json(taskReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a new task report
router.post('/', async (req, res) => {
  const taskReport = new TaskReport({
    Template_ID: req.body.Template_ID,
    Template_Name: req.body.Template_Name,
    Bug_ID: req.body.Bug_ID,
    Summary: req.body.Summary,
    Screenshot: req.body.Screenshot,
    Priority: req.body.Priority,
    Severity: req.body.Severity,
    Status: req.body.Status,
    Assigned_To: req.body.Assigned_To,
    Assigned_Date: req.body.Assigned_Date,
    Assigned_Due_Date: req.body.Assigned_Due_Date,
    Completed_Date: req.body.Completed_Date,
  });

  try {
    const newTaskReport = await taskReport.save(); // Save the new task report
    res.status(201).json(newTaskReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a task report by ID
router.put('/:id', async (req, res) => {
  try {
    const taskReport = await TaskReport.findById(req.params.id); // Find task report by ID
    if (!taskReport) {
      return res.status(404).json({ message: 'Task report not found' });
    }

    taskReport.Template_ID = req.body.Template_ID || taskReport.Template_ID;
    taskReport.Template_Name = req.body.Template_Name || taskReport.Template_Name;
    taskReport.Bug_ID = req.body.Bug_ID || taskReport.Bug_ID;
    taskReport.Summary = req.body.Summary || taskReport.Summary;
    taskReport.Screenshot = req.body.Screenshot || taskReport.Screenshot;
    taskReport.Priority = req.body.Priority || taskReport.Priority;
    taskReport.Severity = req.body.Severity || taskReport.Severity;
    taskReport.Status = req.body.Status || taskReport.Status;
    taskReport.Assigned_To = req.body.Assigned_To || taskReport.Assigned_To;
    taskReport.Assigned_Date = req.body.Assigned_Date || taskReport.Assigned_Date;
    taskReport.Assigned_Due_Date = req.body.Assigned_Due_Date || taskReport.Assigned_Due_Date;
    taskReport.Completed_Date = req.body.Completed_Date || taskReport.Completed_Date;

    const updatedTaskReport = await taskReport.save(); // Save updated task report
    res.json(updatedTaskReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a task report by ID
router.delete('/:id', async (req, res) => {
    try {
      // Use findByIdAndDelete to delete the task report by ID
      const taskReport = await TaskReport.findByIdAndDelete(req.params.id);
      if (!taskReport) {
        return res.status(404).json({ message: 'Task report not found' });
      }
      res.json({ message: 'Task report deleted' });
    } catch (error) {
      console.error('Error deleting task report:', error);  // Log the error for debugging
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
