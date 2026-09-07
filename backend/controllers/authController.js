const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// =====================================================
// JWT TOKEN
// =====================================================

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =====================================================
// EMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================================================
// REGISTER
// =====================================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
    } = req.body;

    // Check required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully 🌷",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful 🌷",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please enter your email address",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // Don't reveal whether an email exists
    if (!user) {
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token valid for 15 minutes
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    // Reset URL
    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email
    const mailOptions = {
      from: `"TimeSwap" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your TimeSwap password",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 40px;
          background: #f7f5f0;
          color: #292722;
        ">

          <div style="
            background: white;
            padding: 35px;
            border-radius: 24px;
          ">

            <h2 style="margin-top: 0;">
              Reset your password 🌷
            </h2>

            <p>
              Hi ${user.name},
            </p>

            <p>
              We received a request to reset your TimeSwap password.
            </p>

            <p>
              Click the button below to create a new password.
            </p>

            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 14px 24px;
                background: #dca0b1;
                color: #292722;
                text-decoration: none;
                border-radius: 14px;
                font-weight: 600;
              "
            >
              Reset Password
            </a>

            <p style="
              margin-top: 25px;
              font-size: 13px;
              color: #777269;
            ">
              This link will expire in 15 minutes.
            </p>

            <p style="
              font-size: 13px;
              color: #777269;
            ">
              If you didn't request this, you can safely ignore this email.
            </p>

          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Unable to send password reset email",
    });
  }
};

// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Please enter a new password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long",
      });
    }

    // Hash token from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Password reset link is invalid or has expired",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    user.password = hashedPassword;

    // Clear reset token
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    res.json({
      message:
        "Password reset successfully 🌷",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Unable to reset password",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};