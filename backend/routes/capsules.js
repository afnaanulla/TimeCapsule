const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { ObjectId } = require('mongoose').Types;
const Capsule = require('../models/capsule');
const { v4: uuidv4 } = require('uuid');

// const sharableLink = `${req.protocol}://${req.get('host')}/api/capsules/share/${uuidv4()}`;

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

router.post('/upload', upload.array("images", 5), (req, res) => {
  if (req.files.length > 0) {
    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    res.json({ imageUrls });
  } else {
    res.status(400).send("No files uploaded");
  }
})

// Route to create a new capsule
router.post('/create', verifySession, async (req, res) => {
  try {
    const { title, description, unlockDate, content, images, isOneTimeView } = req.body;
    const userId = req.session.user._id;
    const sharableId = uuidv4();

    console.log("Received Images:", images);
    // Extract uploaded image paths
    const imageArray = Array.isArray(images) ? images : [];



    console.log("Image URLs received:", images);

    const newCapsule = new Capsule({
      title,
      description,
      unlockDate,
      content,
      images: imageArray, // Save images array
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

router.get('/share/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Requested id ', id);
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

router.put('/capsules/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const updatedCapsule = await Capsule.findByIdAndUpdate(id, req.body, { new: true });

      if (!updatedCapsule) {
          return res.status(404).json({ message: 'Capsule not found' });
      }

      res.json(updatedCapsule);
  } catch (error) {
      res.status(500).json({ message: 'Error updating capsule', error });
  }
});

module.exports = router;
