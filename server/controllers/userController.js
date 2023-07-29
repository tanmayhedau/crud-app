const users = require("../models/usersSchema");
const moment = require("moment");

exports.userPost = async (req, res) => {
  const { firstname, email, mobile, gender, status } = req.body;

  if (!firstname || !email || !mobile || !gender || !status) {
    res.status(400).json({ error: "All input is required" });
  }

  try {
    const preUser = await users.findOne({ email: email });
    if (preUser) {
      res.status(400).json({ error: "user already exist in our database" });
    } else {
      const dateCreate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

      const userData = new users({
        firstname,
        email,
        mobile,
        gender,
        status,
        datecreated: dateCreate,
      });

      await userData.save();
      res.status(200).json(userData);
    }
  } catch (error) {
    res.status(400).json(error);
    console.log("catch block error");
  }
};

exports.getAllUsers = async (req, res) => {
  const search = req.query.search || "";
  const status = req.query.status || "";
  const gender = req.query.gender || "";
  const sort = req.query.sort || "";
  const page = req.query.page || "";
  const ITEM_PER_PAGE = req.query.items || 4;

  const query = {
    firstname: { $regex: search, $options: "i" },
  };

  if (status !== "All") {
    query.status = status;
  }

  if (gender !== "All") {
    query.gender = gender;
  }

  try {
    // skip
    const skip = (page - 1) * ITEM_PER_PAGE;

    const count = await users.countDocuments(query);

    const usersData = await users
      .find(query)
      .sort({ datecreated: sort == "new" ? -1 : 1 })
      .limit(ITEM_PER_PAGE)
      .skip(skip);

    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    res.status(200).json({
      pagination: {
        count: pageCount,
      },
      usersData,
    });
  } catch (error) {
    res.status(400).json(error);
    console.log("catch block error");
  }
};

exports.getSingleUser = async (req, res) => {
  const { id } = req.params;

  try {
    const singleUserData = await users.findOne({ _id: id });
    res.status(200).json(singleUserData);
  } catch (error) {
    res.status(400).json(error);
    console.log("catch block error");
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteUserData = await users.findByIdAndDelete({ _id: id });
    res.status(200).json(deleteUserData);
  } catch (error) {
    res.status(400).json(error);
    console.log("catch block error");
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstname, email, mobile, gender, status } = req.body;
  try {
    const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
    const updateUserData = await users.findByIdAndUpdate(
      { _id: id },
      { firstname, email, mobile, gender, status, dateUpdate: dateUpdate },
      { new: true }
    );
    await updateUserData.save();
    res.status(200).json(updateUserData);
  } catch (error) {
    res.status(400).json(error);
    console.log("catch block error");
  }
};
