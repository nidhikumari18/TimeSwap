const express = require("express");
const multer = require("multer");

const imagekit = require("../config/imagekit");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Store uploaded file temporarily in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// ==========================================
// UPLOAD PROFILE IMAGE
// ==========================================

router.post(
  "/profile-picture",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please select an image",
        });
      }

      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `profile-${req.user._id}-${Date.now()}`,
        folder: "/timeswap/profile-pictures",
      });

      res.status(200).json({
        message: "Profile picture uploaded successfully 🌷",
        url: result.url,
        fileId: result.fileId,
      });
    } catch (error) {
      console.error(
        "ImageKit upload error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to upload profile picture",
      });
    }
  }
);

module.exports = router;