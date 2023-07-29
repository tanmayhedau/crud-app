const express = require("express");
const router = new express.Router();
const controllers = require("../controllers/userController")

// routes
router.post("/user/register", controllers.userPost);
router.get("/user/getallusers", controllers.getAllUsers);
router.get("/user/getuser/:id", controllers.getSingleUser);
router.delete("/user/deleteuser/:id", controllers.deleteUser);
router.put("/user/updateuser/:id", controllers.updateUser);



module.exports = router;