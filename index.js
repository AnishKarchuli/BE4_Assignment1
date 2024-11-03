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

// Problem 3
async function readAllBooks(){
    try{
        const allBooks = await Book.find();
        return allBooks;
    }catch(error){
        throw error;
    }
}

app.get('/books', async (req, res) => {
    try{
        const books = await readAllBooks();
        if(books.length != 0){
            res.json(books)
        } else {
            res.status(404).json({error: 'No books found.'})
        }
    }catch (error){
        res.status(500).json({error: 'Failed to fetch books.'})
    }
});

//Problem 4
async function bookDetailByTitle(bookTitle){
    try{
        const book = await Book.findOne({title: bookTitle})
        return book;
    }catch(error){
        throw error;
    }
}

app.get('/books/:bookTitle', async (req, res) => {
    try{
        const book = await bookDetailByTitle(req.params.bookTitle);
        if(book){
            res.json(book)
        } else {
            res.status(404).json({error: 'Book not found.'})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch book."})
    }
})

//Problem 5
async function readAllBooksByAuthor(authorName){
    try{
        const books = await Book.find({author: authorName})
        return books;
    }catch(error){
        throw error;
    }
}

app.get('/books/author/:authorName', async (req, res) => {
    try{
        const books = await readAllBooksByAuthor(req.params.authorName)
        if(books){
            res.json(books)
        } else {
            res.status(404).json({error: 'Books not found.'})
        }
    }catch(error){
        res.status(500).json({error: 'Failed to fetch books.'})
    }
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
});