const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // for JSON data

// 1️⃣ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydb')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log(err));

// 2️⃣ Create Schema & Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});
const User = mongoose.model('User', UserSchema);

// 3️⃣ CRUD Routes

// CREATE (POST)
app.post('/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
});

// READ (GET)
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// UPDATE (PUT)
app.put('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(user);
});

// DELETE (DELETE)
app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send({ message: 'User deleted' });
});

// 4️⃣ Start Server
app.listen(3000, () => console.log('🚀 Server running on port 3000'));
