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
  $scope.data = {title: "", description: ""};

  // substitute for database books
  $scope.books = [
    {title: "ayy", description: "o"},
    {title: "lmao", description: "o"},
    {title: "wat", description: "o"},
    {title: "ye", description: "o"},
    {title: "lol", description: "o"},
    {title: "rofl", description: "o"},
  ];
})
