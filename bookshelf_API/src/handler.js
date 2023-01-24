const books = require('./book');
const { nanoid } = require('nanoid');

//FUNGSI CHECKING BUKU TERBACA
const readBookFinishedCheck = (pgCount, readPg) => {
    if (pgCount === readPg) {
        const finished = true;
        return finished;
    }

    const finished = false;
    return finished;
};


//FUNGSI MENAMBAHKAN BUKU
const addNewBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = readBookFinishedCheck(pageCount, readPage);

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });

        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
    }

    const newBook = {id, name, year, author,summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,};

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });

        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan'
    });

    response.code(500);
    return response;
};

//FUNGSI HANDLER MELIHAT DETAIL BUKU
const getBooksHandler = (request, h) => {
    if (request.query.name) {
        return getBookByNameHandler(request, h);
    } else if (request.query.reading) {
        return getBookByStatusReadHandler(request, h);
    } else if (request.query.finished) {
        return getBookByFinishReadStatusHandler(request, h);
    } else {
        return getAllBookHandler();
    }
};

const getAllBookHandler = () => {
    const data = books.map((book) => (
        {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }
    ));

    return ({
        status: 'success',
        data: {
            books: data,
        },
    });
};

const getBookByNameHandler = (request, h) => {
    const bookName = request.query.name;

    const data = books.filter((book) => book.name.toLowerCase().indexOf(bookName.toLowerCase()) > -1).map((book) => (
            {
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }
        ));

    const response = h.response({
        status: 'success',
        data: {
            books: data
        }
    });

    response.code(200);
    return response;
};

const getBookByStatusReadHandler = (request, h) => {
    const statusRead = request.query.reading;

    if (statusRead === '0') {
        const data = books.filter((book) => book.reading == false).map((book) => (
                {
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }
            ));

        const response = h.response({
            status: 'success',
            data: {
                books: data
            }
        });
    
        response.code(200);
        return response;
    }

    if (statusRead === '1') {
        const data = books.filter((book) => book.reading == true).map((book) => (
                {
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }
            ));

        const response = h.response({
            status: 'success',
            data: {
                books: data
            }
        });
    
        response.code(200);
        return response;
    }
};

const getBookByFinishReadStatusHandler = (request, h) => {
    const finishReadStatus = request.query.finished;

    if (finishReadStatus === '0') {
        const data = books.filter((book) => book.finished == false)
            .map((book) => (
                {
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }
            ));

        const response = h.response({
            status: 'success',
            data: {
                books: data
            }
            });
        
            response.code(200);
            return response;
    }

    if (finishReadStatus === '1') {
        const data = books.filter((book) => book.finished == true).map((book) => (
                {
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }
            ));

        const response = h.response({
                status: 'success',
                data: {
                    books: data
                }
            });
        
            response.code(200);
            return response;
    }
};

const getDetailBook = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((book) => book.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book
            }
        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
};

const updateDataBook = (request, h) => {
    const { bookId } = request.params;

    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    const updatedAt = new Date().toISOString();
    const finished = readBookFinishedCheck(pageCount, readPage);

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
    
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
    
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = {...books[index], name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt};

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
    
        response.code(200);
        return response;
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};

const deleteBook = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
    
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};


module.exports = {addNewBookHandler, getBooksHandler, getDetailBook, updateDataBook, deleteBook};
