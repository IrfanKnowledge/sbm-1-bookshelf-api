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

const getAllBooksHandler = (request, _) => {
  if (books.length > 0) {
    const { name: vName, reading: vReading, finished: vFinished } = request.query

    if (vName === undefined && vReading === undefined && vFinished === undefined) {
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

    /** request.query = true */
    const name = vName === undefined ? undefined : typeof vName !== 'string' ? undefined : vName.toLowerCase()
    const reading = vReading === undefined ? undefined : Boolean(vReading)
    const finished = vFinished === undefined ? undefined : Boolean(vFinished)

    const filteredBooks = books.filter((b) => {
      let selected = false

      if (name !== undefined) {
        console.log(b.id, name)
        b.name.includes(name) ? selected = true : selected = false
        console.log(b.name.includes(name))
      }

      if (reading !== undefined) {
        reading === b.reading ? selected = true : selected = false
      }

      if (finished !== undefined) {
        finished === b.finished ? selected = true : selected = false
      }
      return selected
    })

    if (filteredBooks.length > 0) {
      const booksLite = filteredBooks.map((b) => {
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
  }

  /** books = 0 or [] */
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

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const index = books.findIndex((b) => b.id === bookId)

  if (index !== -1) {
    let finished = false
    if (readPage === pageCount) {
      finished = true
    }

    const book = books[index]

    const updatedAt = new Date().toISOString()
    const newBook = {
      ...book,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt
    }

    books[index] = newBook

    return {
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((b) => b.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    return {
      status: 'success',
      message: 'Buku berhasil dihapus'
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler
}
