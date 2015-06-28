angular.module('Capablanca.controllers')

.controller('BaseController', function($scope, $ionicActionSheet, $ionicModal, Books, PhotosService, DataService){
  $scope.showText = "Hello World";

  // ionic modal
  $ionicModal.fromTemplateUrl('templates/newBook.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.newBookModal = modal;
  });

  $scope.newBook = function() {
    $scope.newBookModal.show();
  }

  $scope.closeNewBook = function() {
    $scope.newBookModal.hide();
  }

  $scope.createBook = function() {
    $scope.books.unshift({title: $scope.data.title, description: $scope.data.description});
    DataService.insertBook($scope.data.title, $scope.data.description)
    .success(function(){
      console.log("successfully inserted");
    })
    .error(function(err){
      console.log(err);
    });
    $scope.closeNewBook();
  }

  $scope.showText = "Ayyy this is where your books go";
  $scope.data = {title: "", description: ""};

  $scope.books = Books.all();

  $scope.$on('databaseInitialized', function(event, args) {
    DataService.getBook()
    .success(function(data){
      console.log(data);
    })
    .error(function(err){
      console.log(err);
    })
  });
});
