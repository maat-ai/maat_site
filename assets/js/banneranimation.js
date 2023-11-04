// This script will assign random animation durations and delays to the SVG images on load
document.addEventListener('DOMContentLoaded', function () {
    const svgs = document.querySelectorAll('.animated_object');
    svgs.forEach(svg => {
        // Generate random duration from 5 to 15 seconds
        const duration = Math.random() * 10 + 5; // 5 to 15 seconds
        // Generate random delay from 0 to 5 seconds
        const delay = Math.random() * 5; // 0 to 5 seconds
        // Generate random angle from 0 to 360 degrees
        const angle = Math.random() * 180; // 0 to 360 degrees

        // Set animation duration, delay, and angle
        svg.style.animationDuration = duration + 's';
        svg.style.animationDelay = '-' + delay + 's'; // Negative delay for immediate start
        svg.style.transform = 'rotate(' + angle + 'deg)';
    });
});

