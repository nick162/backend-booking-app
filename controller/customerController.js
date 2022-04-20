const Customer = require("../models/Customer");

module.exports = {
  
  addCustomer: async (req, res) => {
    // console.log(req.body);
    const { firstName, lastName, email, phoneNumber } = req.body;
    try {
      const customer = await Customer.create({
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  viewCustomer: async (req, res) => {
    try {
      const customer = await Customer.find();

      customer.length == 0
        ? res.status(404).json({ message: "Customer not Found" })
        : res.status(201).json({ message: customer });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCustomer: async(req, res) =>{
      const {id} = req.params;

      const updates = Object.keys(req.body);
      const allowedUpdates = ["firstName", "lastName", "email", "phoneNumber"];
      const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

      if(!isValidOperation){
          res.status(403).json({message: "Wrong key parameters"})
      }

      try {

        const customer = await Customer.findById({_id:id});

        if(!customer) {
            res.status(404).json({message: "Customer not found"})
        }

        updates.forEach((update)=> customer[update] = req.body[update])

        res.status(200).json(customer)
          
      } catch (error) {
          res.status(500).send(error.message)
      }
  },

  deleteCustomer: async(req, res) =>{
      try {
          
        const {id} = req.params;
        const customer = await Customer.findById({_id:id});
        customer.delete();
        res.status(200).json({message: "Customer deleted"})
      } catch (error) {
          res.status(500).send(error.message)
      }
  }
};
