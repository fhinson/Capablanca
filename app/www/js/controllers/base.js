angular.module('Capablanca.controllers')

.controller('BaseController', function($scope, $state, $ionicActionSheet, $ionicModal, BooksService, PhotosService, DataService){

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
    if ($scope.books && $scope.books.length > 0)
      $scope.books.unshift({title: $scope.data.title, description: $scope.data.description});
    else
      $scope.books = [{title: $scope.data.title, description: $scope.data.description}];
    DataService.insertBook($scope.data.title, $scope.data.description)
    .success(function(){
      console.log("successfully inserted");
      console.log($scope.books);
    })
    .error(function(err){
      console.log(err);
    });
    $scope.closeNewBook();
  }

  $scope.data = {title: "", description: ""};
  $scope.books = [];

  $scope.goto = function(id){
    $state.go("books", {id: id});
  }


  $scope.$on('databaseInitialized', function(event, args) {
    BooksService.all()
    .success(function(data) {
      $scope.books = data;
    });
  });
});
