const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    templateName: { type: String, required: true },
    templateCategory: { type: String, required: true },
    createdBy: { 
        type: String, 
        required: true, 
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // Regular expression for validating email format
    },
    approvalStatus: { type: Boolean, required: true }, // Make sure it's a boolean
    CompletedDate:{
        type: Date,
        required: true,
        default: Date.now},
    zipFile: { type: String },  // Store the path to the zip file
    unzippedFiles: [{ type: String }] ,// List of unzipped file names or paths

});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;