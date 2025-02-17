const express = require('express');
const path = require('path');
const router = express.Router();
const { ObjectId } = require('mongoose').Types;
const Capsule = require('../models/capsule');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../routes/auth');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const fs = require('fs');
  const { v2: cloudinary } = require('cloudinary'); // ✅ Import Cloudinary
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  require('dotenv').config();


  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'time_capsule', // Change this to your folder name
        format: async (req, file) => 'jpg', // Convert all images to JPG
        public_id: (req, file) => file.originalname.split('.')[0] // Keep original name
    }
  });

  // Debugging middleware
  const upload = multer({ storage });

  // ✅ Upload Route
  router.post('/upload', upload.array('images', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const uploadedImages = req.files.map(file => ({
            url: file.path // Cloudinary provides direct URL
        }));

        return res.json({ images: uploadedImages });

    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ error: 'Image upload failed' });
    }
});


// route to create a new capsule
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { title, description, unlockDate, content, images, isOneTimeView } = req.body;
    const userId = req.user._id;
    const sharableId = uuidv4();

    console.log("Received Images:", images);
    const imageArray = Array.isArray(images) ? images : [];



    console.log("Image URLs received:", images);

    const newCapsule = new Capsule({
      title,
      description,
      unlockDate,
      content,
      images,
      user: userId,
      isOneTimeView,
      sharableLink: sharableId,
    });

    const savedCapsule = await newCapsule.save();
    res.status(201).json(savedCapsule);
  } catch (error) {
    console.error("Error creating capsule:", error);
    res.status(500).json({ message: "Failed to create capsule", error: error.message });
  }
});

// route to get all capsules for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("User ID from session:", userId);

    const userCapsules = await Capsule.find({ user: userId });
    if (userCapsules.length === 0) {
      return res.status(404).json({ message: 'No capsules found' });
    }

    res.status(200).json(userCapsules);
  } catch (error) {
    console.error('Error fetching capsules:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// route to get a single capsule by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  // const { password } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid capsule ID' });
  }

  try {
    const capsule = await Capsule.findById(id);
    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' });
    }
    if(capsule.isOneTimeView && capsule.viewed) {
      return res.status(403).json({ message: 'This capsule is already viewed '});
    }

    if(capsule.isOneTimeView) {
      capsule.viewed = true;
      await capsule.save();
    }

    res.status(200).json(capsule);
  } catch (error) {
    console.error('Error fetching capsule:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

//route to delete capsule

router.delete('/:id', authenticateToken, async(req, res) => {
  const { id } = req.params;

  if(!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid capsule '});
  }
  try {
    const capsule = await Capsule.findOneAndDelete({ _id: id, user: req.user._id });

    if(!capsule) {
      return res.status(404).json({ message: 'Capsule not found or not authorized to delete '});
    }
    return res.status(200).json({ message: 'Capsule deleted successfully '});
  }
  catch(error) {
    console.error('Error deleting capsule ', error);
    return res.status(500).json({ message: 'Internal server error '});
  }
});

// route to share capsule

router.get('/share/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // console.log('Requested id ', id);
    const capsule = await Capsule.findOne({ sharableLink: id });



    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    res.status(200).json({
      title: capsule.title,
      description: capsule.description,
      unlockDate: capsule.unlockDate,
      content: capsule.content,
      images: capsule.images
    });

  } catch (error) {
    console.error('Error fetching shared capsule:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// route to update capsule
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Get the logged-in user ID
    const updateData = req.body; // Get update fields from request body

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid capsule ID' });
    }

    const updatedCapsule = await Capsule.findOneAndUpdate(
      { _id: id, user: userId }, // Find capsule belonging to user
      updateData, // Update with new data
      { new: true } // Return updated document
    );

    if (!updatedCapsule) {
      return res.status(404).json({ message: 'Capsule not found or unauthorized' });
    }

    res.status(200).json(updatedCapsule);
  } catch (error) {
    console.error('Error updating capsule:', error);
    res.status(500).json({ message: 'Error updating capsule', error: error.message });
  }
});


module.exports = router;
