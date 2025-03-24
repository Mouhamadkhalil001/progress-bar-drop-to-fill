/**
 * Drop-to-Fill Progress Animation
 * Created for: Mouhamadkhalil001drop
 * Date: 2025-03-20 19:02:22
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const liquid = document.getElementById('liquid');
    const progressText = document.getElementById('progressText');
    const dropsArea = document.getElementById('dropsArea');
    const splashContainer = document.getElementById('splashContainer');
    const restartBtn = document.getElementById('restartBtn');
    
    // Configuration
    const config = {
        targetProgress: 70,
        dropInterval: 700,  // milliseconds between drops
        dropSize: {min: 10, max: 18},  // random size range for drops
        fillIncrement: 2,   // how much each drop fills the container
        maxDrops: 35        // total drops to reach target (70/2=35)
    };
    
    // Variables
    let progress = 0;
    let dropsCreated = 0;
    let dropInterval;
    let isAnimating = false;
    
    /**
     * Update the progress display
     */
    function updateProgress(percent) {
        // Limit to target progress
        percent = Math.min(percent, config.targetProgress);
        
        // Update text
        progressText.textContent = `${percent}%`;
        
        // Update fill height
        liquid.style.height = `${percent}%`;
        
        // Change text color based on fill level
        if (percent > 50) {
            progressText.style.color = '#fff';
            progressText.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        } else {
            progressText.style.color = '#333';
            progressText.style.textShadow = '0 2px 4px rgba(255, 255, 255, 0.6)';
        }
    }
    
    /**
     * Create and animate a water drop
     */
    function createDrop() {
        if (progress >= config.targetProgress) {
            clearInterval(dropInterval);
            isAnimating = false;
            return;
        }
        
        dropsCreated++;
        
        // Create drop element
        const drop = document.createElement('div');
        drop.className = 'drop';
        
        // Random horizontal position
        const leftPos = Math.random() * 170 + 15; // Keep drops within container width
        
        // Random size variation
        const size = Math.random() * 
            (config.dropSize.max - config.dropSize.min) + 
            config.dropSize.min;
        
        // Style the drop
        drop.style.left = `${leftPos}px`;
        drop.style.width = `${size}px`;
        drop.style.height = `${size}px`;
        
        // Add to DOM
        dropsArea.appendChild(drop);
        
        // Remove drop after animation completes
        drop.addEventListener('animationend', function() {
            // Create splash effect when drop hits the liquid
            createSplash(leftPos);
            
            // Update progress when drop hits
            progress += config.fillIncrement;
            updateProgress(progress);
            
            // Remove the drop element
            this.remove();
        });
    }
    
    /**
     * Create splash effect when drop hits the liquid
     */
    function createSplash(position) {
        // Calculate where splash should appear (at current water level)
        const waterHeight = progress;
        const splashYPosition = 250 - (waterHeight / 100 * 250);
        
        // Create splash element
        const splash = document.createElement('div');
        splash.className = 'splash';
        
        splash.style.left = `${position}px`;
        splash.style.top = `${splashYPosition}px`;
        
        // Add to container
        splashContainer.appendChild(splash);
        
        // Remove after animation
        splash.addEventListener('animationend', function() {
            this.remove();
        });
    }
    
    /**
     * Start the drop animation sequence
     */
    function startDropAnimation() {
        if (isAnimating) return;
        
        // Reset variables
        progress = 0;
        dropsCreated = 0;
        isAnimating = true;
        
        // Update initial state
        updateProgress(0);
        
        // Clear any existing drops
        dropsArea.innerHTML = '';
        
        // Start dropping at intervals
        dropInterval = setInterval(createDrop, config.dropInterval);
    }
    
    // Initialize
    updateProgress(0);
    
    // Start animation on page load
    setTimeout(startDropAnimation, 500);
    
    // Add event listener for restart button
    restartBtn.addEventListener('click', function() {
        // Only restart if not already animating
        if (!isAnimating) {
            startDropAnimation();
        }
    });
});