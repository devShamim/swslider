(function(){
  const swSlider = (selector, options={}) =>{
    options={
      autoPlay: true,
      autoPlayType: 'normal', //'marquee'
      autoPlaySpeed: 2000,
      autoPlayTimeout: 3000,
      autoPlayHoverPause: false,
      loop: true,
      items: 5,
      gutter: 15,
      slideBy: 1, //'page'
      nav: true,
      dots: true,
    }

    const carousel = document.querySelector(selector);
    const carouselContent = carousel.querySelector('.swcarousel__content');
    let slides = carousel.querySelectorAll('.swcarousel__slide');
    let arrayOfSlides = Array.prototype.slice.call(slides);
    const carouselNav = carousel.querySelector('.swcarousel__nav');
    const carouselBullets = carousel.querySelector('.swcarousel__bullets');
    var rightNav = document.querySelector('.swcarousel__nav--right');
    var leftNav = document.querySelector('.swcarousel__nav--left');
    let lengthOfSlide;

    //set slider height to largest element height
    window.addEventListener('load', ()=>{
      setScreenSize();
      const slidesHeight = [];
      slides.forEach((elm, id)=>{
        slidesHeight.push(elm.querySelector('.swcarousel__slide__content').clientHeight);
      })
      carousel.style.height = Math.max(...slidesHeight) + "px";
    })

    //slider nav
    if(!options.nav){
      carouselNav.remove();
    }

    //slider dots
    if(options.dots){
      const totalDots = Math.ceil(slides.length / options.items);
      if(totalDots !== 1){
          for(let i = 0; i < totalDots; i++){
              const span = document.createElement('span');
              span.classList.add("swcarousel__bullet");
              carouselBullets.appendChild(span);
          }
      }
    }else{
      carouselBullets.remove();
    }

    //get root elements
    const rootElement = document.querySelector(':root');
    rootElement.style.setProperty('--gutter', options.gutter + "px");

    //show slides
    function showSlides() {
      var slides = document.querySelectorAll('.swcarousel__slide');
      var slidesArray = Array.prototype.slice.call(slides);
      lengthOfSlide = ( carouselContent.offsetWidth  / options.items );
      var initialWidth = -lengthOfSlide;
      slidesArray.forEach(function(el) {
        el.style.width = lengthOfSlide + "px";
        el.style.left = initialWidth + "px";
        initialWidth += lengthOfSlide;
      });
    }

    function setScreenSize() {
      if(window.innerWidth >= 1199){
        options.items;
      } else if ( window.innerWidth >= 991 ) {
        options.items = 5;
      } else if ( window.innerWidth >= 767 ) {
        options.items = 3;
      } else {
        options.items = 1;
      }
      showSlides();
    }

    window.addEventListener('resize', setScreenSize);

    //add clone
    function addClone() {
      var lastSlide = carouselContent.lastElementChild.cloneNode(true);
      lastSlide.style.left = (-lengthOfSlide) + "px";
      carouselContent.insertBefore(lastSlide, carouselContent.firstChild);
    }

    //remove clone
    function removeClone() {
      var firstSlide = carouselContent.firstElementChild;
      firstSlide.parentNode.removeChild(firstSlide);
    }

    //move slides
    function moveSlidesRight() {
      var slides = document.querySelectorAll('.swcarousel__slide');
      var slidesArray = Array.prototype.slice.call(slides);
      var width = 0;

      slidesArray.forEach(function(el, i){
        el.style.left = width + "px";
        width += lengthOfSlide;
      });
      addClone();
    }
    moveSlidesRight();

    var moving = true;
    function moveRight(e) {
      e.preventDefault();

      if ( moving ) {
        moving = false;
        var lastSlide = carouselContent.lastElementChild;
        lastSlide.parentNode.removeChild(lastSlide);
        carouselContent.insertBefore(lastSlide, carouselContent.firstChild);
        removeClone();
        var firstSlide = carouselContent.firstElementChild;
        firstSlide.addEventListener('transitionend', activateAgain);
        moveSlidesRight();
      }
    }

    function activateAgain() {
      var firstSlide = carouselContent.firstElementChild;
      moving = true;
      firstSlide.removeEventListener('transitionend', activateAgain);
    }
    leftNav.addEventListener('click', moveRight);

    function moveSlidesLeft() {
      var slides = document.querySelectorAll('.swcarousel__slide');
      var slidesArray = Array.prototype.slice.call(slides);
      slidesArray = slidesArray.reverse();
      var maxWidth = (slidesArray.length - 1) * lengthOfSlide;

      slidesArray.forEach(function(el, i){
        maxWidth -= lengthOfSlide;
        el.style.left = maxWidth + "px";
      });
    }

    function moveLeft(e) {
      e.preventDefault();

      if ( moving ) {
        moving = false;
        removeClone();
        var firstSlide = carouselContent.firstElementChild;
        firstSlide.addEventListener('transitionend', replaceToEnd);
        moveSlidesLeft();
      }
    }
    rightNav.addEventListener('click', moveLeft);

    function replaceToEnd() {
      var firstSlide = carouselContent.firstElementChild;
      firstSlide.parentNode.removeChild(firstSlide);
      carouselContent.appendChild(firstSlide);
      firstSlide.style.left = ( (arrayOfSlides.length -1) * lengthOfSlide) + "px";
      addClone();
      moving = true;
      firstSlide.removeEventListener('transitionend', replaceToEnd);
    }

  }

  swSlider('.swcarousel--one');
})()