const Booking = require("../models/Booking");
const Item = require("../models/Item");
const Customer = require("../models/Customer");
const path = require("path");
const fs = require("fs-extra");

module.exports = {
  
  createBooking: async (req, res) => {
    try {
      const {
        itemId,
        itemBooked,
        bookingStartDate,
        bookingEndDate,
        firstName,
        lastName,
        email,
        phoneNumber,
        bankFrom,
        accountHolder,
      } = req.body;

      if (!req.file) {
        res.status(404).json({ message: "Image Not Found" });
      }

      if (
        itemId === undefined ||
        itemBooked === undefined ||
        bookingStartDate === undefined ||
        bookingEndDate === undefined ||
        firstName === undefined ||
        lastName === undefined ||
        email === undefined ||
        phoneNumber === undefined ||
        bankFrom === undefined ||
        accountHolder === undefined
      ) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`));
        res.status(400).json({ message: "Please fill all the form" });
      }

      const item = await Item.findOne({ _id: itemId });
      if (!item) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`));
        res.status(400).json({ message: "Item Not Found" });
      }

      let total = item.itemPrice * itemBooked;
      let tax = total * 0.1;

      const invoice = Math.floor(100000 + Math.random() * 900000);

      const customer = await Customer.create({
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      const newBooking = {
        invoice,
        bookingStartDate,
        bookingEndDate,
        total: (total += tax),
        item: {
          _id: item.id,
          Name: item.itemName,
          price: item.itemPrice,
          booked: itemBooked,
        },
        customer: customer.id,
        payments: {
          proofPayment: `images/${req.file.filename}`,
          bankFrom: bankFrom,
          accountHolder: accountHolder,
        },
      };

      const booking = await Booking.create(newBooking);

      res.status(201).json({ message: "Booking Success", booking });
    } catch (error) {
      if (req.file) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`));
      }
      res.status(500).json({ message: error.message });
    }
  },

  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find();
      booking === 0
        ? res.status(404).json({ message: "Booking Not Found" })
        : res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  showDetailBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id }).populate("customer");
      booking === 0
        ? res.status(404).json({ message: "Booking Not Found" })
        : res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  actionReject: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id });
      if (booking.payments.status == "Reject") {
        return res.status(403).json({ message: "Booking Already Rejected" });
      }

      if (booking.payments.status == "Accept") {
        return res.status(403).json({ message: "Booking Already Accepted" });
      }

      booking.payments.status = "Reject";
      booking.proofBy = req.user._id
      await booking.save();
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({error:error.message});
    }
  },

  actionAccept: async (req, res) => {
    const { id } = req.params;

    try {
      const booking = await Booking.findOne({ _id: id });
      const {
        item: { _id, booked },
      } = booking;
      const item = await Item.findOne({ _id: _id });

      if (booking.payments.status == "Accept") {
        return res.status(403).json({ message: "Booking Already Accepted" });
      }
      if (booking.payments.status == "Reject") {
        return res.status(403).json({ message: "Booking Already Rejected" });
      }

      item.sumBooked += parseInt(booked);
      booking.payments.status = "Accept";
      booking.proofBy = req.user._id;

      await item.save();
      await booking.save();
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id });
      if (!booking) {
        return res.status(404).json({ message: "Booking Not Found" });
      }

      const {
        payments: { proofPayment, status },
      } = booking;

      if(booking.payments.status != "Proses"){
        return res.status(404).json({message: " Only status with process can deleted"})

      }


      await booking.remove()
        .then(()=> fs.unlink(path.join(`public/${proofPayment}`)))
      res.status(200).json({ message: "Booking Deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteBookingReject: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id });
      if (!booking) {
        return res.status(404).json({ message: "Booking Not Found" });
      }

      const {
        payments: { proofPayment, status },
      } = booking;

      if(booking.payments.status != "Reject"){
        return res.status(404).json({message: " Only status with Reject can deleted"})

      }


      await booking.remove()
        .then(()=> fs.unlink(path.join(`public/${proofPayment}`)))
      res.status(200).json({ message: "Booking Deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
