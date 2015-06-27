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

  $scope.uploadPhoto = function(){
    var processPhoto = function(data, dataType){
      if(dataType == "image"){
        $scope.user.avatar = data.toString();
        PhotosService.convertImgToBase64(data, function(imgData){
          console.log(imgData.split(",")[1]);
        });
      }
      else if(dataType == "base64"){
        console.log("data:image/jpeg;base64," + data);
      }
    }

    var buttons = [
      { text: 'Take Photo' },
      { text: 'Choose from Library' }
    ];

    var hideSheet = $ionicActionSheet.show({
      buttons: buttons,
      titleText: 'Upload Photo',
      cancelText: 'Cancel',
      cancel: function() {
      },
      buttonClicked: function(index) {
        if(index == 0){
          PhotosService.takePhoto()
          .success(function(data) {
            processPhoto(data, "base64");
            hideSheet();
          }).error(function(data) {
          });
        }
        else if(index == 1){
          PhotosService.selectPhoto()
          .success(function(data){
            processPhoto(data, "image");
            hideSheet();
          }).error(function(data) {
          });
        }
      }
    });
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
  $scope.data = {id: 0, title: "", description: ""};

  $scope.books = Books.all();
});
