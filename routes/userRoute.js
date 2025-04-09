import express from "express";
import {
  bookVisit,
  cancelBooking,
  createUser,
  getAllBookings,
  getAllFavorites,
  toFavorite,
} from "../controllers/userController.js";
import jwtCheck from "../config/auth0Config.js";

const router = express.Router();

router.post("/register", jwtCheck, createUser);
router.post("/bookVisit/:id", jwtCheck, bookVisit);
router.post("/all-bookings", getAllBookings);
router.post("/remove-bookings/:id", jwtCheck, cancelBooking);
router.post("/to-favorite/:rid", jwtCheck, toFavorite);
router.post("/all-favorites", jwtCheck, getAllFavorites);

export { router as userRoute };
