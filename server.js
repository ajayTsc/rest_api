const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json()); 
const PORT = 3000;
const filePath = path.join(__dirname, 'userDetails', 'user.json');


function readUsers() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}


function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users,null,2));
}

app.get('/', (req, res) => {
  res.send('Api is running');
});


app.get('/users', (req, res) => {
  const users = readUsers();
  res.json(users);
});


app.get('/users/search', (req, res) => {
  const city = req.query.city;
  const users = readUsers();
  const filtered = users.filter(
    (c) => c.city && c.city.trim().toLowerCase() === city.trim().toLowerCase()
  );

  if (filtered.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(filtered);
});

app.get('/users/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(a => a.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});


app.post('/users', (req, res) => {
  const { name, city } = req.body;
  if (!name || !city) {
    return res.status(400).json({ message: 'Name and city are required' });
  }

  const users = readUsers();
  
  const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

  const newUser = { id: newId, name, city };
  users.push(newUser);

  writeUsers(users);
  res.status(201).json(newUser);
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
