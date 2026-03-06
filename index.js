const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/UserLab2")
.then(() => console.log("connectd to mongoDB"))
.catch(err => console.log("MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("Server is working");
});

// const userSchema= new mongoose.Schema({
//   name :String,
//   email:String,
//   password:String
// });

// const User = mongoose.model('User',userSchema);

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
})

app.post("/addusers", async (req, res) => {
  try {
    const user = new User(req.body);   
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.log("Error saving user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get('/users',async(req,res)=>{
  try{
    const users = await User.find();
    res.json(users);
  }
  catch(err){
    console.log('error fetching users:' , err);
    res.status(500).json({error :'internal server error'});
  }
});
  

app.put("/updateUser", (req, res) => {
    res.send("User updated");
});

app.patch("/updateUser/:name", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { name: req.params.name },   // search by name
      req.body,                    // fields to update
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.log("Error updating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.delete("/deleteUser/:name", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      name: req.params.name
    });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", deletedUser });
  } catch (err) {
    console.log("Error deleting user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(3000, () => {
  console.log("Server started on port 3000");
});