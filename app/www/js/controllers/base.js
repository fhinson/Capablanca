angular.module('Capablanca.controllers')

.controller('BaseController', function($scope, $ionicModal){

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
    $scope.closeNewBook();
  }

  $scope.showText = "Ayyy this is where your books go";
  $scope.data = {id: 0, title: "", description: ""};

  // substitute for database books
  $scope.books = [
    {id: 1, title: "ayy", description: "o"},
    {id: 2, title: "lmao", description: "o"},
    {id: 3, title: "wat", description: "o"},
    {id: 4, title: "ye", description: "o"},
    {id: 5, title: "lol", description: "o"},
    {id: 6, title: "rofl", description: "o"},
  ];
})
