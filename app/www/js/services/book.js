angular.module('Capablanca.services')

.factory('BooksService', function(DataService) {
   return {
    all: function() {
      return DataService.getBook();
    },

    get: function(id) {
      return DataService.getBook(id);
    }
  }
})