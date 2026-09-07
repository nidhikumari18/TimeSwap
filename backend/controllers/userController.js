const User = require("../models/User");
const imagekit = require("../config/imagekit");

// =====================================================
// GET LOGGED-IN USER'S PROFILE
// =====================================================

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// UPDATE LOGGED-IN USER'S PROFILE
// =====================================================

const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      username,
      bio,
      skillsToTeach,
      skillsToLearn,
      profilePicture,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // -----------------------------
    // Update basic information
    // -----------------------------

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (username !== undefined) {
      user.username = username.trim();
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    // -----------------------------
    // Update skills
    // -----------------------------

    if (skillsToTeach !== undefined) {
      user.skillsToTeach = Array.isArray(skillsToTeach)
        ? skillsToTeach
        : [];
    }

    if (skillsToLearn !== undefined) {
      user.skillsToLearn = Array.isArray(skillsToLearn)
        ? skillsToLearn
        : [];
    }

    // -----------------------------
    // Update profile picture URL
    // -----------------------------

    if (profilePicture !== undefined) {
      user.profilePicture = profilePicture;
    }

    const updatedUser = await user.save();

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(200).json({
      message: "Profile updated successfully 🌷",

      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,

        profilePicture: updatedUser.profilePicture,

        bio: updatedUser.bio,

        skillsToTeach: updatedUser.skillsToTeach,
        skillsToLearn: updatedUser.skillsToLearn,

        rating: updatedUser.rating,
        totalSwaps: updatedUser.totalSwaps,

        // CREDIT SYSTEM
        credits: updatedUser.credits,
        totalCreditsEarned:
          updatedUser.totalCreditsEarned,
        totalCreditsSpent:
          updatedUser.totalCreditsSpent,
      },
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error.message
    );

    // Duplicate username
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Username is already taken",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// UPLOAD PROFILE PICTURE
// =====================================================

const uploadProfilePicture = async (req, res) => {
  try {
    // -----------------------------
    // Check file
    // -----------------------------

    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image",
      });
    }

    // -----------------------------
    // Find user
    // -----------------------------

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // -----------------------------
    // Upload to ImageKit
    // -----------------------------

    const result = await imagekit.upload({
      file: req.file.buffer,

      fileName: `profile-${user._id}-${Date.now()}`,

      folder: "/skillswap/profile-pictures",
    });

    // -----------------------------
    // Save ImageKit URL
    // -----------------------------

    user.profilePicture = result.url;

    await user.save();

    // -----------------------------
    // Return updated user
    // -----------------------------

    return res.status(200).json({
      message:
        "Profile picture uploaded successfully 📸",

      profilePicture: user.profilePicture,

      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,

        profilePicture: user.profilePicture,

        bio: user.bio,

        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,

        rating: user.rating,
        totalSwaps: user.totalSwaps,

        // CREDIT SYSTEM
        credits: user.credits,
        totalCreditsEarned:
          user.totalCreditsEarned,
        totalCreditsSpent:
          user.totalCreditsSpent,
      },
    });
  } catch (error) {
    console.error(
      "Profile picture upload error:",
      error
    );

    return res.status(500).json({
      message: "Failed to upload profile picture",
      error: error.message,
    });
  }
};

// =====================================================
// EXPLORE OTHER USERS
// =====================================================

const exploreUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const users = await User.find({
      _id: {
        $ne: currentUserId,
      },
    })
      .select("-password")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Explore users error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// FIND SKILL MATCHES
// =====================================================

const findSkillMatches = async (req, res) => {
  try {
    // -----------------------------
    // Get current user
    // -----------------------------

    const currentUser = await User.findById(
      req.user._id
    );

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // -----------------------------
    // Get other users
    // -----------------------------

    const users = await User.find({
      _id: {
        $ne: currentUser._id,
      },
    }).select("-password");

    // -----------------------------
    // Calculate matches
    // -----------------------------

    const matches = users.map((user) => {
      // Skills the other person teaches
      // that current user wants to learn

      const teachMatch =
        (user.skillsToTeach || []).filter(
          (skill) =>
            (currentUser.skillsToLearn || []).some(
              (wantedSkill) =>
                wantedSkill.toLowerCase() ===
                skill.toLowerCase()
            )
        );

      // Skills current user teaches
      // that the other person wants to learn

      const learnMatch =
        (currentUser.skillsToTeach || []).filter(
          (skill) =>
            (user.skillsToLearn || []).some(
              (wantedSkill) =>
                wantedSkill.toLowerCase() ===
                skill.toLowerCase()
            )
        );

      // -----------------------------
      // Calculate match score
      // -----------------------------

      const totalPossibleMatches =
        new Set([
          ...(currentUser.skillsToLearn || []),
          ...(currentUser.skillsToTeach || []),
        ]).size;

      const totalMatches =
        teachMatch.length +
        learnMatch.length;

      let matchScore = 0;

      if (totalPossibleMatches > 0) {
        matchScore = Math.min(
          100,
          Math.round(
            (totalMatches /
              totalPossibleMatches) *
              100
          )
        );
      }

      return {
        user,

        matchScore,

        skillsTheyCanTeachMe:
          teachMatch,

        skillsICanTeachThem:
          learnMatch,
      };
    });

    // -----------------------------
    // Highest match first
    // -----------------------------

    matches.sort(
      (a, b) =>
        b.matchScore - a.matchScore
    );

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(200).json({
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error(
      "Skill matching error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadProfilePicture,
  exploreUsers,
  findSkillMatches,
};