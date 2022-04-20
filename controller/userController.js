const User = require("../models/User");
// const bycript = require("bycriptjs");
// const jwt = require("jsonwebtoken");

module.exports = {

  addUser: async (req, res) => {
    try {
      const { userName, email, role, password, passwordConfirm } = req.body;

      if (password !== passwordConfirm) {
        throw new Error("Password does not match!");
      }

      const checkUserName = await User.find({ userName: userName }).count();
      const checkEmail = await User.find({ email: email }).count();

      if (checkUserName + checkEmail > 0) {
        throw new Error("User name or email already exists!");
      }

      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: "Success Sign Up, please Login" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  viewUser: async (req, res) => {
    try {
      const user = await User.find();

      user == 0
        ? res.status(404).json({ message: "User Not found" })
        : res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "userName",
      "email",
      "role",
      "password",
      "passwordConfirm",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(403).json({ message: "Inavlid Key Parameter" });
    }

    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }
      updates.forEach((update) => {
        user[update] = req.body[update];
      });
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      user
        ? res.status(200).json({ message: "User Deleted" })
        : res.status(404).json({ message: "User Not Found" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      );

      const token = await user.generateAuthToken();
      const username = user.userName
      res.status(200).json({username, token});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  logOut : async (req, res) => {
    try {
      
      req.user.tokens = req.user.tokens.filter(
        (token) => token.token !== req.user.token
      )

      await req.user.save()
      res.status(200).json({ message: "Logout Success" })
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  logOutAll : async (req, res) => {
    try {
      
      req.user.tokens = []
      await req.user.save()
      res.status(200).json({ message: "Logout Success" })
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
