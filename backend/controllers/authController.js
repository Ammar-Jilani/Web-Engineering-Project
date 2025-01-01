const User = require("../models/User");
const { generateToken } = require("../config/auth");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("You are already registered, please login.");
    }

    // Create a new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Validate user existence and password
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send("Invalid email or password");
    }

    // Generate token
    const token = generateToken(user);

    // Include role and name in the response
    res.json({
      token,
      role: user.role, // Include role
      name: user.name, // Include name
    });
  } catch (err) {
    next(err);
  }
};
