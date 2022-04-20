const Booking = require("../models/Booking");
const Item = require("../models/Item");

module.exports = {

    viewDashboard : async (req, res) => {

        try {
        let sumProses, sumReject, sumAccept, sumBooked, sumItem;

        const totalBooked = await Booking.find()
        const proses = await Booking.find({"payments.status":"Proses"})
        const reject = await Booking.find({"payments.status":"Reject"})
        const accept = await Booking.find({"payments.status":"Accept"})
        const item = await Item.find()

        totalBooked.length != 0 ? sumBooked = totalBooked.length : sumBooked = 0
        proses.length != 0 ? sumProses = proses.length : sumProses = 0
        reject.length != 0 ? sumReject = reject.length : sumReject = 0
        accept.length != 0 ? sumAccept = accept.length : sumAccept = 0
        item.length != 0 ? sumItem = item.length : sumItem = 0

        res.status(200).json({
            "booked": String(sumBooked),
            "proses": String(sumProses),
            "reject": String(sumReject),
            "accept": String(sumAccept),
            "item": String(sumItem)
        })

        } catch (error) {
            res.status(500).json({message:error.message})
        }
    }
}