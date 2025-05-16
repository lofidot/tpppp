console.log('main.js loaded');
// Simple Sound Player
document.addEventListener('DOMContentLoaded', function() {
    // Preload images
    function preloadImages() {
        const imagesToPreload = [
            "https://i.pinimg.com/originals/5f/a7/56/5fa756bd5a44204fc72891f265b4fd2b.gif",
            "https://i.pinimg.com/originals/e5/18/e8/e518e8a24b9c04a887bd4432289a5e88.gif",
            "https://i.pinimg.com/originals/c5/4e/8f/c54e8f5b82a0b0c6ff9d8ccb3f5d66fe.gif"
        ];

        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Call preload function
    preloadImages();

    // State
    const state = {
      currentSound: null,
      isPlaying: false,
        hideUI: localStorage.getItem('hideUI') === 'true',
        useSoundBackground: true,
        customBackground: null,
        timer: {
          mode: 'focus',
          timerType: 'pomodoro', // pomodoro, simple, endless
          timeLeft: 25 * 60, // 25 minutes in seconds
          totalTime: 25 * 60,
          isRunning: false,
          isEditing: false,
          timer: null,
          elapsedTime: 0 // For endless timer
        }
    };
    
    // Audio element
    const audio = new Audio();
    audio.loop = true;

    // Beep sound for timer end
    const timerBeep = new Audio('https://api.substack.com/feed/podcast/159247735/d47b8fa79d5b4c3e0171d2d1b0f50e48.mp3');
    timerBeep.volume = 1.0;

    // Fallback sounds (original sounds)
    const fallbackSounds = [
          {
            id: "heavy-rain",
            name: "Heavy Rain",
            url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/heavy-rain.mp3",
            imageUrl: "https://i.pinimg.com/originals/5f/a7/56/5fa756bd5a44204fc72891f265b4fd2b.gif",
        thumbnailUrl: "https://i.pinimg.com/originals/5f/a7/56/5fa756bd5a44204fc72891f265b4fd2b.gif",
        category: "Nature",
        tags: ["featured"]
          },
          {
        id: "traffic",
        name: "Traffic",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/traffic.mp3",
        imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&q=80",
        category: "Urban",
        tags: ["featured"]
      },
      {
        id: "road",
        name: "Road",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/road.mp3",
        imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80",
        category: "Urban"
      },
      {
        id: "highway",
        name: "Highway",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/highway.mp3",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=100&q=80",
        category: "Urban"
      },
      {
        id: "fireworks",
        name: "Fireworks",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/fireworks.mp3",
        imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80",
        category: "Urban",
        tags: ["featured"]
      },
      {
        id: "crowd",
        name: "Crowd",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/crowd.mp3",
        imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
        category: "Urban"
      },
      {
        id: "street",
        name: "Street",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/busy-street.mp3",
        imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=100&q=80",
        category: "Urban"
      },
      {
        id: "ambulance-siren",
        name: "Ambulance Siren",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/ambulance-siren.mp3",
        imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=100&q=80",
        category: "Urban"
      },
      {
        id: "train",
        name: "Train",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/train.mp3",
        imageUrl: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=100&q=80",
        category: "Transport",
        tags: ["featured"]
      },
      {
        id: "submarine",
        name: "Submarine",
        url: "https://github.com/lofidot/moodist/blob/main/public/sounds/transport/submarine.mp3",
        imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=100&q=80",
        category: "Transport"
      },
      {
        id: "sailboat",
        name: "Sailboat",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/sailboat.mp3",
        imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80",
        category: "Transport"
      },
      {
        id: "rowing-boat",
        name: "Rowing Boat",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/rowing-boat.mp3",
        imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
        category: "Transport"
      },
      {
        id: "inside-a-train",
        name: "Inside a train",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/inside-a-train.mp3",
        imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&q=80",
        category: "Transport"
      },
      {
        id: "airplane",
        name: "Airplane",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/airplane.mp3",
        imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=100&q=80",
        category: "Transport"
      },
      {
        id: "windshield-wipers",
        name: "Windshield Wipers",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/windshield-wipers.mp3",
        imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
        category: "Things"
      },
      {
        id: "wind-chimes",
        name: "Wind Chimes",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/wind-chimes.mp3",
        imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80",
        category: "Things"
      },
      {
        id: "washing-machine",
        name: "Washing Machine",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/washing-machine.mp3",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=100&q=80",
        category: "Things"
      },
      {
        id: "vinyl-effect",
        name: "Vinyal Effect",
        url: "https://github.com/lofidot/moodist/blob/main/public/sounds/things/vinyl-effect.mp3",
        imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80",
        category: "Things"
      },
      {
        id: "tuning-radio",
        name: "Tuning Radio",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/tuning-radio.mp3",
        imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=100&q=80",
        category: "Things"
      },
      {
        id: "slide-projector",
        name: "Slide projectors",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/slide-projector.mp3",
        imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=100&q=80",
        category: "Things"
      },
      {
        id: "singing-bowl",
        name: "Singing Bowl",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/singing-bowl.mp3",
        imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80",
        category: "Things"
      },
      {
        id: "paper",
        name: "Paper",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/paper.mp3",
        imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
        category: "Things"
      },
      {
        id: "keyboard",
        name: "Keyboard",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/keyboard.mp3",
        imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80",
        category: "Things"
      },
      {
        id: "rain-on-leaves",
        name: "Rain on leaves",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/rain-on-leaves.mp3",
        imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&q=80",
        category: "Rain"
      },
      {
        id: "rain-on-tent",
        name: "Rain on tent",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/rain-on-tent.mp3",
        imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80",
        category: "Rain"
      },
      {
        id: "rain-on-umbrella",
        name: "Rain on umbrella",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/rain-on-umbrella.mp3",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=100&q=80",
        category: "Rain"
      },
      {
        id: "rain-on-window",
        name: "Rain on window",
        url: "https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/rain-on-window.mp3",
        imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=100&q=80",
        category: "Rain",
        tags: ["featured"]
      }
    ];

    // Fallback themes (original themes)
    const fallbackThemes = [
      {
        id: "rain",
        name: "Rain",
        imageUrl: "https://i.pinimg.com/originals/5f/a7/56/5fa756bd5a44204fc72891f265b4fd2b.gif",
        thumbnailUrl: "https://i.pinimg.com/originals/5f/a7/56/5fa756bd5a44204fc72891f265b4fd2b.gif"
      },
      {
        id: "forest",
        name: "Forest",
        imageUrl: "https://i.pinimg.com/originals/e5/18/e8/e518e8a24b9c04a887bd4432289a5e88.gif",
        thumbnailUrl: "https://i.pinimg.com/originals/e5/18/e8/e518e8a24b9c04a887bd4432289a5e88.gif"
      },
      {
        id: "cropfield",
        name: "Cropfield",
        imageUrl: "https://cdn.jsdelivr.net/gh/lofidot/webflowwwwww@main/pexels-pixabay-158827.jpg",
        thumbnailUrl: "https://cdn.jsdelivr.net/gh/lofidot/webflowwwwww@main/pexels-pixabay-158827.jpg"
      },
      {
        id: "seathunder",
        name: "Seathunder",
        imageUrl: "https://cdn.jsdelivr.net/gh/lofidot/webflowwwwww@main/pexels-rpnickson-2775196.jpg",
        thumbnailUrl: "https://cdn.jsdelivr.net/gh/lofidot/webflowwwwww@main/pexels-rpnickson-2775196.jpg"
      },
      {
        id: "grassfield",
        name: "Grassfield",
        imageUrl: "https://cdn.jsdelivr.net/gh/lofidot/webflowwwwww@main/pexels-pixabay-259280.jpg",
        thumbnailUrl: "https://cdn.jsdelivr.net/gh/lofidot/webflowwwwww@main/pexels-pixabay-259280.jpg"
      }
    ];

    // Function to get sounds from Webflow CMS
    async function getSoundsFromWebflow() {
      try {
        const soundElements = document.querySelectorAll('[data-sound-item]');
        if (!soundElements || soundElements.length === 0) {
          console.log('No Webflow CMS sounds found, using fallback sounds');
          return fallbackSounds;
        }

        const webflowSounds = Array.from(soundElements).map(element => ({
          id: element.getAttribute('data-sound-id') || generateUniqueId(),
          name: element.getAttribute('data-sound-name') || 'Untitled Sound',
          url: element.getAttribute('data-sound-url'),
          imageUrl: element.getAttribute('data-sound-background') || element.getAttribute('data-sound-thumbnail'),
          thumbnailUrl: element.getAttribute('data-sound-thumbnail'),
          category: element.getAttribute('data-sound-category') || 'Other',
          tags: (element.getAttribute('data-sound-tags') || '').split(',').map(tag => tag.trim()).filter(Boolean)
        }));

        // Validate sounds and filter out invalid ones
        const validSounds = webflowSounds.filter(sound => {
          const isValid = sound.url && (sound.thumbnailUrl || sound.imageUrl);
          if (!isValid) {
            console.warn(`Invalid sound configuration for "${sound.name}"`);
          }
          return isValid;
        });

        if (validSounds.length === 0) {
          console.log('No valid Webflow CMS sounds found, using fallback sounds');
          return fallbackSounds;
        }

        return validSounds;
      } catch (error) {
        console.error('Error loading Webflow CMS sounds:', error);
        return fallbackSounds;
      }
    }

    // Function to get themes from Webflow CMS
    async function getThemesFromWebflow() {
      try {
        const themeElements = document.querySelectorAll('[data-theme-item]');
        if (!themeElements || themeElements.length === 0) {
          console.log('No Webflow CMS themes found, using fallback themes');
          return fallbackThemes;
        }

        const webflowThemes = Array.from(themeElements).map(element => ({
          id: element.getAttribute('data-theme-id') || generateUniqueId(),
          name: element.getAttribute('data-theme-name') || 'Untitled Theme',
          imageUrl: element.getAttribute('data-theme-url'),
          thumbnailUrl: element.getAttribute('data-theme-thumbnail') || element.getAttribute('data-theme-url')
        }));

        // Validate themes and filter out invalid ones
        const validThemes = webflowThemes.filter(theme => {
          const isValid = theme.imageUrl && theme.thumbnailUrl;
          if (!isValid) {
            console.warn(`Invalid theme configuration for "${theme.name}"`);
          }
          return isValid;
        });

        if (validThemes.length === 0) {
          console.log('No valid Webflow CMS themes found, using fallback themes');
          return fallbackThemes;
        }

        return validThemes;
      } catch (error) {
        console.error('Error loading Webflow CMS themes:', error);
        return fallbackThemes;
      }
    }

    // Generate unique ID for sounds without IDs
    function generateUniqueId() {
      return 'sound-' + Math.random().toString(36).substr(2, 9);
    }

    // Initialize sounds
    let sounds = [];

    // Load sounds from Webflow CMS or use fallbacks
    async function loadSounds() {
      try {
        sounds = await getSoundsFromWebflow();
        renderSoundGrid();
        renderSoundLibrary();
      } catch (error) {
        console.error('Error initializing sounds:', error);
        sounds = fallbackSounds;
        renderSoundGrid();
        renderSoundLibrary();
      }
    }

    // Initialize themes
    let themes = [];

    // Load themes from Webflow CMS or use fallbacks
    async function loadThemes() {
      try {
        themes = await getThemesFromWebflow();
        renderThemeGrid();
      } catch (error) {
        console.error('Error initializing themes:', error);
        themes = fallbackThemes;
        renderThemeGrid();
      }
    }

    // DOM Elements with error handling
    const getElement = (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with id '${id}' not found`);
            throw new Error(`Required element '${id}' is missing`);
        }
        return element;
    };

    const app = getElement('app');
    const backgroundOverlay = getElement('background-overlay');
    const soundGrid = getElement('sound-grid');
    const playButton = getElement('play-btn');
    const playIcon = getElement('play-icon');
    const pauseIcon = getElement('pause-icon');
    const hideUIButton = getElement('hide-ui-btn');
    const themeButton = getElement('theme-btn');
    const themeModal = getElement('theme-modal');
    const closeModalButton = getElement('close-modal');
    const customBgUrlInput = getElement('custom-bg-url');
    const applyBgButton = getElement('apply-bg-btn');
    const soundLibraryBtn = getElement('sound-library-btn');
    const soundLibrary = getElement('sound-library');
    const closeLibraryBtn = getElement('close-library');

    // Timer Toggle Functionality
    const timerToggleBtn = document.getElementById('timer-toggle-btn');
    const timerContainer = document.querySelector('.timer-container');
    
    // Load saved timer visibility state
    const timerVisible = localStorage.getItem('timerVisible') === 'true';
    if (timerVisible) {
        timerContainer.classList.add('visible');
    }
    
    timerToggleBtn.addEventListener('click', () => {
        timerContainer.classList.toggle('visible');
    });

    // Store the original document title
    const originalTitle = document.title;

    // Functions
    function playSound() {
      if (!state.currentSound) return;
      
        // Only set the source if it's different from the current one
        if (!audio.src || audio.src !== state.currentSound.url) {
            audio.src = state.currentSound.url;
        }
        
        audio.play()
        .then(() => {
          state.isPlaying = true;
          updatePlayButton();
          updateBackground();
          renderSoundGrid();
          updateSoundLibraryIcons();
          backgroundOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        })
        .catch(error => {
          console.error('Error playing audio:', error);
          showToast('Could not play audio. Please try again.', 'error');
          state.isPlaying = false;
        });
    }
    
    function pauseSound() {
        audio.pause();
      state.isPlaying = false;
      updatePlayButton();
      updateSoundLibraryIcons();
      backgroundOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      renderSoundGrid();
    }
    
    function updatePlayButton() {
        playButton.classList.toggle('active', state.isPlaying);
        playIcon.classList.toggle('hidden', state.isPlaying);
        pauseIcon.classList.toggle('hidden', !state.isPlaying);
    }

    function updateBackground() {
        // Remove any existing video background
        let videoBg = document.getElementById('background-video');
        if (videoBg) {
            videoBg.parentNode.removeChild(videoBg);
        }

        // Helper: is video URL
        function isVideoUrl(url) {
            return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
        }

        let bgUrl = null;
        if (state.useSoundBackground && state.currentSound) {
            bgUrl = state.currentSound.imageUrl;
        } else if (state.customBackground) {
            bgUrl = state.customBackground;
        }

        if (bgUrl && isVideoUrl(bgUrl)) {
            // Set up video background
            videoBg = document.createElement('video');
            videoBg.id = 'background-video';
            videoBg.src = bgUrl;
            videoBg.autoplay = true;
            videoBg.loop = true;
            videoBg.muted = true;
            videoBg.playsInline = true;
            videoBg.style.position = 'absolute';
            videoBg.style.top = '0';
            videoBg.style.left = '0';
            videoBg.style.width = '100%';
            videoBg.style.height = '100%';
            videoBg.style.objectFit = 'cover';
            videoBg.style.zIndex = '0';
            videoBg.style.pointerEvents = 'none';
            videoBg.style.background = 'black';
            // Insert before backgroundOverlay so overlay is above video
            app.insertBefore(videoBg, backgroundOverlay);
            app.style.backgroundImage = 'none';
        } else if (bgUrl) {
            app.style.backgroundImage = `url(${bgUrl})`;
        } else {
            app.style.backgroundImage = 'none';
        }
        // If UI is hidden, use lighter overlay
        if (state.hideUI) {
            backgroundOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        } else {
        backgroundOverlay.style.backgroundColor = state.isPlaying ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.7)';
        }
    }

    function toggleUIVisibility() {
        state.hideUI = !state.hideUI;
        
        // Hide/show elements
        const controlsContainer = document.querySelector('.controls-container');
        const soundGrid = document.getElementById('sound-grid');
        const timerContainer = document.querySelector('.timer-container');
        const unhideButton = document.createElement('button');
        
        if (state.hideUI) {
            // Hide elements
            if (controlsContainer) controlsContainer.classList.add('hidden');
            if (soundGrid) soundGrid.classList.add('hidden');
            
            // Create and show unhide button
            unhideButton.id = 'unhide-btn';
            unhideButton.className = 'unhide-button';
            unhideButton.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2L22 22" stroke="currentColor" stroke-width="2"/>
                    <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884L6.71277 6.7226Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="currentColor" stroke-width="2"/>
                    <path d="M15.0005 12C15.0005 12 15.0005 12.0001 15.0005 12.0001M12.0005 9C12.0005 9 12.0005 9.00006 12.0005 9.00006" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 5C16.7915 5 20.0334 8.62459 21.4938 10.7509C22.0118 11.5037 22.0118 12.4963 21.4938 13.2491C21.1159 13.8163 20.5485 14.5695 19.8071 15.3454" stroke="currentColor" stroke-width="2"/>
                </svg>
            `;
            unhideButton.addEventListener('click', toggleUIVisibility);
            document.body.appendChild(unhideButton);
        } else {
            // Show elements
            if (controlsContainer) controlsContainer.classList.remove('hidden');
            if (soundGrid) soundGrid.classList.remove('hidden');
            
            // Remove unhide button
            const existingUnhideBtn = document.getElementById('unhide-btn');
            if (existingUnhideBtn) existingUnhideBtn.remove();
        }
        
        // Don't hide timer if it's visible
        if (timerContainer && timerContainer.classList.contains('visible')) {
            timerContainer.classList.remove('hidden');
        }
        
        localStorage.setItem('hideUI', state.hideUI);
        updateBackground();
    }
    
    function handlePlayPauseClick(event) {
        event.stopPropagation(); // Prevent event bubbling
        
        if (!state.currentSound) {
            showToast('Please select a sound first', 'info');
            return;
        }
        
        if (state.isPlaying) {
            pauseSound();
        } else {
            playSound();
        }
    }

    function selectSound(sound) {
        const wasPlaying = state.isPlaying && state.currentSound && state.currentSound.id === sound.id;
        state.currentSound = sound;
        
        if (wasPlaying) {
        pauseSound();
      } else {
        playSound();
        }
        
        updateBackground();
        renderSoundGrid();
        updateSoundLibraryIcons();
    }

    function handleImageLoad(img) {
        img.setAttribute('loaded', 'true');
        img.style.animation = 'none';
    }

    function renderSoundGrid() {
        soundGrid.innerHTML = '';
        // Only show 6 sounds with the 'featured' tag
        const featuredSounds = sounds.filter(sound => Array.isArray(sound.tags) && sound.tags.includes('featured')).slice(0, 6);
        featuredSounds.forEach(sound => {
            const soundCard = document.createElement('div');
            soundCard.className = 'sound-card';
            const isActive = state.currentSound && state.currentSound.id === sound.id;
            const isCurrentlyPlaying = isActive && state.isPlaying;
            soundCard.innerHTML = `
                <button class="sound-button ${isActive ? 'active' : ''} ${isCurrentlyPlaying ? 'playing' : ''}" data-sound-id="${sound.id}">
                    <img loading="lazy" src="${sound.thumbnailUrl}" alt="${sound.name}" width="100" height="100">
                    <div class="sound-indicator"></div>
                </button>
                <span class="sound-name">${sound.name}</span>
            `;
            const soundButton = soundCard.querySelector('.sound-button');
            const img = soundButton.querySelector('img');
            img.addEventListener('load', () => handleImageLoad(img));
            soundButton.addEventListener('click', () => selectSound(sound));
            soundGrid.appendChild(soundCard);
        });
    }

    function showToast(message, type = 'info') {
        // Only log to console, do not show in UI
        if (type === 'error') {
            console.error(message);
        } else if (type === 'success') {
            console.log('Success:', message);
        } else {
            console.log(message);
        }
        // (No DOM manipulation for toast messages)
    }

    function closeAllBottomSheets() {
      document.querySelectorAll('.bottom-sheet').forEach(sheet => {
        sheet.classList.remove('active');
        sheet.classList.add('hidden');
      });
    }

    function initializeThemeTabs() {
      const themeTabs = document.querySelectorAll('.theme-tab-btn');
      const tabPanes = document.querySelectorAll('.tab-pane');
      themeTabs.forEach(tab => {
        tab.onclick = null;
        tab.addEventListener('click', function() {
          themeTabs.forEach(t => t.classList.remove('active'));
          tabPanes.forEach(pane => pane.classList.remove('active'));
          tab.classList.add('active');
          const tabName = tab.getAttribute('data-tab');
          const pane = document.getElementById('tab-' + tabName);
          if (pane) pane.classList.add('active');
          if (tabName === 'default') {
            state.useSoundBackground = true;
            state.customBackground = null;
            updateBackground();
            localStorage.setItem('useSoundBackground', 'true');
            localStorage.removeItem('customBackground');
            showToast('Using sound backgrounds');
            closeThemeModal();
          }
        });
        tab.onkeydown = null;
        tab.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tab.click();
          }
        });
      });
    }

    async function openThemeModal() {
      closeAllBottomSheets();
      themeModal.classList.remove('hidden');
      void themeModal.offsetWidth;
      themeModal.classList.add('active');
      initializeThemeTabs();
      // Always reload themes and grid when opening modal
      await loadThemes();
    }

    function toggleSoundLibrary() {
      if (soundLibrary.classList.contains('active')) {
        soundLibrary.classList.remove('active');
        soundLibrary.classList.add('hidden');
        if (soundLibraryBtn) soundLibraryBtn.classList.remove('active');
      } else {
        closeAllBottomSheets();
        soundLibrary.classList.remove('hidden');
        void soundLibrary.offsetWidth; // Force reflow for transition
        soundLibrary.classList.add('active');
        if (soundLibraryBtn) soundLibraryBtn.classList.add('active');
      }
    }

    function closeThemeModal() {
      themeModal.classList.remove('active');
            themeModal.classList.add('hidden');
    }

    function closeSoundLibrary() {
      soundLibrary.classList.remove('active');
      soundLibrary.classList.add('hidden');
      if (soundLibraryBtn) soundLibraryBtn.classList.remove('active');
    }

    function setCustomBackground(url, isPreset = false) {
        if (!url) {
            showToast('Please enter a valid image URL', 'error');
        return;
      }
        if (isPreset) {
            state.customBackground = url;
            state.useSoundBackground = false;
            updateBackground();
            showToast('Background updated successfully');
            localStorage.setItem('customBackground', url);
            localStorage.setItem('useSoundBackground', 'false');
            localStorage.setItem('selectedTheme', url);
            closeThemeModal();
            return;
        }
        // Test if the image URL is valid
        const img = new Image();
        img.onload = () => {
            state.customBackground = url;
            state.useSoundBackground = false;
          updateBackground();
            showToast('Background updated successfully');
            localStorage.setItem('customBackground', url);
            localStorage.setItem('useSoundBackground', 'false');
            localStorage.setItem('selectedTheme', url);
            closeThemeModal();
        };
        img.onerror = () => {
            showToast('Invalid image URL. Please try another.', 'error');
        };
        img.src = url;
    }

    function renderSoundLibrary() {
      const categories = [...new Set(sounds.map(sound => sound.category))];
      const sheetContent = soundLibrary.querySelector('.sheet-content');
      sheetContent.innerHTML = '';

      categories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'sound-category';
        categorySection.innerHTML = `
          <h3>${category}</h3>
          <div class="sound-library-list">
            ${sounds
              .filter(sound => sound.category === category)
              .map(sound => {
                const isActive = state.currentSound && state.currentSound.id === sound.id && state.isPlaying;
                return `
                  <div class="library-sound-item ${isActive ? 'active' : ''}" data-sound-id="${sound.id}">
                    <div class="library-sound-thumbnail">
                      <img src="${sound.thumbnailUrl}" alt="${sound.name}">
                    <div class="library-sound-status">
                      <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5.14v14.72a.5.5 0 00.76.43l11.52-7.36a.5.5 0 000-.86L8.76 4.71a.5.5 0 00-.76.43z" fill="currentColor"/>
                      </svg>
                      <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5h2v14H8V5zm6 0h2v14h-2V5z" fill="currentColor"/>
                      </svg>
                    </div>
                    </div>
                    <span class="library-sound-name">${sound.name}</span>
                  </div>
                `;
              }).join('')}
          </div>
        `;

        // Add click event listeners to sound items
        categorySection.querySelectorAll('.library-sound-item').forEach(item => {
          item.addEventListener('click', () => {
            const soundId = item.dataset.soundId;
            const sound = sounds.find(s => s.id === soundId);
            if (sound) {
              selectSound(sound);
              closeSoundLibrary();
            }
          });
        });

        sheetContent.appendChild(categorySection);
      });
    }

    function updateSoundLibraryIcons() {
      const soundItems = document.querySelectorAll('.library-sound-item');
      soundItems.forEach(item => {
        const soundId = item.dataset.soundId;
        const isActive = state.currentSound && state.currentSound.id === soundId && state.isPlaying;
        item.classList.toggle('active', isActive);
      });
    }

    function toggleSound(soundId) {
      const sound = sounds.find(s => s.id === soundId);
      if (!sound) return;
      const isActive = state.currentSound && state.currentSound.id === soundId && state.isPlaying;
      if (isActive) {
        pauseSound();
      } else {
        selectSound(sound);
        playSound();
      }
      updateSoundLibraryIcons();
    }

    function renderThemeGrid() {
      const presetGrid = document.querySelector('.preset-grid');
      if (!presetGrid) return;

      presetGrid.innerHTML = themes.map(theme => {
        const isActive = !state.useSoundBackground && state.customBackground === theme.imageUrl;
        return `
          <div class="preset-theme${isActive ? ' active' : ''}" data-theme="${theme.imageUrl}">
          <div class="preset-preview" style="background-image: url('${theme.thumbnailUrl}')"></div>
          <span>${theme.name}</span>
        </div>
        `;
      }).join('');

      // Attach event listeners for preset themes after rendering
      attachPresetThemeListeners();
    }

    // Event Listeners
    playButton.addEventListener('click', () => {
      if (!state.currentSound) {
        // Select and play the first featured sound if none is selected
        const firstFeaturedSound = sounds.find(sound => Array.isArray(sound.tags) && sound.tags.includes('featured'));
        if (firstFeaturedSound) {
          selectSound(firstFeaturedSound);
          return;
        }
        // Fallback: select the first sound in the list
        if (sounds.length > 0) {
          selectSound(sounds[0]);
          return;
        }
        showToast('No sounds available to play', 'error');
        return;
      }
      state.isPlaying = !state.isPlaying;
      if (state.isPlaying) {
        playSound();
      } else {
        pauseSound();
      }
    });
    hideUIButton.addEventListener('click', toggleUIVisibility);
    themeButton.addEventListener('click', openThemeModal);
    closeModalButton.addEventListener('click', closeThemeModal);
    soundLibraryBtn.addEventListener('click', toggleSoundLibrary);
    closeLibraryBtn.addEventListener('click', closeSoundLibrary);

    // Handle preset theme buttons
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !themeModal.classList.contains('hidden')) {
            closeThemeModal();
        }
    });

    // --- Timer State ---
    // Load custom durations from localStorage or use defaults
    let pomodoroFocusDuration = parseInt(localStorage.getItem('pomodoroFocusDuration'), 10) || 25 * 60;
    let pomodoroBreakDuration = parseInt(localStorage.getItem('pomodoroBreakDuration'), 10) || 5 * 60;
    // Set initial timeLeft/totalTime based on mode and timerType
    let timeLeft = state.timer.timerType === 'pomodoro'
      ? (state.timer.mode === 'focus' ? pomodoroFocusDuration : pomodoroBreakDuration)
      : 25 * 60;
    let totalTime = timeLeft;

    // --- DOM Elements ---
  const timerDisplay = document.getElementById('timerDisplay');
  const timeDisplay = document.getElementById('time');
  const progressBar = document.getElementById('progress');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const restartBtn = document.getElementById('restartBtn');
  const decreaseBtn = document.getElementById('decrease');
  const increaseBtn = document.getElementById('increase');
  const modeButtons = document.querySelectorAll('.mode-btn');
  const modeSwitcher = document.getElementById('modeSwitcher');
  const timerTypeDots = document.querySelectorAll('.timer-type-dot');
  
    // --- Format/Parse Time ---
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }
  function parseTime(timeString) {
    const parts = timeString.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      return parts[0] * 60;
    }
    return 0;
  }
  
    // --- Display Update ---
  function updateDisplay() {
      const t = state.timer;
      if (t.timerType === 'endless') {
        timeDisplay.textContent = formatTime(t.elapsedTime);
      progressBar.style.width = '0%';
        } else {
        timeDisplay.textContent = formatTime(t.timeLeft);
        const progressPercent = ((t.totalTime - t.timeLeft) / t.totalTime) * 100;
      progressBar.style.width = `${progressPercent}%`;
        }
      if (t.isRunning) {
      startBtn.style.display = 'none';
      pauseBtn.classList.add('visible');
      restartBtn.classList.add('visible');
    } else {
      startBtn.style.display = 'flex';
      pauseBtn.classList.remove('visible');
      restartBtn.classList.remove('visible');
    }
    // Hide + and - buttons in endless timer
    if (t.timerType === 'endless') {
      decreaseBtn.style.display = 'none';
      increaseBtn.style.display = 'none';
    } else {
      decreaseBtn.style.display = '';
      increaseBtn.style.display = '';
    }
    // Update browser tab title with timer
    if (t.isRunning) {
      let timeString;
      if (t.timerType === 'endless') {
        timeString = formatTime(t.elapsedTime);
      } else {
        timeString = formatTime(t.timeLeft);
      }
      document.title = `${timeString} | ${originalTitle}`;
    } else {
      document.title = originalTitle;
    }
  }
  
    // --- Timer Logic ---
  function toggleTimer() {
      const t = state.timer;
      if (t.isRunning) {
        clearInterval(t.timer);
        t.isRunning = false;
      enableControls();
    } else {
        if (t.timerType !== 'endless' && t.timeLeft <= 0) resetTimer();
        t.timer = setInterval(() => {
          if (t.timerType === 'endless') {
            t.elapsedTime++;
          updateDisplay();
        } else {
            t.timeLeft--;
          updateDisplay();
            if (t.timeLeft <= 0) {
              clearInterval(t.timer);
              t.isRunning = false;
              // Play beep sound when timer ends (Pomodoro or Simple)
              if (t.timerType === 'pomodoro' || t.timerType === 'simple') {
                try { timerBeep.currentTime = 0; timerBeep.play(); } catch (e) { /* ignore */ }
              }
              if (t.timerType === 'pomodoro' && t.mode === 'focus') {
              toggleMode('break');
                toggleTimer();
            } else {
              enableControls();
            }
          }
        }
      }, 1000);
        t.isRunning = true;
      disableControls();
    }
      updateDisplay();
  }
  function resetTimer() {
      const t = state.timer;
      clearInterval(t.timer);
      t.isRunning = false;
      if (t.timerType === 'endless') {
        t.elapsedTime = 0;
      } else if (t.timerType === 'pomodoro') {
        if (t.mode === 'focus') {
          // Use custom focus duration if set
          t.timeLeft = parseInt(localStorage.getItem('pomodoroFocusDuration'), 10) || 25 * 60;
          t.totalTime = t.timeLeft;
      } else {
          // Use custom break duration if set
          t.timeLeft = parseInt(localStorage.getItem('pomodoroBreakDuration'), 10) || 5 * 60;
          t.totalTime = t.timeLeft;
      }
      } else if (t.timerType === 'simple') {
        // Use custom simple timer duration if set
        t.timeLeft = parseInt(localStorage.getItem('simpleTimerDuration'), 10) || 25 * 60;
        t.totalTime = t.timeLeft;
    }
    updateDisplay();
    enableControls();
  }
  function toggleMode(newMode) {
      const t = state.timer;
      if (newMode === t.mode || t.timerType !== 'pomodoro') return;
      t.mode = newMode;
      clearInterval(t.timer);
      t.isRunning = false;
      if (t.mode === 'focus') {
        t.timeLeft = parseInt(localStorage.getItem('pomodoroFocusDuration'), 10) || 25 * 60;
        t.totalTime = t.timeLeft;
    } else {
        t.timeLeft = parseInt(localStorage.getItem('pomodoroBreakDuration'), 10) || 5 * 60;
        t.totalTime = t.timeLeft;
    }
    updateDisplay();
    enableControls();
    modeButtons.forEach(btn => {
        if (btn.dataset.mode === t.mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  function changeTimerType(newType) {
      const t = state.timer;
      if (newType === t.timerType) return;
      t.timerType = newType;
      clearInterval(t.timer);
      t.isRunning = false;
      if (t.timerType === 'pomodoro') {
      modeSwitcher.classList.remove('hidden');
        t.mode = 'focus';
        t.timeLeft = parseInt(localStorage.getItem('pomodoroFocusDuration'), 10) || 25 * 60;
        t.totalTime = t.timeLeft;
      } else if (t.timerType === 'simple') {
      modeSwitcher.classList.add('hidden');
        // Use custom simple timer duration if set
        t.timeLeft = parseInt(localStorage.getItem('simpleTimerDuration'), 10) || 25 * 60;
        t.totalTime = t.timeLeft;
      } else if (t.timerType === 'endless') {
      modeSwitcher.classList.add('hidden');
        t.elapsedTime = 0;
    }
    timerTypeDots.forEach(dot => {
        if (dot.dataset.timerType === t.timerType) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    modeButtons.forEach(btn => {
      if (btn.dataset.mode === 'focus') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    updateDisplay();
    enableControls();
  }
  function adjustTime(amount) {
      const t = state.timer;
      if (t.isRunning || t.timerType === 'endless') return;
      t.timeLeft = Math.max(0, t.timeLeft + amount);
      t.totalTime = t.timeLeft;
    updateDisplay();
  }
  function handleTimeClick() {
      const t = state.timer;
      if (t.isRunning || t.isEditing || t.timerType === 'endless') return;
      t.isEditing = true;
    const currentTimeText = timeDisplay.textContent;
    timeDisplay.innerHTML = `<input type="text" class="time-input" value="${currentTimeText}" maxlength="8">`;
    const timeInput = document.querySelector('.time-input');
    timeInput.focus();
    timeInput.select();
    timeInput.addEventListener('blur', finishEditing);
    timeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEditing();
    });
    timeInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9:]/g, '');
    });
  }
  function finishEditing() {
      const t = state.timer;
    const timeInput = document.querySelector('.time-input');
    if (!timeInput) return;
    let timeValue = timeInput.value;
    if (!timeValue.includes(':')) {
      const minutes = parseInt(timeValue, 10) || 0;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours > 0) {
        timeValue = `${hours}:${mins.toString().padStart(2, '0')}:00`;
      } else {
        timeValue = `${mins.toString().padStart(2, '0')}:00`;
      }
    } else if (timeValue.split(':').length === 2) {
      const [mins, secs] = timeValue.split(':');
      timeValue = `${mins.padStart(2, '0')}:${secs.padStart(2, '0')}`;
    } else if (timeValue.split(':').length === 3) {
      const [hours, mins, secs] = timeValue.split(':');
      timeValue = `${hours}:${mins.padStart(2, '0')}:${secs.padStart(2, '0')}`;
    }
      t.timeLeft = parseTime(timeValue);
      t.totalTime = t.timeLeft;
      // Save custom durations for Pomodoro focus/break
      if (t.timerType === 'pomodoro') {
        if (t.mode === 'focus') {
          localStorage.setItem('pomodoroFocusDuration', t.timeLeft);
        } else if (t.mode === 'break') {
          localStorage.setItem('pomodoroBreakDuration', t.timeLeft);
        }
      }
      // Save custom duration for simple timer
      if (t.timerType === 'simple') {
        localStorage.setItem('simpleTimerDuration', t.timeLeft);
      }
    timeDisplay.innerHTML = '';
      timeDisplay.textContent = formatTime(t.timeLeft);
      t.isEditing = false;
  }
  function disableControls() {
    decreaseBtn.classList.add('disabled');
    increaseBtn.classList.add('disabled');
    modeButtons.forEach(btn => btn.classList.add('disabled'));
    timerDisplay.classList.add('disabled');
    timerTypeDots.forEach(dot => dot.parentElement.classList.add('disabled'));
  }
  function enableControls() {
    decreaseBtn.classList.remove('disabled');
    increaseBtn.classList.remove('disabled');
    modeButtons.forEach(btn => btn.classList.remove('disabled'));
    timerDisplay.classList.remove('disabled');
    timerTypeDots.forEach(dot => dot.parentElement.classList.remove('disabled'));
  }
  
    // --- Event Listeners ---
  startBtn.addEventListener('click', toggleTimer);
  pauseBtn.addEventListener('click', toggleTimer);
    restartBtn.addEventListener('click', resetTimer);
    decreaseBtn.addEventListener('click', () => adjustTime(-60));
    increaseBtn.addEventListener('click', () => adjustTime(60));
  timeDisplay.addEventListener('click', handleTimeClick);
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!state.timer.isRunning && state.timer.timerType === 'pomodoro') {
        toggleMode(btn.dataset.mode);
      }
    });
  });
  timerTypeDots.forEach(dot => {
    dot.addEventListener('click', () => {
        if (!state.timer.isRunning && dot.dataset.timerType !== state.timer.timerType) {
        changeTimerType(dot.dataset.timerType);
      }
    });
  });
  
    // --- Initialize ---
    // On load, set timer to correct custom value for pomodoro mode and simple timer
    if (state.timer.timerType === 'pomodoro') {
      if (state.timer.mode === 'focus') {
        state.timer.timeLeft = parseInt(localStorage.getItem('pomodoroFocusDuration'), 10) || 25 * 60;
        state.timer.totalTime = state.timer.timeLeft;
      } else if (state.timer.mode === 'break') {
        state.timer.timeLeft = parseInt(localStorage.getItem('pomodoroBreakDuration'), 10) || 5 * 60;
        state.timer.totalTime = state.timer.timeLeft;
      }
    } else if (state.timer.timerType === 'simple') {
      // Load custom simple timer duration if set
      state.timer.timeLeft = parseInt(localStorage.getItem('simpleTimerDuration'), 10) || 25 * 60;
      state.timer.totalTime = state.timer.timeLeft;
    }
    updateDisplay();

    // Theme Modal Tab System
    const themeTabs = document.querySelectorAll('.theme-tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    themeTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active from all tabs and panes
        themeTabs.forEach(t => t.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        // Add active to clicked tab and corresponding pane
        tab.classList.add('active');
        const tabName = tab.getAttribute('data-tab');
        const pane = document.getElementById('tab-' + tabName);
        if (pane) pane.classList.add('active');
        // If Default tab, apply sound background immediately and close modal
        if (tabName === 'default') {
          state.useSoundBackground = true;
          state.customBackground = null;
          updateBackground();
          localStorage.setItem('useSoundBackground', 'true');
          localStorage.removeItem('customBackground');
          showToast('Using sound backgrounds');
            closeThemeModal();
        }
  });
      // Keyboard accessibility
      tab.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tab.click();
        }
      });
    });

    // Attach event listeners for preset themes (once, after DOMContentLoaded or after renderThemeGrid)
    function attachPresetThemeListeners() {
      document.querySelectorAll('.preset-theme').forEach(button => {
        button.replaceWith(button.cloneNode(true)); // Remove all listeners
      });
      document.querySelectorAll('.preset-theme').forEach(button => {
        button.addEventListener('click', () => {
          const themeUrl = button.dataset.theme;
          state.customBackground = themeUrl;
          state.useSoundBackground = false;
          renderThemeGrid(); // Re-render to update active state immediately
          setCustomBackground(themeUrl, true); // true = isPreset
        });
      });
    }
    attachPresetThemeListeners();

    // Attach event listener for custom background apply button (once)
    if (applyBgButton && customBgUrlInput) {
      applyBgButton.onclick = null;
      applyBgButton.addEventListener('click', () => {
        setCustomBackground(customBgUrlInput.value.trim());
      });
    }

    // Ensure the sound grid is rendered
    loadSounds();

    // To-Do List Bottom Sheet Logic (fixed selectors and show/hide)
    const todoSheet = document.getElementById('todo-sheet');
    const openTodoBtn = document.getElementById('open-todo-btn');
    const closeTodoBtn = document.getElementById('close-todo');

    function openTodoSheet() {
      closeAllBottomSheets();
      todoSheet.classList.remove('hidden');
      void todoSheet.offsetWidth;
      todoSheet.classList.add('active');
      feather.replace();
    }

    function closeTodoSheet() {
      todoSheet.classList.remove('active');
      todoSheet.classList.add('hidden');
    }

    if (openTodoBtn) openTodoBtn.addEventListener('click', openTodoSheet);
    if (closeTodoBtn) closeTodoBtn.addEventListener('click', closeTodoSheet);

    // On page load, restore cached theme if present
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        state.customBackground = savedTheme;
        state.useSoundBackground = false;
        updateBackground();
    }

    // --- Goal Placeholder Logic ---
    const goalDiv = document.getElementById('current-goal');
    const placeholder = 'Goal for This Session?';

    if (goalDiv) {
      goalDiv.addEventListener('focus', function() {
        if (goalDiv.textContent.trim() === placeholder) {
          goalDiv.textContent = '';
          goalDiv.style.color = '#fff'; // Normal text color (white)
        }
      });

      goalDiv.addEventListener('blur', function() {
        if (goalDiv.textContent.trim() === '') {
          goalDiv.textContent = placeholder;
          goalDiv.style.color = '#bdbdbd'; // Placeholder color
        }
      });

      // On page load, set color based on content
      if (goalDiv.textContent.trim() === placeholder) {
        goalDiv.style.color = '#bdbdbd';
      } else {
        goalDiv.style.color = '#fff';
      }
    }
});
  