export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.distance = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
      movePosition: 0,
    };
  }

  updatePosition(clientX) {
    const MOVEMENT_MULTIPLIER = 1.6;
    this.distance.movement =
      (this.distance.startX - clientX) * MOVEMENT_MULTIPLIER;
    return this.distance.finalPosition - this.distance.movement;
  }

  moveSlide(distanceX) {
    this.distance.movePosition = distanceX;
    this.slide.style.transform = `translate3d(${distanceX}px, 0, 0)`;
  }

  onStart(event) {
    let moveType;

    if (event.type === "mousedown") {
      event.preventDefault();
      this.distance.startX = event.clientX;
      moveType = "mousemove";
    } else {
      this.distance.startX = event.changedTouches[0].clientX;
      moveType = "touchmove";
    }
    this.wrapper.addEventListener(moveType, this.onMove);
  }

  onMove(event) {
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const moveType = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(moveType, this.onMove);
    this.distance.finalPosition = this.distance.movePosition;
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  calculateSlidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return (slide.offsetLeft - margin) * -1;
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.calculateSlidePosition(element);

      return {
        position,
        element,
      };
    });
  }

  slidesIndexNav(index) {
    const lastIndex = this.slideArray.length - 1;
    this.index = {
      previous: index ? index + 1 : null,
      active: index,
      next: index === lastIndex ? null : index + 1,
    };
  }

  changeCurrentSlide(index) {
    const activeSlide = this.slideArray[index];

    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.distance.finalPosition = activeSlide.position;
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    this.slidesConfig();
    return this;
  }
}
