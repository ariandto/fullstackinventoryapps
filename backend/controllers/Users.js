const Users = require('../models/UserModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fetch all users
const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Register new user
const register = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  if (!name || !email || !password || !confPassword) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  if (password !== confPassword) {
    return res.status(400).json({ msg: "Password and Confirm Password do not match" });
  }

  try {
    const user = await Users.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await Users.create({
      name,
      email,
      role,
      password: hashPassword
    });

    res.json({ msg: "Registration Successful", user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const userId = user.id;
    const name = user.name;
    const role = user.role;
    //console.log("User role:", role); // Tambahkan log ini
    const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '5m'
    });
    const refreshToken = jwt.sign({ userId, name, email, role }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    });

    await Users.update({ refresh_token: refreshToken }, {
      where: { id: userId }
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// User logout
const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(204);
  }

  try {
    const user = await Users.findOne({ where: { refresh_token: refreshToken } });

    if (!user) {
      return res.sendStatus(204);
    }

    const userId = user.id;

    await Users.update({ refresh_token: null }, {
      where: { id: userId }
    });

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = { getUsers, register, login, logout };
