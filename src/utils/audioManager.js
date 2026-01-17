// Global audio manager for solar system music
class AudioManager {
    constructor() {
        this.audio = null;
        this.isInitialized = false;
    }

    // Initialize and preload the audio
    initialize() {
        if (this.isInitialized) return;

        this.audio = new Audio(`${import.meta.env.VITE_BASE_URL || '/'}sounds/interstellar_stay.mp3`);
        this.audio.loop = true;
        this.audio.volume = 0.5;
        this.audio.preload = 'auto';
        this.isInitialized = true;

        // Preload the audio
        this.audio.load();
    }

    // Play the audio (requires user interaction)
    async play() {
        if (!this.audio) {
            this.initialize();
        }

        try {
            await this.audio.play();
            return true;
        } catch (error) {
            console.log('Audio playback prevented:', error);
            return false;
        }
    }

    // Stop and reset audio
    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }

    // Pause audio
    pause() {
        if (this.audio) {
            this.audio.pause();
        }
    }
}

// Export singleton instance
export const solarAudio = new AudioManager();
