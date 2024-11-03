const express = require('express')
const app = express();

require('dotenv').config();
const { initializeDatabase } = require('./db/db.connect')
const Book = require('./models/books.models')

app.use(express.json())

initializeDatabase();

// Problem 1 & 2
async function createBook(newBook) {
    try{
        const book = new Book(newBook);
        const saveBook = await book.save();
        return saveBook;
    }catch(error){
        throw error;
    }
}

app.post('/books', async (req, res) => {
    try{
        const savedBook = await createBook(req.body);
        res.status(201).json({message: 'Book added successfully', book: savedBook})
    }catch (error){
        console.error("Error details:", error);
        res.status(500).json({error: 'Failed to add book'})
    }
})



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
});