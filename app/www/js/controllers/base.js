angular.module('Capablanca.controllers')

<<<<<<< HEAD
.controller('BaseController', function($scope, $ionicActionSheet, $ionicModal, Books, PhotosService, DataService){
  $scope.showText = "Hello World";
=======
.controller('BaseController', function($scope, $ionicModal, Books, DataService){
>>>>>>> 61d745b1eb06a7a2696778b64950cda2448b7910

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
});
