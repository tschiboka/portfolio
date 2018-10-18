/*
 * Give animation for vinyl arm, because face__img is not a sibling or a child
 * of it therefore I couldn't write a good hover selector for it
 */

vinylArmAnimate();

function vinylArmAnimate() {
  const face = document.getElementsByClassName("header__face__img")[0],
    arm = document.getElementsByClassName("vinyl-arm")[0];
  let timer;
  face.addEventListener("mouseover", () => {
    clearTimeout(timer);
    // set visibility
    arm.style.visibility = "visible";

    // give arm animation
    arm.style.animationName = "vinyl-arm-in";
    arm.style.webkitAnimationDuration = "2s";
    arm.style.webkitAnimationName = "vinyl-arm-in";
    arm.style.animationDuration = "2s";

    // give it rotation so it'll stay when animation is over
    arm.style.webkitTransform = "rotate(25deg)";
    arm.style.mozTransform = "rotate(25deg)";
    arm.style.msTransform = "rotate(25deg)";
    arm.style.oTransform = "rotate(25deg)";
    arm.style.transform = "rotate(25deg)";
  });

  face.addEventListener("mouseout", () => {
    // give arm animation
    arm.style.animationName = "vinyl-arm-out";
    arm.style.webkitAnimationDuration = "2s";
    arm.style.webkitAnimationName = "vinyl-arm-out";
    arm.style.animationDuration = "2s";

    // give it rotation so it'll stay when animation is over
    arm.style.webkitTransform = "rotate(0deg)";
    arm.style.mozTransform = "rotate(0deg)";
    arm.style.msTransform = "rotate(0deg)";
    arm.style.oTransform = "rotate(0deg)";
    arm.style.transform = "rotate(0deg)";
    timer = setTimeout(() => {
      arm.style.visibility = "hidden";
    }, 2500);
  });
} // end of vinylArmAnimate

/*
 * SCROLL LISTENER
 */

window.addEventListener("scroll", () => {
  listenActiveSection();
  animateWhenInView();
}); // end of scrollListener

/*
 * Navigation bar highlights when the corrisponding section is in view 
 */

function listenActiveSection() {
  // function runs only on bigger screen sizes
  if (window.innerWidth < 700) return void 0;

  const header = document.querySelector("header"),
    about = document.querySelector(".about"),
    projects = document.querySelector(".projects"),
    contact = document.querySelector(".contact"),
    sectors = [header, about, projects, contact];

  function activateNav(el) {
    const list = document.querySelectorAll("nav li:not(:last-child) a");

    // remove all classes
    list.forEach(e => {
      e.classList.remove("active");
    });

    // select active item by its index in the array
    list[sectors.findIndex(e => e === el)].classList.add("active");
  } // end of paintActiveNavLi

  const active = sectors
    // section is active until reaches its 2/3
    .map(e => {
      const rect = e.getBoundingClientRect();
      return [e, rect.bottom - rect.height / 3];
    }) // end of map
    // weed out hte ones that 2/3 is minus and get the first item
    .filter(e => e[1] > 0)[0][0];

  activateNav(active);
} // end of listenActiveSection

/*
 * Spare some computation cost by animating elements only when 
 * they are in viewport
 */

function animateWhenInView() {
  // return true if at least half of the element is visible
  function isInView(elem) {
    const rect = elem.getBoundingClientRect(),
      center = rect.bottom - rect.height / 2;

    return (
      center >= 0 &&
      center <= (window.innerHeight || document.documentElement.clientHeight)
    );
  } // end of isInView

  const heart = document.querySelector(".love"),
    tech = document.querySelector(".technologies");

  if (isInView(heart)) {
    heart.classList.add("throbbing");
  } else {
    heart.classList.remove("throbbing");
  } // end of if heart

  if (isInView(tech)) {
    tech.classList.add("open-tech");
  } // end of if tech
} // end of animateWhenInView
