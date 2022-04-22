const Item = require('../models/Item')
const Info = require('../models/Info')
const Category = require('../models/Category')
const Bank = require('../models/Bank')

module.exports ={
    
    homePage: async (req, res) => {
        try {
            
            const hotItem = await Item.find()
                .select(
                    "_id itemName location itemPrice unit imageId sumBooked isPopular"
                )
                .sort({sumBooked:-1})
                .limit(5)
                .populate({
                    path: "image",
                    select:" _id imageUrl",
                })

            const categoryList = await 
                // Category.find({ $where: "this.item.length > 0" })
                Category.find({'item.3': {$exists: true}})
                .limit(3)
                .populate({
                    path: "item",
                    select : "_id itemName location itemPrice unit imageId isPopular ",
                    perDocumentLimit: 4,
                    sort : { sumBooked : -1 },
                    populate : { 
                        path: "image",
                        perDocumentLimit: 1,
                    }
                })

            const testimony = await Info.find({ 
                type:["Testimoni","NearBy"],
                isHighlight: true,
            })
                .select("_id infoName type imageUrl description item")
                .limit(3)
                .populate({
                    path: "item",
                    select:"_id itemName location",
                })

            const Hotel = await Category.find({categoryName: "Hotel"});
            const Travel = await Category.find({categoryName: "Travel"});
            const Event = await Category.find({categoryName: "Event"});
            const tourPackage = await Category.find({categoryName: "Tour Package"});

            const sumHotel = Hotel.reduce((count, current)=> count + current.item.length, 0);
            const sumTravel = Travel.reduce((count, current)=> count + current.item.length, 0);
            const sumEvent = Event.reduce((count, current)=> count + current.item.length, 0);
            const sumTourPackage = tourPackage.reduce((count, current)=> count + current.item.length, 0);

            res.status(200).json({
                summaryInfo : {
                    sumHotel : sumHotel,
                    sumTravel : sumTravel,
                    sumEvent : sumEvent,
                    sumTourPackage : sumTourPackage,
                },
                hotItem,
                categoryList,
                testimony,
            })

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    detailPage : async (req, res) => {

        try {
        const {id} = req.params
        const item = await Item.findOne({_id:id})
            .populate({path:"category", select:"id categoryName"})
            .populate({path:"image", select:"_id imageUrl"})
            .populate({
                path:"info",
                match : {type: {$in:["Testimoni","NearBy"]}},
            })
            .populate({path:"feature"})

        const bank = await Bank.find()

        res.status(200).json({
            ...item._doc,
            bank
        })

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}