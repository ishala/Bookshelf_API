const { addNewBookHandler, getBooksHandler, getDetailBook, updateDataBook,deleteBook} = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addNewBookHandler
    },
    {
        method: 'GET',
        path: '/books',
        handler: getBooksHandler
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getDetailBook
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateDataBook
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBook
    }
]

module.exports = routes;