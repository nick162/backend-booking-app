const Bank = require('../models/Bank')
const fs = require('fs-extra')
const path = require('path')


module.exports = {
    
    addBank: async (req, res) => {
        // console.log(req.body);

        const {bankName, accountNumber, accountHolder} = req.body;

        if(!req.file){
            return res.status(400).json({message: 'Image not found'})
        }

        const bank = new Bank({
            bankName,
            accountNumber,
            accountHolder,
            imageUrl: `images/${req.file.filename}`,

        });

        try {
            await bank.save();
            res.status(201).json(bank)
        } catch (err) {
            // unlink agara ketika error maka file bisa langsung terhapus, karena akan membuat database penuh
            await fs.unlink(path.join(`public/images/${req.file.filename}`))
            res.status(400).json({err: err.message})
        }
    },

    viewBank : async (req, res) => {

        try {
            const bank = await Bank.find();
            bank.length === 0 ? res.status(404).json({message: " Bank not found"}) : res.status(200).json(bank)
        } catch (error) {
            res.status(500).json({error: error.message})
        }

    },

    updateBank : async (req, res) => {
        // console.log(req.body)

        const updates = Object.keys(req.body)
        const allowedUpdates = ['bankName','accountNumber','accountHolder']
        const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

        if(!isValidOperation){
            return res.status(403).send({error :" Wrong key parameter"})
        }

        try {

            const bank = await Bank.findById(req.params.id);

            if(req.file == undefined){
                updates.forEach((update)=> bank[update]=req.body[update])
                await bank.save()
                res.status(200).json(bank)
            } else {
                await fs.unlink(path.join(`public/${bank.imageUrl}`))
                updates.forEach((update) => bank[update] = req.body[update])
                bank.imageUrl = `images/${req.file.filename}`
    
                await bank.save();
                res.status(200).json(bank)
            }
        } catch (error) {
            await fs.unlink(path.join(`public/images/${req.file.filename}`))
            res.status(500).json({error: error.message})
            
        }


    },

    deleteBank: async (req, res) => {
        try {
            
            const bank = await Bank. findByIdAndDelete(req.params.id);
            if(!bank) {
                return res.status(404).send({error: "Bank Not Found"})
            } else {
                await bank.remove().then(()=> fs.unlink(path.join(`public/${bank.imageUrl}`)))
                res.status(200).send({message:"Bank Deleted"})
            }

        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }
}