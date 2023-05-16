import NPO from "../models/Organization.js";
import mongoose from "mongoose";

const isValidMongoId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

async function verifyPassword(req, res, next) {
  const { id } = req.params;

  try {
    if (!isValidMongoId(id))
      return res.render("passwordExists", {
        message:
          "NPO not found. If you have any questions, please contact us at fundspirit@contact.mail",
      });

    const npo = await NPO.findById(id);
    if (!npo)
      return res.render("passwordExists", {
        message:
          "NPO not found. If you have any questions, please contact us at fundspirit@contact.mail",
      });

    if (!npo.isApproved)
      return res.render("passwordExists", {
        message:
          "NPO is not approved yet, wait for the admins to approve it. If you have any questions, please contact us at fundspirit@contact.mail",
      });

    if (npo.password !== "")
      return res.render("passwordSet", {
        message:
          "Password Already Created, if you forgot it, please contact us at please contact us at fundspirit@contact.mail or visit the websit to Login",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  next();
}

export default verifyPassword;
