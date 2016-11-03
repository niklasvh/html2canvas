function VideoContainer(imageData) {
  this.src = imageData.args[0].src;

  // Adding index to identify the video element as <video> can have multiple child <source>.
  this.videoIndex = imageData.videoIndex;
  imageData.args[0].videoIndex = imageData.videoIndex;
  this.image = imageData.args[0];
  this.promise = new Promise(function (resolve, reject){
    imageData.args[0].muted = true;
    var originalVideos = document.getElementsByTagName('video');
    if (originalVideos.length !== 0 && originalVideos[imageData.videoIndex]) {
      var originalVideo = originalVideos[imageData.videoIndex];
      if (originalVideo.currentTime) {
        imageData.args[0].currentTime = originalVideo.currentTime;
      }
      if (!imageData.args[0].paused) {
        resolve();
      } else {
        var playPromise = imageData.args[0].play();
        if (playPromise) {
          playPromise.then(resolve, reject);
        } else {
          resolve();
        }
      }
    } else {
      resolve();
    }
  });
}

module.exports = VideoContainer;
