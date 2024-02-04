const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
const uri = 'mongodb+srv://wow:htmlcssjs@cluster0.ifdvzs5.mongodb.net/'; // Replace with your actual URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define book schema
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: false
    },
    year: {
        type: Number,
        required: true,
        max: [2022, 'Year must be less than or equal to 2022']
    },
    isbn: {
        type: String,
        required: true,
        unique: [true, 'ISBN must be unique']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be greater than or equal to 0']
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    lastUpdateAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model
const Book = mongoose.model('Books', BookSchema);

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Book CRUD</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 16px;
            }
    
            h1 {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            form {
                width: 400px;
                margin: 0 auto; /* Center the form */
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
    
            label {
                display: block;
                margin-bottom: 5px;
            }
    
            input[type="text"], input[type="number"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 3px;
                margin-bottom: 10px;
            }
    
            button[type="submit"] {
                background-color: #4CAF50; /* Green */
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }
    
            a {
                color: #007bff; /* Blue */
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <h1>Book CRUD Operations</h1>
        <form action="/create" method="post">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" required><br>
    
            <label for="shortDescription">Short Description:</label>
            <input type="text" id="shortDescription" name="shortDescription"><br>
    
            <label for="year">Year:</label>
            <input type="number" id="year" name="year" required><br>
    
            <label for="isbn">ISBN:</label>
            <input type="text" id="isbn" name="isbn" required><br>
    
            <label for="price">Price:</label>
            <input type="number" id="price" name="price" required><br>
    
            <button type="submit">Create Book</button>
        </form>
    
        <a href="/read" style="text-align: center; font-size: 24px; color: green;">Show All Books</a>
    
        </body>
    </html>
    
    `);
});

app.post('/create', async (req, res) => {
    const { title, shortDescription, year, isbn, price } = req.body;

    const newBook = new Book({
        title,
        shortDescription,
        year,
        isbn,
        price,
    });

    try {
        await newBook.save();
        res.redirect('/');
    } catch (error) {
        res.send('Error creating book: ' + error.message);
    }
});

app.get('/read', async (req, res) => {
    try {
        const books = await Book.find();

        // Create HTML structure for the books
        const bookList = books.map(book => `
        <div class="book">
          <h2 style="text-align: center; font-size: 24px; color: green;">Book Title: ${book.title}</h2>
          <p style="text-align: center; font-size: 24px; color: green;">Book Description: ${book.shortDescription}</p>
          <p style="text-align: center; font-size: 24px; color: green;">Book Year: ${book.year}</p>
          <p style="text-align: center; font-size: 24px; color: green;">Book Isbn: ${book.isbn}</p>
          <p style="text-align: center; font-size: 24px; color: green;">Book Price: ${book.price}</p>
        </div>
      `)
            ;

        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Books</title>
            <style>
                body {
                    font-family: sans-serif;
                    margin: 20px;
                }
        
                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                }
        
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
        
                th, td {
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: left;
                }
        
                th {
                    background-color: #f2f2f2;
                }
        
                form {
                    margin-top: 20px;
                    border: 1px solid #ccc;
                    padding: 20px;
                    border-radius: 5px;
                }
        
                label {
                    display: block;
                    margin-bottom: 5px;
                }
        
                input[type="text"], input[type="number"] {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    margin-bottom: 10px;
                }
        
                button[type="submit"] {
                    background-color: #4CAF50; /* Green */
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <h1>All Books</h1>
            ${bookList.join('')}
        
            <form action="/update" method="post">
                <label for="updateIsbn">ISBN:</label>
                <input type="text" id="updateIsbn" name="isbn" required><br>
                <label for="updateTitle">New Title:</label>
                <input type="text" id="updateTitle" name="title"><br>
                <label for="updateShortDescription">New Short Description:</label>
                <input type="text" id="updateShortDescription" name="shortDescription"><br>
                <label for="updateYear">New Year:</label>
                <input type="number" id="updateYear" name="year"><br>
                <label for="updatePrice">New Price:</label>
                <input type="number" id="updatePrice" name="price"><br>
                <button type="submit">Update Book</button>
            </form>
        
            <form action="/delete" method="post">
                <label for="deleteIsbn">ISBN:</label>
                <input type="text" id="deleteIsbn" name="isbn" required><br>
                <button type="submit">Delete Book</button>
            </form>
        </body>
        </html>
        
      `);
    } catch (error) {
        res.send('Error reading books: ' + error.message);
    }
});


// Add routes for update and delete operations similarly
// ... rest of your code

// Update route
app.post('/update', async (req, res) => {
    try {
        const { title, shortDescription, year, isbn, price } = req.body;

        const updatedBook = await Book.findOneAndUpdate(
            { isbn: req.body.isbn },
            {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    year: year,
                    isbn: isbn,
                    price: price,
                    lastUpdateAt: Date.now()
                }
            },
            { new: true }
        );

        if (!updatedBook) {
            res.status(404).send('Book not found');
            return;
        }

        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error updating book: ' + error.message);
    }
});

// Delete route
app.post('/delete', async (req, res) => {
    try {
        const deletedBook = await Book.findOneAndDelete({ isbn: req.body.isbn });

        if (!deletedBook) {
            res.status(404).send('Book not found');
            return;
        }

        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting book: ' + error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

