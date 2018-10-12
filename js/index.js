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
 * Add scroll listener, so navbar can be sticky even if it's absolute.
 * Thus i'll write my own stycky navbar.
 */

/*listenScroll();

function listenScroll() {
  const body = document.getElementsByTagName("body")[0];
  //if () {}
  window.addEventListener("scroll", () => {
    const navlist = document.querySelector("nav ul"),
      navlistTop = navlist.getBoundingClientRect().top,
      burger = document.querySelector(".nav__burger"),
      bodyTop = body.getBoundingClientRect().top;

    if (navlistTop < 0) {
      navlist.style.top = `${Math.abs(bodyTop)}px`;
      navlist.style.zIndex = "9999";
    }

    console.log("SCROLLIN", burger);
  });
}*/
