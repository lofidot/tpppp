// Supabase client initialization
const supabaseUrl = 'https://nlejaciidjebkufybtpx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZWphY2lpZGplYmt1ZnlidHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MDkyMjYsImV4cCI6MjA1ODM4NTIyNn0.xXsukS0EdDRdpy0t4aDIFJJa4nYH4_50ismmHmKwpHk';

// Create a class for the StumbleVideo application
class StumbleVideo {
  constructor(container, mode) {
    this.container = container;
    this.mode = mode; // 'home' or 'page'
    
    if (!this.container) {
      console.error("Container not found.");
      return;
    }

    // Initialize Supabase client
    this.supabase = this.createSupabaseClient();
    
    // Setup state
    this.currentVideo = null;
    this.isLoading = false;
    
    // Setup the UI based on mode
    this.setupUI();
    
    // Load appropriate content
    if (this.mode === 'home') {
      // Get video ID from URL if present
      const urlParams = new URLSearchParams(window.location.search);
      const videoId = urlParams.get('video');
      
      if (videoId) {
        this.loadVideoById(videoId);
      } else {
        this.loadRandomVideo();
      }
    } else if (this.mode === 'page') {
      // Video page only loads from id parameter
      const urlParams = new URLSearchParams(window.location.search);
      const videoId = urlParams.get('id');
      
      if (videoId) {
        this.loadVideoById(videoId);
      } else {
        this.showError('No video ID provided in URL');
      }
    }
  }

  // Initialize Supabase client
  createSupabaseClient() {
    return supabase.createClient(supabaseUrl, supabaseKey);
  }

  // Set up the main UI components
  setupUI() {
    // Basic structure for both modes
    this.container.innerHTML = `
      <div class="stumble-video-player-container">
        <div class="video-wrapper">
          <div id="video-placeholder-${this.container.id}" class="video-placeholder">
            <div class="loading-spinner" style="display: none;"></div>
          </div>
          <button class="share-button" aria-label="Share video">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" x2="12" y1="2" y2="15"></line></svg>
          </button>
        </div>
        <div class="content-container">
          <div class="category-chip" style="display: none;"></div>
          <h2 class="video-title"></h2>
          <p class="channel-name"></p>
          <p class="video-description"></p>
        </div>
      </div>
    `;

    // Add stumble button only on home page
    if (this.mode === 'home') {
      const stumbleButtonContainer = document.createElement('div');
      stumbleButtonContainer.innerHTML = `
        <button class="stumble-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 12a9 9 0 0 0 6.7 15L13 22"></path><path d="M14.3 19.9A9 9 0 0 0 21 12"></path></svg>
          <span>Stumble</span>
        </button>
      `;
      document.body.appendChild(stumbleButtonContainer);
      
      // Add event listener for stumble button
      document.querySelector('.stumble-button').addEventListener('click', () => {
        this.loadRandomVideo();
      });
    }

    // Add share button listener for both modes
    this.container.querySelector('.share-button').addEventListener('click', () => {
      this.handleShare();
    });
  }

  // Show loading state
  setLoading(isLoading) {
    this.isLoading = isLoading;
    const spinner = this.container.querySelector('.loading-spinner');
    const stumbleButton = document.querySelector('.stumble-button');
    
    if (isLoading) {
      spinner.style.display = 'block';
      if (stumbleButton && this.mode === 'home') {
        stumbleButton.disabled = true;
        stumbleButton.innerHTML = `
          <div class="button-spinner"></div>
          <span>Loading...</span>
        `;
      }
    } else {
      spinner.style.display = 'none';
      if (stumbleButton && this.mode === 'home') {
        stumbleButton.disabled = false;
        stumbleButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 12a9 9 0 0 0 6.7 15L13 22"></path><path d="M14.3 19.9A9 9 0 0 0 21 12"></path></svg>
          <span>Stumble</span>
        `;
      }
    }
  }

  // Load a random video from the "Intellectual" category
  async loadRandomVideo() {
    if (this.isLoading) return; // Prevent multiple requests
    
    this.setLoading(true);
    try {
      // Fetch up to 100 videos from the Intellectual category
      const { data, error } = await this.supabase
        .from('videos')
        .select('*')
        .eq('category', 'Intellectual')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        throw new Error('Error fetching videos: ' + error.message);
      }
      
      if (!data || data.length === 0) {
        throw new Error('No videos found');
      }
      
      // Select a random video from the results
      const randomIndex = Math.floor(Math.random() * data.length);
      const video = data[randomIndex];
      
      // Update the UI with the selected video
      this.updateVideoUI(video);
      
      // Update URL with video ID (only on home page)
      if (this.mode === 'home') {
        this.updateHomeURL(video.video_id);
      }
    } catch (error) {
      console.error('Failed to load random video:', error);
      this.showError('Could not load a video. Please try again.');
    } finally {
      this.setLoading(false);
    }
  }

  // Load a specific video by ID
  async loadVideoById(videoId) {
    this.setLoading(true);
    try {
      const { data, error } = await this.supabase
        .from('videos')
        .select('*')
        .eq('video_id', videoId)
        .single();
      
      if (error) {
        throw new Error('Error fetching video: ' + error.message);
      }
      
      if (!data) {
        throw new Error('Video not found');
      }
      
      // Update the UI with the video
      this.updateVideoUI(data);
    } catch (error) {
      console.error('Failed to load video by ID:', error);
      this.showError('Could not load the requested video.');
      
      // Fall back to a random video if on home page
      if (this.mode === 'home') {
        this.loadRandomVideo();
      }
    } finally {
      this.setLoading(false);
    }
  }

  // Update the UI with video data
  updateVideoUI(video) {
    this.currentVideo = video;
    
    // Update the video player
    const videoPlaceholder = this.container.querySelector(`#video-placeholder-${this.container.id}`);
    const thumbnailUrl = `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`;
    
    videoPlaceholder.innerHTML = `
      <div class="thumbnail-container" data-video-id="${video.video_id}">
        <img src="${thumbnailUrl}" alt="${video.title}" class="video-thumbnail" onerror="this.src='https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg'">
        <div class="play-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="play-icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
      </div>
    `;
    
    // Add click event to the thumbnail to load the actual player
    this.container.querySelector('.thumbnail-container').addEventListener('click', (e) => {
      const videoId = e.currentTarget.dataset.videoId;
      this.loadYoutubePlayer(videoId);
    });
    
    // Update video metadata
    this.container.querySelector('.video-title').textContent = video.title;
    this.container.querySelector('.channel-name').textContent = video.channel_name;
    
    // Update description if available
    const descriptionElement = this.container.querySelector('.video-description');
    if (video.description) {
      descriptionElement.textContent = video.description;
      descriptionElement.style.display = 'block';
    } else {
      descriptionElement.style.display = 'none';
    }
    
    // Update category if available
    const categoryElement = this.container.querySelector('.category-chip');
    if (video.category) {
      categoryElement.textContent = video.category;
      categoryElement.style.display = 'inline-block';
    } else {
      categoryElement.style.display = 'none';
    }
  }

  // Replace thumbnail with YouTube player
  loadYoutubePlayer(videoId) {
    const videoPlaceholder = this.container.querySelector(`#video-placeholder-${this.container.id}`);
    const iframe = document.createElement('iframe');
    
    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('class', 'youtube-iframe');
    
    videoPlaceholder.innerHTML = '';
    videoPlaceholder.appendChild(iframe);
  }

  // Update the URL with the current video ID (only for home page)
  updateHomeURL(videoId) {
    if (this.mode !== 'home') return;
    
    const url = new URL(window.location.href);
    
    // Clear all existing video parameters
    url.searchParams.delete('id');
    
    // Set the home page video parameter
    url.searchParams.set('video', videoId);
    
    window.history.replaceState({}, '', url);
  }

  // Handle share button click - copy URL to clipboard
  async handleShare() {
    if (!this.currentVideo) return;
    
    // Create the video page URL - always points to the video page
    const baseUrl = window.location.origin;
    const videoPageUrl = `${baseUrl}/video?id=${this.currentVideo.video_id}`;
    
    try {
      await navigator.clipboard.writeText(videoPageUrl);
      this.showToast('Link copied to clipboard!', 'success');
    } catch (error) {
      console.error('Failed to copy link:', error);
      this.showToast('Failed to copy link', 'error');
    }
  }

  // Show error message
  showError(message) {
    const container = this.container.querySelector('.content-container');
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Remove any existing error messages
    const existingError = container.querySelector('.error-message');
    if (existingError) {
      container.removeChild(existingError);
    }
    
    container.prepend(errorElement);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorElement.parentNode === container) {
        container.removeChild(errorElement);
      }
    }, 5000);
  }

  // Show toast notification
  showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.stumble-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'stumble-toast-container';
      document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `stumble-toast ${type}`;
    toast.textContent = message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentNode === toastContainer) {
          toastContainer.removeChild(toast);
        }
        
        // Remove container if empty
        if (toastContainer.childNodes.length === 0) {
          document.body.removeChild(toastContainer);
        }
      }, 300);
    }, 3000);
  }
}

// Add CSS styles
function addStumbleStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .stumble-video-player-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      position: relative;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    .video-wrapper {
      position: relative;
      width: 100%;
      padding-top: 56.25%; /* 16:9 aspect ratio */
      margin-bottom: 20px;
      background-color: #000;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .video-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .thumbnail-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    
    .video-thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .play-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 64px;
      height: 64px;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .play-icon {
      color: white;
      stroke-width: 2px;
    }
    
    .youtube-iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
    
    .share-button {
      position: absolute;
      top: 12px;
      right: 12px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: background-color 0.2s;
    }
    
    .share-button:hover {
      background-color: rgba(0, 0, 0, 0.9);
    }
    
    .icon {
      width: 20px;
      height: 20px;
    }
    
    .content-container {
      padding: 0 15px;
    }
    
    .category-chip {
      display: inline-block;
      background-color: #e9e9e9;
      color: #333;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 14px;
      margin-bottom: 10px;
      font-weight: 500;
    }
    
    .video-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: #111;
    }
    
    .channel-name {
      font-size: 16px;
      color: #555;
      margin: 0 0 16px 0;
    }
    
    .video-description {
      font-size: 16px;
      line-height: 1.5;
      color: #333;
      margin-bottom: 30px;
    }
    
    .stumble-button {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #4a56e2;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 28px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: background-color 0.2s, transform 0.1s;
      z-index: 100;
    }
    
    .stumble-button:hover {
      background-color: #3a46c2;
    }
    
    .stumble-button:active {
      transform: translateX(-50%) scale(0.98);
    }
    
    .stumble-button:disabled {
      background-color: #a0a0a0;
      cursor: not-allowed;
    }
    
    .loading-spinner, .button-spinner {
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top: 2px solid white;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error-message {
      background-color: #ffeded;
      color: #d32f2f;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 14px;
    }
    
    .stumble-toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .stumble-toast {
      background-color: #333;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      min-width: 200px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      opacity: 1;
      transition: opacity 0.3s;
    }
    
    .stumble-toast.success {
      background-color: #4caf50;
    }
    
    .stumble-toast.error {
      background-color: #d32f2f;
    }
    
    .stumble-toast.fade-out {
      opacity: 0;
    }
    
    .button-spinner {
      display: inline-block;
      margin-right: 8px;
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      .video-title {
        font-size: 20px;
      }
      
      .stumble-button {
        bottom: 16px;
        padding: 10px 20px;
        font-size: 14px;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
}

// Initialize when the script loads
function initStumbleVideo() {
  // Load Supabase from CDN if not already loaded
  if (typeof supabase === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.8.0/dist/umd/supabase.min.js';
    script.onload = () => {
      // Add CSS
      addStumbleStyles();
      
      // Initialize home page component
      document.querySelectorAll('[data-stumble-video-home]').forEach(container => {
        new StumbleVideo(container, 'home');
      });
      
      // Initialize video page component
      document.querySelectorAll('[data-stumble-video-page]').forEach(container => {
        new StumbleVideo(container, 'page');
      });
    };
    document.head.appendChild(script);
  } else {
    // Supabase already loaded
    addStumbleStyles();
    
    // Initialize home page component
    document.querySelectorAll('[data-stumble-video-home]').forEach(container => {
      new StumbleVideo(container, 'home');
    });
    
    // Initialize video page component
    document.querySelectorAll('[data-stumble-video-page]').forEach(container => {
      new StumbleVideo(container, 'page');
    });
  }
}

// Run initialization when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStumbleVideo);
} else {
  initStumbleVideo();
}
