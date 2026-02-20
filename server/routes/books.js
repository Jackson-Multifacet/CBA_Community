
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');

// @route   GET api/books
// @desc    Get all books
// @access  Public
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/books
// @desc    Add a new book
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  // Simple role check (in a real app, middleware should handle role checking)
  if (req.user.role !== 'Pastor' && req.user.role !== 'Leader') {
      return res.status(403).json({ msg: 'Not authorized' });
  }

  const { title, author, price, description, category, imageUrl, downloadUrl } = req.body;

  try {
    const newBook = new Book({
      title,
      author,
      price,
      description,
      category,
      imageUrl,
      downloadUrl
    });

    const book = await newBook.save();
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/books/:id
// @desc    Update a book
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'Pastor' && req.user.role !== 'Leader') {
        return res.status(403).json({ msg: 'Not authorized' });
    }

    const { title, author, price, description, category, imageUrl, downloadUrl } = req.body;

    const bookFields = {};
    if (title) bookFields.title = title;
    if (author) bookFields.author = author;
    if (price) bookFields.price = price;
    if (description) bookFields.description = description;
    if (category) bookFields.category = category;
    if (imageUrl) bookFields.imageUrl = imageUrl;
    if (downloadUrl) bookFields.downloadUrl = downloadUrl;

    try {
        let book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: 'Book not found' });

        book = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: bookFields },
            { new: true }
        );

        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/books/:id
// @desc    Delete a book
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'Pastor' && req.user.role !== 'Leader') {
        return res.status(403).json({ msg: 'Not authorized' });
    }

    try {
        let book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: 'Book not found' });

        await Book.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Book removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
