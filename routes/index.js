const express = require('express');
const router  = express.Router();

const Book = require('../models/Book');
const Comment = require('../models/Comment');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* C(R)UD: Retrieve -> List all books */
router.get('/books', (req, res, next) => {
  Book.find({}).sort({updated_at:-1}).then( books => {
    res.render('book/list', {books});
  })
});


/* (C)RUD: Add a book form */
router.get('/books/add', (req, res, next) => {
  res.render('book/add');
});

/* (C)RUD: Create the book in DB */
router.post('/books/add', (req, res, next) => {
  const { title, author, description, rating} = req.body;
  new Book({title, author, description, rating})
  .save().then( book => {
    console.log("Book sucessfully created!");
    res.redirect('/books');
  });
});

/* CR(U)D: Update the book, show update form  */
router.get('/books/edit/:id', (req,res) => {
  Book.findById(req.params.id).then(book => {
    res.render('book/edit',{book});;
  })
})

/* CR(U)D: Update the book in DB */
router.post('/books/edit/:id', (req,res) => {
  const { title, author, description, rating} = req.body;
  Book.findByIdAndUpdate(req.params.id,{ title, author, description, rating })
      .then( book => {
        res.redirect('/books')
      })
})

/* CRU(D): Update the book in DB */
router.get('/books/delete/:id',(req,res) => {
  Book.findByIdAndRemove(req.params.id, () => res.redirect('/books'));
})


/* C(R)UD: Retrieve -> Get a book */
router.get('/books/:id', (req, res, next) => {
  Book.findById(req.params.id).then( book => {
    Comment.find({book: book._id}).then(comments => {

      console.log(book);
      console.log(comments);

      res.render('book/detail', {book, comments});
    })
  })
});


/* C(R)UD: Retrieve -> Get a book */
router.get('/comments', (req, res, next) => {
  Comment.find({}).populate('book').then(comments  => {
    console.log(comments);
    res.render('comments/list',{comments});
  })
});


module.exports = router;
