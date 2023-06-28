const { nanoid } = require('nanoid')
const { books } = require('./books')

const addBooksHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const id = nanoid(16)

  let finished = false
  if (readPage === pageCount) {
    finished = true
  }

  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  books.push({
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  })

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: `${id}`
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = () => {
  if (books.length > 0) {
    const booksLite = books.map((b) => {
      const { id, name, publisher } = b
      const temp = {
        id, name, publisher
      }
      return temp
    })
    return {
      status: 'success',
      data: {
        books: booksLite
      }
    }
  }

  return {
    status: 'success',
    data: {
      books
    }
  }
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    return {
      status: 'success',
      data: {
        book: books[index]
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler
}
