const Template = require('../models/Template');  
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const router = express.Router();


// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads'); // Adjust path if needed
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


// Route to get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to create a new template

router.post('/',async (req, res) => {
  const template = new Template({
    templateName: req.body.templateName,
    templateCategory: req.body.templateCategory,
    createdBy:req.body.createdBy,
    approvalStatus: req.body.approvalStatus,
});
try {
    const newTemp = await template.save();
    res.status(201).json(newTemp);
} catch (error) {
    res.status(400).json({message: error.message});
}
});
// Route to upload and extract zip files
router.post('/upload-zip', upload.single('zipFile'), (req, res) => {
  try {
    const filePath = req.file.path;

    // Extract .zip file
    const zip = new AdmZip(filePath);
    const outputDir = path.join(__dirname, '../extracted_files', `${Date.now()}`);
    zip.extractAllTo(outputDir, true);

    res.status(200).json({
      message: 'File uploaded and extracted successfully!',
      extractedFiles: fs.readdirSync(outputDir), // Optional: list extracted files
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error extracting file', error: err.message });
  }
});


// Route to get a single template by ID
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!Template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update a template
router.put('/:id', async (req, res) => {
  try {
      // Find employee by ID
      const template = await Template.findById(req.params.id);

      // Check if the employee exists
      if (!Template) {
          return res.status(404).json({ message: "Employee not found!" });
      }

      // Update fields only if provided in req.body
      
      template.templateName = req.body.templateName || template.templateName;
      template.templateCategory = req.body.templateCategory || template.templateCategory;
      template.createdBy = req.body.createdBy || template.createdBy;
      template.approvalStatus = req.body.approvalStatus !== undefined ? req.body.approvalStatus : template.approvalStatus;
   
      // Set UpdatedAt field to current time
      template.CompletedDate = Date.now();

      // Save updated template to the database
      const Updatedtemp = await template.save();
     
      // Respond with the updated employee
      res.json(Updatedtemp);

  } catch (error) {
      // Handle any errors
      res.status(400).json({ message: error.message });
  }
});



// Route to delete a template
router.delete('/:id', async (req, res) => {
  try {
    const deletedTemplate = await Template.findByIdAndDelete(req.params.id);
    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Catch-all route for handling non-existent routes
router.all('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = router;

