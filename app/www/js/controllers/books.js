angular.module('Capablanca.controllers')

.controller('BooksController', function($scope, $stateParams, $ionicActionSheet, $jrCrop, $http, PhotosService, DataService, BooksService){
  BooksService.get(parseInt($stateParams.id))
  .success(function(data) {
    $scope.book = data;
    $scope.pages = $scope.book.pages;
    $scope.createPage({title: "yayo"});
    $scope.createPage({title: "ohai"});
  });

  function postImageData(data){
    $http({
      method: 'POST',
      url: 'http://c413542d.ngrok.io/analyze',
      data: {image:data},
      // headers: {'Content-Type': 'multipart/form-data'},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      }
    })
    .success(function(data){
      console.log(data);
      $scope.bookData = data;
    })
    .error(function(data, status, headers, config){
      console.log(data);
    });
  }

  $scope.createPage = function(data) {
    DataService.insertPage(data, $stateParams.id);
    console.log("inserted");
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
        // var image = new Image();
        // image.src = "data:image/jpeg;base64," + data;
        // $jrCrop.crop({
        //     url: image,
        //     width: 800,
        //     height: 800,
        //     title: 'Move and Scale'
        // });
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
