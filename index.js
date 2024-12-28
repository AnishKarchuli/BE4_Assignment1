const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions));

require("dotenv").config();
const { initializeDatabase } = require("./db/db.connect");
const Book = require("./models/books.models");

app.use(express.json());

initializeDatabase();

// Problem 1 & 2
async function createBook(newBook) {
  try {
    const book = new Book(newBook);
    const saveBook = await book.save();
    return saveBook;
  } catch (error) {
    throw error;
  }
}

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createBook(req.body);
    res
      .status(201)
      .json({ message: "Book added successfully", book: savedBook });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
});

// Problem 3
async function readAllBooks() {
  try {
    const allBooks = await Book.find();
    return allBooks;
  } catch (error) {
    throw error;
  }
}

app.get("/books", async (req, res) => {
  try {
    const books = await readAllBooks();
    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

//Problem 4
async function bookDetailByTitle(bookTitle) {
  try {
    const book = await Book.findOne({ title: bookTitle });
    return book;
  } catch (error) {
    throw error;
  }
}

app.get("/books/:bookTitle", async (req, res) => {
  try {
    const book = await bookDetailByTitle(req.params.bookTitle);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book." });
  }
});

//Problem 5
async function readAllBooksByAuthor(authorName) {
  try {
    const books = await Book.findOne({ author: authorName });
    return books;
  } catch (error) {
    throw error;
  }
}

app.get("/books/author/:authorName", async (req, res) => {
  try {
    const books = await readAllBooksByAuthor(req.params.authorName);
    if (books) {
      res.json(books);
    } else {
      res.status(404).json({ error: "Books not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// Problem 6
async function readAllBooksByGenre(genreName) {
  try {
    const books = await Book.find({ genre: genreName });
    return books;
  } catch (error) {
    throw error;
  }
}

app.get("/books/genre/:genreName", async (req, res) => {
  try {
    const books = await readAllBooksByGenre(req.params.genreName);
    if (books) {
      res.json(books);
    } else {
      res.status(404).json({ error: "Books not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// Problem 7
async function readAllBooksByReleaseYear(bookReleaseYear) {
  try {
    const books = await Book.find({ publishedYear: bookReleaseYear });
    return books;
  } catch (error) {
    throw error;
  }
}

app.get("/books/releaseYear/:bookReleaseYear", async (req, res) => {
  try {
    const books = await readAllBooksByReleaseYear(req.params.bookReleaseYear);
    if (books) {
      res.json(books);
    } else {
      res.status(404).json({ error: "Books not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// Problem 8
async function updateBook(bookId, dataToUpdate) {
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {
      new: true,
    });
    return updatedBook;
  } catch (error) {
    console.log("Error in updating book data", error);
  }
}

app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBook(req.params.bookId, req.body);
    if (updatedBook) {
      res.status(200).json({
        message: "Book updated successfully",
        updatedBook: updatedBook,
      });
    } else {
      res.status(404).json({ error: "Book does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book data." });
  }
});

//Problem 9
async function updateBookByTitle(bookTitle, dataToUpdate) {
  try {
    const updatedBook = await Book.findOneAndUpdate({ title: bookTitle}, dataToUpdate, {
      new: true,
    });
    return updatedBook;
  } catch (error) {
    console.log("Error in updating book data", error);
  }
}

app.post("/books/title/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body);
    if (updatedBook) {
      res.status(200).json({
        message: "Book data updated successfully",
        updatedBook: updatedBook,
      });
    } else {
      res.status(404).json({ error: "Book does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book data." });
  }
});


// Problem 10
async function deleteBook(bookId){
    try{
        const deletedBook = await Book.findByIdAndDelete(bookId)
        return deletedBook;
    }catch(error){
        console.log(error)
    }
}

app.delete('/books/:bookId', async (req, res) => {
    try{
        const deletedBook = await deleteBook(req.params.bookId)
        if(deletedBook){
            res.status(200).json({message: 'Book deleted successfully.'})
        } else {
            res.status(404).json({error: 'Book not found.'})
        }
    }catch(error){
        res.status(500).json({error: "Failed to delete a Book."})
    }
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});