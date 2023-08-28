/**
 * Progress Bar Scroll Tracking Script
 * This script enhances the behavior of a progress bar by dynamically changing the active state of segments based on scroll position.
 * It uses Intersection Observer to monitor sections' visibility and updates progress segments accordingly using sectionObserver elements.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all the progress segments and sections
    const progressBarSegments = document.querySelectorAll('.progress-segment');
    const sectionLinks = Array.from(progressBarSegments).map(segment => segment.dataset.link);
    const sections = sectionLinks.map(link => document.querySelector(link));
    const footer = document.querySelector('footer'); // Select your footer element

    const observerOptions = {
        threshold: 0.1 // Trigger when at least 10% of the sectionObserver is visible
    };

    // Create an Intersection Observer instance for each section's sectionObserver
    sections.forEach((section, index) => {
        const sectionObserver = document.createElement('div');
        sectionObserver.id=`sectionObserver-${section.getAttribute('id')}`;        
        sectionObserver.classList.add('progress-section-observer');
        sectionObserver.style.bottom = `-${footer.offsetHeight}px`;
        sectionObserver.style.top = `${section.offsetTop}px`;
        sectionObserver.style.left = `50%`;
        sectionObserver.style.width = `1px`;
        sectionObserver.style.position = 'absolute';
        section.parentNode.insertBefore(sectionObserver, section);

        const observer = new IntersectionObserver(entries => {
            const isInViewport = entries[0].isIntersecting;
            const progressBarSegment = progressBarSegments[index];

            if (isInViewport) {
                progressBarSegment.classList.add('active');
            } else {
                progressBarSegment.classList.remove('active');
            }
        }, observerOptions);

        observer.observe(sectionObserver);
    });
});
