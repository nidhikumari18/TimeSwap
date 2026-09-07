const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  uploadProfilePicture,
  exploreUsers,
  findSkillMatches,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const multer = require("multer");

const router = express.Router();

// =====================================================
// MULTER
// =====================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// =====================================================
// PROFILE
// =====================================================

router.get(
  "/profile",
  protect,
  getMyProfile
);

router.put(
  "/profile",
  protect,
  updateMyProfile
);

router.post(
  "/profile/picture",
  protect,
  upload.single("profilePicture"),
  uploadProfilePicture
);

// =====================================================
// EXPLORE
// =====================================================

router.get(
  "/explore",
  protect,
  exploreUsers
);

// =====================================================
// MATCHES
// =====================================================

router.get(
  "/matches",
  protect,
  findSkillMatches
);

module.exports = router;