class VideoWithBackground {
  video;
  canvas;
  step;
  ctx;

  constructor(videoId, canvasId) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!mediaQuery.matches) {
      this.video = document.getElementById(videoId);
      this.canvas = document.getElementById(canvasId);

      window.addEventListener('load', this.init, false);
      window.addEventListener('unload', this.cleanup, false);
    }
  }

  draw = () => {
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
  };

  drawLoop = () => {
    this.draw();
    this.step = window.requestAnimationFrame(this.drawLoop);
  };

  drawPause = () => {
    window.cancelAnimationFrame(this.step);
    this.step = undefined;
  };

  init = () => {
    this.ctx = this.canvas.getContext('2d');
    this.ctx.filter = 'blur(1px)';

    // Démarrer l'animation dès que la vidéo est chargée
    this.video.addEventListener('loadeddata', () => {
      this.draw(); // Dessiner la première frame
      this.drawLoop(); // Démarrer la boucle d'animation
    }, false);

    // Redessiner quand l'utilisateur cherche une nouvelle position dans la vidéo
    this.video.addEventListener('seeked', this.draw, false);

    // Gérer la pause si l'utilisateur interagit avec la vidéo
    this.video.addEventListener('pause', this.drawPause, false);
  };

  cleanup = () => {
    this.video.removeEventListener('loadeddata', this.draw);
    this.video.removeEventListener('seeked', this.draw);
    this.video.removeEventListener('pause', this.drawPause);
  };
}

const el = new VideoWithBackground('js-video', 'js-canvas');