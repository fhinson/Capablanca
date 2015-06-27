angular.module('Capablanca.controllers')

.controller('BooksController', function($scope, $stateParams, Books){
  $scope.book = Books.get($stateParams.id);
})