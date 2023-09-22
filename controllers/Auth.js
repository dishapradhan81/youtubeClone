import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  // console.log(req.body);
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save(); //save to mongoDB
    res.status(200).send("User has been created!");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  // console.log(req.body);
  try {
    //try to find the user 1st
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found!"));

    //compare hash password and our password
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    console.log(req.body.password);
    console.log(user.password);
    if (!isCorrect) return next(createError(400, "Wrong Crendentials!"));

    //if everything is correct, we are gonna send user info & acsess token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN);
    const { password, ...others } = user._doc;

    //we have token & we can now send it to user using cookie, "access_token" is cookie name
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      // .json(user);
      .json(others);
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: rew.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        { id: savedUser._id },
        process.env.JWT_SECRET_TOKEN
      );
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
