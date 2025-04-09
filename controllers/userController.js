import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// CONTROLLER FUNCTION FOR CREATING A USER
export const createUser = asyncHandler(async (req, res) => {
  console.log("Creating a user");

  let { email } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    res.send({ message: "User registered successfully", user: user });
  } else res.status(201).send({ message: "User already registered" });
});

// CONTROLLER FUNCTION FOR BOOKING A VISIT
export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email: email },
      select: { bookVisits: true },
    });

    if (alreadyBooked.bookVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "This residency is already booked by you" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookVisits: { push: { id, date } },
        },
      });
      res.send("Your visit is booked successfully");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

// CONTROLLER FUNCTION FOR GETTING ALL BOOKINGS OF A USER
export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookVisits: true },
    });
    res.status(200).send(bookings);
  } catch (error) {
    throw new Error(error.message);
  }
});

// CONTROLLER FUNCTION TO CANCEL A BOOKING OF A USER
export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookVisits: true },
    });

    const index = user.bookVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookVisits.splice(index, 1);
      await prisma.user.update({
        where: { email },
        data: {
          bookVisits: user.bookVisits,
        },
      });
      res.send("Booking canceled successfully");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

// CONTROLLER FUNCTION TO ADD A RESIDENCY TO THE FAVORITES OF A USER
export const toFavorite = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user.favResidenciesID.includes(rid)) {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rid),
          },
        },
      });
      res.send({ message: "Removed from Favorite", user: updateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            push: rid,
          },
        },
      });
      res.send({ message: "Updated Favorites", user: updateUser });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

// CONTROLLER FUNCTION TO GET ALL FAVORITES RESIDENCY OF A USER
export const getAllFavorites = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const favoriteResidencies = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true },
    });
    res.status(200).send(favoriteResidencies);
  } catch (error) {
    throw new Error(error.message);
  }
});
