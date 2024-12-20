const express = require('express');
const router = express.Router();
const BugReports = require('../models/BugReports');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4

//get all bug reports
router.get('/',async (req,res) => {
    try {
        const bugreport = await BugReports.find();
        res.json(bugreport)
    } catch (error) {
        res.status(500).json({message: error.message})
    }    
})

//get bug report by id

router.get('/:id', async (req, res) => {
    try {
        const bugreport = await BugReports.findById(req.params.id);
        if(!BugReports){
            res.status(404).json({message:"Bug report not found"})
        }
        res.json(bugreport);
    } catch (error) {
        res.status(500).json({message: error.message})
    }    
})

//Create an bug report
router.post('/', async (req, res) => {
    const bugreport = new BugReports({
        Temp_id: req.body.Temp_id,
        Temp_Name: req.body.Temp_Name,
        Bug_Id: uuidv4(), // Generate a new UUID for Bug_Id
        Summary: req.body.Summary,
        ScreenShot: req.body.ScreenShot,
        Priority: req.body.Priority,
        Severity: req.body.Severity,
        Assigned_to: req.body.Assigned_to,
        Assigned_date: req.body.Assigned_date,
        Bug_DueDate: req.body.Bug_DueDate,
        Completed_Date: req.body.Completed_Date,
        Bug_status: req.body.Bug_status,
    });

    try {
        const newBug = await bugreport.save();
        res.status(201).json(newBug);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//update Bugreport

router.put('/:id', async (req,res) => {
    try {
        // Find the template by ID
        const bugreport = await BugReports.findById(req.params.id);

        // Check if the template exists
        if (!bugreport) {
            return res.status(404).json({ message: "Bug-Report Not Found" });
        }

        // Update fields only if provided in req.body
        bugreport.Temp_id = req.body.Temp_id || bugreport.Temp_id;
        bugreport.Temp_Name = req.body.Temp_Name || bugreport.Temp_Name;
        bugreport.Bug_Id = req.body.Bug_Id || bugreport.Bug_Id;
        bugreport.Summary = req.body.Summary || bugreport.Summary;
        bugreport.ScreenShot = req.body.ScreenShot || bugreport.ScreenShot;
        bugreport.Priority = req.body.Priority || bugreport.Priority;
        bugreport.Severity = req.body.Severity || bugreport.Severity;
        bugreport.Assigned_to = req.body.Assigned_to || bugreport.Assigned_to;
        bugreport.Assigned_date = req.body.Assigned_date || bugreport.Assigned_date;
        bugreport.Bug_DueDate = req.body.Bug_DueDate || bugreport.Bug_DueDate;
        bugreport.Completed_Date = req.body.Completed_Date || bugreport.Completed_Date;
        bugreport.Bug_DueDate = req.body.Bug_DueDate || bugreport.Bug_DueDate;
        // Update UpdatedAt timestamp if schema has timestamps enabled
        bugreport.UpdatedAt = Date.now();

        // Save updated template
        const updatedBug = await bugreport.save();

        // Send back the updated template in JSON format
        res.json(updatedBug);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

//Delete a bug report Data

router.delete('/:id', async (req, res) => {
    try {
        const bugreport = await BugReports.findById(req.params.id);
        if(!BugReports){
            return res.status(404).json({message: "Bug-report not found!"})
        }
        await BugReports.findByIdAndDelete(bugreport._id)
        res.json({message: `Bug-report ${bugreport.Bug_Id} has been Deleted`})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})




module.exports = router;