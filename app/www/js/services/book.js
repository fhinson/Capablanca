angular.module('Capablanca.services')

.factory('BooksService', function(DataService) {
   return {
    all: function() {
      var books = DataService.getBooks();
      return books;
    },

    get: function(id) {
      var book = DataService.getBook(id);
      return book;
    }
  }
})