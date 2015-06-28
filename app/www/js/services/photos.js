angular.module('Capablanca.services')

// service for taking pictures and getting pictures from library
.service('PhotosService', function($q, $cordovaCamera, $cordovaImagePicker){
  return {
    takePhoto: function(){
      var deferred = $q.defer();
      var promise = deferred.promise;

      document.addEventListener("deviceready", function () {
        var options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 800,
          targetHeight: 800,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
          deferred.resolve(imageData);
        }, function(err) {
          deferred.reject(err);
        });
      }, false);

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    },

    selectPhoto: function(){
      var deferred = $q.defer();
      var promise = deferred.promise;

      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };

      $cordovaImagePicker.getPictures(options)
      .then(function(result) {
        deferred.resolve(result);
      }, function(error) {
        deferred.reject(error);
      });

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    },

    convertImgToBase64: function(url, callback, outputFormat){
      var img = new Image();
      var x = 40;
      img.crossOrigin = 'Anonymous';
      img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = x;
        canvas.width = x;
        ctx.drawImage(img, 0, 0, x, x);
        dataURL = canvas.toDataURL({
          format: outputFormat,
          quality: 1.0
        });
        callback(dataURL);
        canvas = null;
      };
      img.src = url;
    }
  }
});
