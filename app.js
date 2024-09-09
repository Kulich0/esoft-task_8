const express = require('express')
const app = express();
const port = 3000;

app.use(express.json());

const users = [
    {id: 1, name: 'Андрей Самар', email: 'samarandrei@yandex.com',age: '19'},
    {id: 2, name: 'Степан Дубровин', email: 'stepan.09myromec@gmail.com', age: '19'},
]

function validateUser(data) {
    const {name, email, age} = data;
    if (!name || !email || typeof age === 'undefined') {
        return 'Необходимо указать имя, почту, возраст'
    }
    if (typeof name !== 'string' || typeof email !== 'string') {
        return 'Имя и почта должны быть строкой'
    }
    if (typeof age !== 'number' || age <= 0) {
        return 'Возраст должен быть числом'
    }
    return null;
}

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('Пользователь не найден')
    }
});
app.post('/users', (req, res) => {
    const error = validateUser(req.body);
    if (error) { 
        return res.status(400).send(error);
    }

    const {name, email, age} = req.body;
    const newUser = {
        id: users.length + 1,
        name,
        email, 
        age
    };
    users.push(newUser);
    res.status(201).json(newUser)
});

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);

    if (user) {
        const { name, email, age } = req.body;
        
        if (name) {
          if (typeof name !== 'string') {
            return res.status(400).send('Имя должно быть строкой');
          }
          user.name = name;
        }
        
        if (email) {
          if (typeof email !== 'string') {
            return res.status(400).send('Почта должно быть строкой');
          }
          user.email = email;
        }
        
        if (typeof age !== 'undefined') {
          if (typeof age !== 'number' || age <= 0) {
            return res.status(400).send('Возраст должен быть положительным числом');
          }
          user.age = age;
        }
        
        res.json(user);
      } else {
        res.status(404).send('Пользователь не найден');
      }
});

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(u => u.id === userId);
  
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      res.status(204).send();
    } else {
      res.status(404).send('Пользователь не найден');
    }
});
  

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})