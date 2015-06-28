angular.module('Capablanca.controllers')

.controller('BooksController', function($scope, $stateParams, $ionicActionSheet, PhotosService, Books){
  $scope.book = Books.get($stateParams.id);

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
})