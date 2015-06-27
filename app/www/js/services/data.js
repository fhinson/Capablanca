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

      query = "CREATE TABLE IF NOT EXISTS books (id integer primary key, title string, description text, timestamp date default (datetime('now','localtime')))"
      $cordovaSQLite.execute(db, query)
      .then(function(res){
        query = "CREATE TABLE IF NOT EXISTS pages (id integer primary key, data text, book integer, FOREIGN KEY(book) REFERENCES book(id), timestamp date default (datetime('now','localtime')))"
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

    insertBook: function(){
      // eg: DataService.insertBook(title, description)

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
