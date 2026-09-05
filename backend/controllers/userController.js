const User = require("../models/User");

// Get logged-in user's profile
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update logged-in user's profile
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

    if (name !== undefined) {
      user.name = name;
    }

    if (username !== undefined) {
      user.username = username;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    if (skillsToTeach !== undefined) {
      user.skillsToTeach = skillsToTeach;
    }

    if (skillsToLearn !== undefined) {
      user.skillsToLearn = skillsToLearn;
    }

    if (profilePicture !== undefined) {
      user.profilePicture = profilePicture;
    }

    const updatedUser = await user.save();

    res.status(200).json({
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
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Explore other users
const exploreUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const users = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Explore users error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Find skill matches
const findSkillMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const users = await User.find({
      _id: { $ne: currentUser._id },
    }).select("-password");

    const matches = users.map((user) => {
      // What the other user teaches that I want
      const teachMatch = user.skillsToTeach.filter((skill) =>
        currentUser.skillsToLearn.some(
          (wantedSkill) =>
            wantedSkill.toLowerCase() === skill.toLowerCase()
        )
      );

      // What I teach that the other user wants
      const learnMatch = currentUser.skillsToTeach.filter((skill) =>
        user.skillsToLearn.some(
          (wantedSkill) =>
            wantedSkill.toLowerCase() === skill.toLowerCase()
        )
      );

      const totalPossibleMatches =
        new Set([
          ...currentUser.skillsToLearn,
          ...currentUser.skillsToTeach,
        ]).size;

      const totalMatches =
        teachMatch.length + learnMatch.length;

      let matchScore = 0;

      if (totalPossibleMatches > 0) {
        matchScore = Math.min(
          100,
          Math.round(
            (totalMatches / totalPossibleMatches) * 100
          )
        );
      }

      return {
        user,
        matchScore,
        skillsTheyCanTeachMe: teachMatch,
        skillsICanTeachThem: learnMatch,
      };
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Skill matching error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  exploreUsers,
  findSkillMatches,
};