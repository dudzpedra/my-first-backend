require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");
app.use(cors());

const Person = require("./models/person");

/* let persons = [
    {
        id: 1,
        name: 'Verônica Pedra',
        phone: '98124-9133'
    },
    {
        id: 2,
        name: 'Ju Luna',
        phone: '98124-7843'
    },
    {
        id: 3,
        name: 'Ricardo Pedra',
        phone: '98148-8133'
    },
    {
        id: 4,
        name: 'Leonardo Pedra',
        phone: '98125-6733'
    },
] */

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get("/", (req, res) => {
  res.send("<h1>A Node.js and Express App</h1>");
});

app.get("/api/persons/:id", (req, res, next) => {
  /* const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    } */
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  res.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        </div>
    `);
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

/* const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
    return maxId + 1
} */

const randomId = () => (Math.random() * 10000).toFixed(0);

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name is missing!",
    });
  }

  if (!body.phone) {
    return res.status(400).json({
      error: "phone is missing!",
    });
  }

  const person = new Person({
    name: body.name,
    phone: body.phone,
    important: body.important || false,
    date: new Date(),
    id: randomId(),
  });

  person.save().then((savedPerson) => res.json(savedPerson)).catch(err => console.log(err));
  
  /*  if (isContact) {
        return res.status(400).json({
            error: 'There is already a contact with this name'
        })
    } else {
        persons = persons.concat(person)
    }
    res.json(persons) */
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
