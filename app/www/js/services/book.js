angular.module('Capablanca.services')

.factory('Books', function() {

   // substitute for database books
   var books = [
     {id: 1, title: "ayy", description: "o"},
     {id: 2, title: "lmao", description: "o"},
     {id: 3, title: "wat", description: "o"},
     {id: 4, title: "ye", description: "o"},
     {id: 5, title: "lol", description: "o"},
     {id: 6, title: "rofl", description: "o"},
   ];

   return {
    all: function() {
      return books;
    },

    get: function(id) {
      for (var i = 0; i < books.length; i++) {
        if (books[i].id === parseInt(id)) {
          return books[i];
        }
      }
      return null;
    }
  }
})