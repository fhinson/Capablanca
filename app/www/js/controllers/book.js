angular.module('Capablanca.controllers')

.controller('BooksController', function($scope, $stateParams, $ionicActionSheet, $http, PhotosService, DataService, BooksService){
  BooksService.get(parseInt($stateParams.id))
  .success(function(data) {
    $scope.book = data;
    console.log($scope.book);

  });

  function postImageData(data){
    $http({
      method: 'POST',
      url: 'http://c413542d.ngrok.io/analyze',
      data: data,
      headers: {'Content-Type': 'multipart/form-data'}
    })
    .success(function(data){
      console.log(data);
    })
    .error(function(err){
      console.log(err);
    });
  }

  $scope.uploadPhoto = function(){
    var processPhoto = function(data, dataType){
      if(dataType == "image"){
        $scope.user.avatar = data.toString();
        PhotosService.convertImgToBase64(data, function(imgData){
          postImageData(imgData.split(",")[1]);
        });
      }
      else if(dataType == "base64"){
        postImageData(data);
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
