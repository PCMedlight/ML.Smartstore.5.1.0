Vue.component('card-container', {
    template: `
        <div>
            <div class="card-container d-flex flex-nowrap" ref="cardContainer"
                @mousedown="startDragging" @mouseup="stopDragging"
                @mousemove="handleMouseMove" @mouseleave="stopDragging"
                @scroll="updatePaginationIndicator">
            <slot></slot>
            </div>
            <div class="paginationContainer rounded my-1 mx-auto">
            <div class="indicator rounded "></div>
            </div>
        </div>
   
    `,
    props: {
        cardIndex: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            mouseTracker: 0,
            cardContainer: null,
            selectedCard: this.cardIndex,
            isDragging: false,
            startX: 0,
            startY: 0,
            scrollLeft: 0,
            cards: [],
            inputs: [],
            isTouchDevice: ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)
        };
    },
    /////// mounting ////////
    mounted() {
        const cards = this.$el.querySelectorAll('.card');
        cards.forEach((card, index) => {
            this.cards.push(card);

            card.addEventListener('mousedown', (e) => {
                this.handleCardMousedown(e, index);
            });

            card.addEventListener('mouseup', (e) => {
                this.handleCardMouseup(e, index);
            });

            card.addEventListener('mousemove', (e) => {
                this.handleCardMousemove(e, index);
            });

        });

        this.cardContainer = this.$el.querySelector('.card-container');
        if (this.cardIndex !== null) {
            this.$nextTick(() => {
                this.selectCard(this.cardIndex);
            });
        };

        this.generateInputsAndLabels(this.cards);
    },
    /////// methods ////////
    methods: {


        handleCardMousedown(e, index) {
            this.mouseTracker = 0;
        },

        handleCardMouseup(e, index) {
            if (this.mouseTracker < 200) {
                this.selectCard(index);
            };
        },

        handleCardMousemove(e, index) {
            this.$nextTick(() => {
                if (this.isDragging) {
                    this.mouseTracker += Math.abs(e.clientX - this.startX)
                    this.mouseTracker += Math.abs(e.clientY - this.startY)
                    console.log(this.mouseTracker);
                }
            });
        },


        generateInputsAndLabels(cards) {
            cards.forEach((card, index) => {
                const cardTitle = card.querySelector('.card-title').textContent;
                // Create the input element
                const input = document.createElement('input');
                input.name = 'radioGroup_' + (this.$el.parentElement.id);;
                input.type = 'radio';
                input.id = `radio-${index}`;
                input.classList.add('d-none');
                input.setAttribute('aria-hidden', 'true');
                input.value = cardTitle;

                // Create the label element
                const label = document.createElement('label');
                label.htmlFor = `cardCheckbox_${index}`;
                label.textContent = `Select ${cardTitle}`;
                label.classList.add('d-none');
                label.setAttribute('aria-hidden', 'true');
                this.inputs.push(input);
                // Append input and label to the card
                card.prepend(input);
                card.prepend(label);
            });
        },

        startDragging(e) {
            if (!this.isTouchDevice) {
                this.isDragging = true;
                this.startX = e.clientX;
                this.startY = e.clientY;
                this.scrollLeft = this.cardContainer.scrollLeft;
            }
        },

        stopDragging() {
            this.isDragging = false;
        },

        handleMouseMove(e) {
            if (!this.isTouchDevice && this.isDragging) {
                e.preventDefault();
                const x = e.pageX - this.cardContainer.getBoundingClientRect().left;
                const scroll = x - this.startX;
                this.cardContainer.scrollLeft = this.scrollLeft - scroll;
            }
        },

        scrollSelectedCardIntoView(cardIndex) {
            this.$nextTick(() => {
                const selectedCardElement = this.cardContainer.querySelector('.card.selected');

                if (selectedCardElement) {
                    const slidesArray = Array.from(this.cards);
                    // Calculate the total width of all slides, including margins
                    const slideWidths = Array.from(slidesArray).map(slide => {
                        const styles = getComputedStyle(slide);
                        const marginLeft = parseFloat(styles.marginLeft);
                        const marginRight = parseFloat(styles.marginRight);
                        return slide.offsetWidth + marginLeft + marginRight;
                    });

                    // Calculate the width of the container
                    const containerWidth = this.cardContainer.clientWidth;

                    // Calculate the scroll position to center the slide content in the slider
                    const precedingSlideWidths = slideWidths.slice(0, cardIndex).reduce((sum, width) => sum + width, 0);
                    const slideWidth = slideWidths[cardIndex];
                    const scrollPosition = precedingSlideWidths - (containerWidth - slideWidth) / 2;

                    this.cardContainer.scrollTo({
                        left: scrollPosition,
                        behavior: 'smooth'
                    });
                }
            });
        },

        updatePaginationIndicator() {
            this.$nextTick(() => {
                const scrollPosition = this.cardContainer.scrollLeft;
                const indicator = this.$el.parentElement.querySelector('.indicator');
                const maxScroll = this.cardContainer.scrollWidth - this.cardContainer.clientWidth;
                const maxIndicatorPosition = 100 - (indicator.offsetWidth / indicator.parentElement.offsetWidth) * 100;
                const indicatorPosition = (scrollPosition / maxScroll) * maxIndicatorPosition;
                const finalIndicatorPosition = Math.min(indicatorPosition, maxIndicatorPosition);
                indicator.style.left = `${finalIndicatorPosition}%`;
            });
        },


        selectCard(cardIndex) {
            const cards = this.$el.querySelectorAll('.card');

            cards.forEach((card, index) => {
                if (index === cardIndex) {
                    this.cardIndex = index;
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });
            this.inputs[cardIndex].checked = true;
            this.scrollSelectedCardIntoView(this.cardIndex);
        }
    }
});


