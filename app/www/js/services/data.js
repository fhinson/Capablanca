angular.module('Capablanca.services')

.service('DataService', function($q, $cordovaSQLite){
  var db = null;

  return{
    initialize: function(){
      var deferred = $q.defer();
      var promise = deferred.promise;

      // books table
      // columns: id, title, description

      // pages table
      // columns: id, data, book
      // FOREIGN KEY(book) REFERENCES book(id)

      db = $cordovaSQLite.openDB("capablanca.db");
      var query;

      query = "CREATE TABLE IF NOT EXISTS books (id integer primary key, title string, description text, timestamp date default (datetime('now','localtime')))";
      $cordovaSQLite.execute(db, query)
      .then(function(res){
        query = "CREATE TABLE IF NOT EXISTS pages (id integer primary key, data text, book integer, timestamp date default (datetime('now','localtime')), foreign key(book) references book(id))";
        $cordovaSQLite.execute(db, query)
        .then(function(res){
          deferred.resolve(res);
        }, function(err){
          deferred.reject(err);
        });
      }, function(err){
        deferred.reject(err);
      });

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    },

    getBook: function(id){
      // example usage:

      // get all books
      // DataService.getBook()
      // .success(function(data){
      //   console.log(data);
      // });

      // get specific book
      // DataService.getBook(3)
      // .success(function(data){
      //   console.log(data);
      // });


      var deferred = $q.defer();
      var promise = deferred.promise;
      var query;

      if (typeof id === "undefined"){
        query = "SELECT * FROM books";
      }
      else if(typeof id === "number"){
        query = "SELECT * FROM BOOKS where id = " + id;
      }
      else{
        deferred.reject("Invalid id format");
      }

      $cordovaSQLite.execute(db, query, []).then(function(res) {
        var data = [];
        for(var i = 0; i < res.rows.length; i++){
          data.push({
            id: res.rows.item(i).id,
            title: res.rows.item(i).title,
            description: res.rows.item(i).description
          });
        }
        deferred.resolve(data);
      }, function(err){
        deferred.reject(err);
      });

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    },

    insertBook: function(title, description){
      // example usage: DataService.insertBook(title, description)

      var deferred = $q.defer();
      var promise = deferred.promise;

      var query = "INSERT INTO books (title, description) VALUES (?,?)";

      $cordovaSQLite.execute(db, query, [title, description]).then(function(res) {
        deferred.resolve(res);
      }, function (err) {
        deferred.reject(err);
      });

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    }

  };
})
