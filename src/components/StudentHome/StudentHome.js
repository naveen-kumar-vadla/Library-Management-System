import React from "react";

const SEARCH_BOOK_LABEL = "Search By Book Name / Book Id";
const SEARCH_BOOK = "Search Book";
const RETURN_BOOK = "RETURN";
const STUDENT_HOME_TITLE = "Student Home";
const NO_SEARCH_RESULT = "Sorry ! No search result found.";

class AdminHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      libraryBooks: [],
      searchResult: [],
      searchTerm: "",
      isSearched: false
    };
  }

  async loadBooks() {
    await fetch("/student-books", { method: "GET" })
      .then(res => res.json())
      .then(res => {
        this.setState({ books: res });
      });
  }

  async loadLibraryBooks() {
    await fetch("/books", { method: "GET" })
      .then(res => res.json())
      .then(res => {
        this.setState({ libraryBooks: res });
      });
  }

  async componentDidMount() {
    await this.loadBooks();
    await this.loadLibraryBooks();
  }

  searchBook() {
    const books = this.state.libraryBooks.filter(book =>
      book.name.includes(this.state.searchTerm)
    );
    this.setState({ searchResult: books, isSearched: true });
  }

  renderSearchBook() {
    return (
      <div>
        <input
          type="text"
          name="bookName"
          placeholder={SEARCH_BOOK_LABEL}
          onChange={e => this.setState({ searchTerm: e.target.value })}
          required
        />
        <button onClick={this.searchBook.bind(this)}>{SEARCH_BOOK}</button>
        {this.state.isSearched ? (
          this.state.searchResult.length ? null : (
            <h2>{NO_SEARCH_RESULT}</h2>
          )
        ) : null}
      </div>
    );
  }

  renderReturnBook(book) {
    return (
      <form method="POST" action="/return-book">
        <input type="text" name="id" value={book.id} hidden={true} />
        <input type="submit" value={RETURN_BOOK} />
      </form>
    );
  }

  renderBook(book) {
    return (
      <div>
        <h2>{book.name}</h2>
        {this.renderReturnBook(book)}
      </div>
    );
  }

  renderLibraryBook(book) {
    const { name, id, assignedTo } = book;
    return (
      <div>
        <h2>{name}</h2>
        <h3>{id}</h3>
        <h4>{assignedTo}</h4>
      </div>
    );
  }

  renderBooks(books) {
    return books.map(book => {
      return this.renderLibraryBook(book);
    });
  }

  renderLibrayBooks() {
    return this.renderBooks(this.state.libraryBooks);
  }

  renderSearchResult() {
    return this.renderBooks(this.state.searchResult);
  }

  render() {
    return (
      <div>
        <h1>{STUDENT_HOME_TITLE}</h1>
        {this.renderSearchBook()}
        {this.state.books.map(book => {
          return this.renderBook(book);
        })}
        {this.renderSearchResult()}
        {this.renderLibrayBooks()}
      </div>
    );
  }
}

export default AdminHome;
