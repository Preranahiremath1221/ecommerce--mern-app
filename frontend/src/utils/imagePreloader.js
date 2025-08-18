class ImagePreloader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
  }

  preloadImage(src) {
    if (!src) return Promise.resolve(null);
    
    // Return cached image if already loaded
    if (this.cache.has(src)) {
      return Promise.resolve(this.cache.get(src));
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    // Create new loading promise
    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        this.loadingPromises.delete(src);
        resolve(img);
      };
      
      img.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });

    this.loadingPromises.set(src, loadPromise);
    return loadPromise;
  }

  preloadImages(imageArray) {
    if (!Array.isArray(imageArray) || imageArray.length === 0) {
      return Promise.resolve([]);
    }

    const promises = imageArray.map(src => this.preloadImage(src));
    return Promise.allSettled(promises);
  }

  isImageCached(src) {
    return this.cache.has(src);
  }

  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

export default new ImagePreloader();
