const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { ObjectId } = require('mongoose').Types;
const Capsule = require('../models/capsule');

const storage = multer.diskStorage({
  destination: (req,file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


const verifySession = (req, res, next) => {
  console.log('Session data: ', req.session);
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
};

router.post('/uploads', upload.single('image'), (req, res) => {
  if(req.file) {
    const imgUlr = `http://localhost:2004/uploads/${req.file.filename}`;
    res.json({ imgUlr });
  }
  else {
    res.status(400).send('No files uploaded ');
  }
});

// Route to create a new capsule
router.post('/create', verifySession, async (req, res) => {
  try {

    const { title, description, unlockDate, content, images } = req.body;
    const userId = req.session.user._id;

    // const { imgUlr } = response;
    if(images && images.length > 0) {
      console.log('Image Url received: ',images);
    }
    const newCapsule = new Capsule({
      title,
      description,
      unlockDate,
      content,
      images,
      user: userId,
    });

    const savedCapsule = await newCapsule.save();
    res.status(201).json(savedCapsule);
  } catch (error) {
    console.error('Error creating capsule:', error);
    res.status(500).json({ message: 'Failed to create capsule', error: error.message });
  }
});

// Route to get all capsules for the logged-in user
router.get('/', verifySession, async (req, res) => {
  try {
    const userId = req.session.user._id;
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

// Route to get a single capsule by ID
router.get('/:id', verifySession, async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid capsule ID' });
  }

  try {
    const capsule = await Capsule.findById(id);
    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    res.status(200).json(capsule);
  } catch (error) {
    console.error('Error fetching capsule:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

//Route to delete capsule

router.delete('/:id', verifySession, async(req, res) => {
  const { id } = req.params;

  if(!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid capsule '});
  }
  try {
    const capsule = await Capsule.findOneAndDelete({ _id: id, user: req.session.user._id });

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

module.exports = router;
