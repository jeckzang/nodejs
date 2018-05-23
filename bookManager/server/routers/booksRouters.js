module.exports = function (config) {
    const express = require('express'),
        routers = express.Router(),
        request = require('superagent'),
        rp = require("request-promise"),
        booksDao = require("../daos/booksInSqliteDao.js");

    var module = {
        routers: routers
    };
    routers.use(express.json());

    //books manager
    function createBook(book) {

    }

    //books api

    routers.all('/books', function (req, res) {
        switch (req.method) {
            case 'POST':
                var book = req.body;
                console.log(`create book:${book.id}`);
                createBook(book);
                break;
            case 'GET':
                //page, countPerPage, currentId, orderBy, currentOrderByValue,
                var page = req.query.page || 1;
                var count = req.query.count || 100;
                var currentId = req.query.currentId || 0;
                var orderBy = req.query.orderBy;
                var currentOrderByValue = req.query.currentOrderByValue;
                console.log(`list all books, page:${page} count:${count}`);
                var allBooks = booksDao.getAllBooks(page, count, currentId, orderBy, currentOrderByValue, function (books) {
                    res.send(JSON.stringify(books));
                    return;
                });
                break;
            default:
                console.log(`invoke books with method:${req.method}`);
        }

    });

    routers.all('/books/:id', function (req, res) {
        console.log(`get book`);
        var id = req.param('id');
        switch (req.method) {
            case 'GET':
                console.log(`get book for id:${id}`);
                break;
            case 'PUT':
                var book = req.body;
                console.log(`update book for id:${id} book:${book}`);
                break;
            case 'DELETE':
                var book = req.body;
                console.log(`delete book:${book}`);
                break;
            default:
                console.log(`invoke books with method:${req.method}`);
        }
    });

    return module;
}