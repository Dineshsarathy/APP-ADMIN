const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const BugReportSchema = new mongoose.Schema({
    Temp_id: {type: String, require: true,unique: true,default: uuidv4},
    Temp_Name: {type: String, require: true},
    Bug_Id:{type: String, require: true, unique: true,default: uuidv4},
    Summary: {type: String, require: true},
    ScreenShot: {type: String, require: true},
    Priority: {type: String, require: true},
    Severity: {type: String, require: true},
    Assigned_to: {type: String, require: true},
    Assigned_date:{
        type: Date,
        required: true,
        default: Date.now
    },
    Bug_DueDate: {
        type: Date,
        required: false
    },
    Completed_Date:{
        type: Date,
        required: true,
        default: Date.now
    },
    Bug_status: {type: String, require: true}
},{timestamps: true});

module.exports = mongoose.model('BugReports', BugReportSchema);

