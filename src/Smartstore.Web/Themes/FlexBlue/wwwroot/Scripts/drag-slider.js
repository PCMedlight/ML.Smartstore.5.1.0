class SlideContainer {
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.scrollingWrapper = this.containerElement.querySelector('.w-scrolling-wrapper');
        this.slides = this.containerElement.querySelectorAll('.slide');
        this.paginationContainer = this.containerElement.querySelector('.paginationContainer');
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

        this.scrollingWrapper.isDragging = false;
        this.scrollingWrapper.startX = 0;
        this.scrollingWrapper.scrollLeft = 0;

        this.startDragging = this.startDragging.bind(this);
        this.stopDragging = this.stopDragging.bind(this);
        this.updatePaginationIndicator = this.updatePaginationIndicator.bind(this);

        if (!isTouchDevice) {
            this.scrollingWrapper.addEventListener('mousedown', this.startDragging, false);
            this.scrollingWrapper.addEventListener('mouseup', this.stopDragging, false);
            this.scrollingWrapper.addEventListener('mouseleave', this.stopDragging, false);        
            this.scrollingWrapper.addEventListener('mousemove', this.handleMouseMove.bind(this));
        }
        this.scrollingWrapper.addEventListener('scroll', this.updatePaginationIndicator);

        // Add click event listener to each slide
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                this.scrolltoSlide(index);
            });
        });

        // Scroll to checked input on start
        this.slides.forEach((slide, index) => {
            const input = slide.querySelector('input[type="radio"]');
            if (input && input.checked) {
                this.scrolltoSlide(index);
            }
        });
    }

    startDragging(e) {
        this.isDragging = true;
        this.startX = e.clientX - this.scrollingWrapper.getBoundingClientRect().left;
        this.scrollLeft = this.scrollingWrapper.scrollLeft;
    }

    stopDragging() {
        this.isDragging = false;
    }

    handleMouseMove(e) {
        e.preventDefault();
        if (!this.isDragging) return;
        const x = e.pageX - this.scrollingWrapper.getBoundingClientRect().left;
        const scroll = x - this.startX;
        this.scrollingWrapper.scrollLeft = this.scrollLeft - scroll;
    }

    updatePaginationIndicator() {
        const scrollPosition = this.scrollingWrapper.scrollLeft;
        const indicator = this.paginationContainer.querySelector('.indicator');
        const maxScroll = this.scrollingWrapper.scrollWidth - this.scrollingWrapper.clientWidth;
        const maxIndicatorPosition = 100 - (indicator.offsetWidth / indicator.parentElement.offsetWidth) * 100;
        const indicatorPosition = (scrollPosition / maxScroll) * maxIndicatorPosition;
        const finalIndicatorPosition = Math.min(indicatorPosition, maxIndicatorPosition);
        indicator.style.left = `${finalIndicatorPosition}%`;
    }

    scrolltoSlide(slideIndex) {
        const slidesArray = Array.from(this.slides);
        // Calculate the total width of all slides
        const slideWidths = Array.from(slidesArray).map(slide => slide.offsetWidth);
        const slideToScroll = slideIndex; // Index of the slide to scroll to
        // Calculate the scroll position to center the slide content in the slider
        const scrollPosition = slideWidths.slice(0, slideToScroll).reduce((sum, width) => sum + width, 0) - (this.scrollingWrapper.clientWidth - slideWidths[slideToScroll]) / 2;
        // Scroll to the desired position smoothly
        this.scrollingWrapper.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const containerElements = document.querySelectorAll('.radio-slider');

    containerElements.forEach(containerElement => {
        const slideContainer = new SlideContainer(containerElement);

        // Note: The additional event listeners in the external code have been removed

    });
});


