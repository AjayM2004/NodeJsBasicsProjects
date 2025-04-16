//using express
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

//create instance of express
const app = express();

// Add middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS
app.use(cors());

//connecting mongodb
mongoose.connect('mongodb://127.0.0.1:27017/todo-app')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

//creating a schema for todo items
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

//creating a model for todo items
const Todo = mongoose.model('Todo', todoSchema);

// create a new to do item
app.post('/todo', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newToDo = new Todo({ title, description }); // Use 'Todo' instead of 'todoModel'
        await newToDo.save();
        console.log(newToDo);
        res.status(200).json(newToDo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating todo item' });
    }
});

//get all to do items
app.get('/todo', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching todo items' });
    }
});
//update the to do item using id
app.put('/todo/:id', async (req, res) => {
  try{
     const {title,description} = req.body;
     const id = req.params.id;
      const todo = await Todo.findByIdAndUpdate(id,{title,description},{new:true});
      if(!todo)
      {
         res.status(404).json({message:"Todo not found"});
      }
      res.send(todo).status(200);
  }
  catch(error)
  {
     console.log(error);
     res.send(error).status(500).json({message:"Error updating todo item"});
  }
});
app.delete('/todo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting todo item' });
}});
//start a server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});