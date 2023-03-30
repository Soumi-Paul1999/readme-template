const express = require("express");
const {
  getAllUsers,
  getOneUsers,
  CreateUsers,
  UpdateUsers,
  deleteUsers,
} = require("../controllers/userController");
const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getOneUsers);
router.post("/", CreateUsers);
router.put("/:id", UpdateUsers);
router.delete("/:id", deleteUsers);

module.exports = router;
