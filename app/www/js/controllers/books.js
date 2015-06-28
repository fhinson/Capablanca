angular.module('Capablanca.controllers')

.controller('BooksController', function($scope, $stateParams, $cordovaCapture, $ionicPopup, $ionicActionSheet, $ionicModal, $jrCrop, $http, PhotosService, DataService, BooksService){
  $scope.showLoadingSpinner = false;
  BooksService.get(parseInt($stateParams.id))
  .success(function(data) {
    $scope.book = data;
    console.log($scope.book);
    $scope.pages = $scope.book.pages;
  })
  .error(function(err){
    console.log(err);
  });

  function postImageData(data){
    $scope.pageModal.show();
    $scope.showLoadingSpinner = true;
    $scope.showPopup();
    $http({
      method: 'POST',
      url: 'http://c413542d.ngrok.io/analyze',
      data: {image:data, fast:true},
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
      $scope.showLoadingSpinner = false;
      $scope.popup.close();
      $scope.pageData = data;
      $scope.createPage($scope.pageData);
    })
    .error(function(data, status, headers, config){
      console.log(data);
    });
  }

  $scope.captureAudio = function() {
    var options = { limit: 1, duration: 10 };

    $cordovaCapture.captureAudio(options).then(function(audioData) {
      // Success! Audio data is here
      console.log(audioData);
    }, function(err) {
      // An error occurred. Show a message to the user
    });
  }

  $scope.createPage = function(data) {
    DataService.insertPage(JSON.stringify(data), $stateParams.id)
    .success(function(data){
      if ($scope.pages && $scope.pages.length > 0)
        $scope.pages.unshift(data);
      else
        $scope.pages = [data];
      console.log("inserted" + data);
    })
    .error(function(err) {
      console.log("error " + err);
    });
  }

  // ionic modal
  $ionicModal.fromTemplateUrl('templates/page.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.pageModal = modal;
  });

  $scope.closePage= function() {
    $scope.pageModal.hide();
  }

  $scope.selectPage = function(page){
    $scope.pageData = page.data;
    $scope.pageData = JSON.parse($scope.pageData);
    $scope.pageModal.show();
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

$scope.showPopup = function() {
  $scope.data = {}
    // An elaborate, custom popup
    $scope.popup = $ionicPopup.show({
      template: '<ion-spinner class="spinner-energized c-spinner" ng-show="showLoadingSpinner"></ion-spinner>',
      title: 'Processing Image...',
      subTitle: '',
      scope: $scope
    });
    $scope.popup.then(function(res) {
      console.log('Tapped!', res);
    });
  };
})
