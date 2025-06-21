const cloudinary = require('../config/cloudinary');
const Message = require('../models/Message.model');
const User = require('../models/User.model');
const PushSubscription = require('../models/PushSubscription.model');
const webpush = require('../utils/push');
const fs = require('fs');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'chat-images',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    // Create message with image
    const message = new Message({
      content: req.body.content || '',
      sender: req.user._id,
      receiver: req.body.receiver,
      type: 'image',
      imageUrl: result.secure_url
    });

    await message.save();

    // Fetch the fully populated message
    const populatedMessage = await Message.findById(message._id).lean();

    // Send push notification to receiver
    try {
      const recipientSub = await PushSubscription.findOne({ userId: req.body.receiver });
      if (recipientSub) {
        const payload = JSON.stringify({
          title: "New Image Message",
          body: `${req.user.username} sent you an image`,
          // Optionally add icon, url, etc.
        });
        await webpush.sendNotification(recipientSub.subscription, payload);
      }
    } catch (err) {
      console.error("Push notification error (image):", err);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Upload error:', error);
    // Clean up file on error too
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error uploading image' });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to Cloudinary with profile picture specific settings
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile-pictures',
      transformation: [
        { width: 200, height: 200, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    });

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    // Update user's profile picture
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: result.secure_url },
      { new: true, select: '-password' }
    );

    res.json({ 
      message: 'Profile picture updated successfully',
      profilePicture: result.secure_url,
      user 
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    // Clean up file on error too
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error uploading profile picture' });
  }
};

module.exports = {
  uploadImage,
  uploadProfilePicture
}; 