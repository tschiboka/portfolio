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
    [...tech.children].forEach(img => img.classList.add("wobble"));
  } else {
    [...tech.children].forEach(img => img.classList.remove("wobble"));
  } // end of if tech
} // end of animateWhenInView

/*
 * Click event listener for the projects
 * The event is delegated to the individual projects
 * by watching event bubbling up
 */

projectsListener();

function projectsListener() {
  const projects = document.querySelector(".projects");

  // use only one eventlistener
  projects.addEventListener("click", function(event) {
    let target = event.target;

    // target may be the div of text or the description div
    // so let the target always be the text div with individual id
    if (target.classList.contains("projects__description")) {
      // skip text node
      target =
        target.firstChild.nodeType === 3 // if textNode
          ? target.firstChild.nextSibling // check sibling
          : target.firstChild; // else firstChild
    } // end of if target is not the text div but descreption wrapper behing

    switch (target.id) {
      case "crayons": {
        window.open("projects/crayons/crayons.html");
        break;
      }
      case "fruits": {
        window.open("projects/fruits/match_three.html");
        break;
      }
      case "pomodoro": {
        window.open("projects/pomodoro/pomodoro.html");
        break;
      }
      case "simon": {
        window.open("projects/simon/simon.html");
        break;
      }
      case "calculator": {
        window.open("projects/calculator/calculator.html");
        break;
      }
      case "tic-tac-toe": {
        window.open("projects/tictactoe/tictactoe.html");
        break;
      }
    } // end of swith
  }); // end of eventListener
} // end of projectsListener

/*
 * Animate header gradient color with js, I couldn't find a good
 * implementation in css, so our best friend js to the rescue!
 * Function returns it's timer so it can be cleared if not in view.
 */

animateHeaderBgColor(document.querySelector(".header__bg"));

function animateHeaderBgColor(header) {
  function setGradient(color1, color2) {
    header.style.background = `-webkit-gradient(linear, left top, right top, from(${color1}), to(${color2}))`;
    header.style.background = `linear-gradient(90deg, ${color1}, ${color2})`;
    // changing background to gradient seems to overwrite background
    // clip to different values thus it needs to be set in every single iteration
    header.style.backgroundClip = "text";
    header.style.webkitBackgroundClip = "text";
  } // end of setGradient

  let i = 0,
    direction = "up", // i is increasing or decreasing
    blend1 = [
      "rgb(137,248,252)",
      "rgb(148,230,248)",
      "rgb(158,212,243)",
      "rgb(169,194,239)",
      "rgb(180,176,235)",
      "rgb(191,158,230)",
      "rgb(201,141,226)",
      "rgb(212,123,221)",
      "rgb(223,105,217)",
      "rgb(234,87,213)",
      "rgb(244,69,208)",
      "rgb(255,51,204)"
    ],
    blend2 = [
      "rgb(110,255,175)",
      "rgb(123,255,173)",
      "rgb(136,255,171)",
      "rgb(150,255,169)",
      "rgb(163,255,167)",
      "rgb(176,255,165)",
      "rgb(189,255,163)",
      "rgb(202,255,161)",
      "rgb(215,255,159)",
      "rgb(229,255,157)",
      "rgb(242,255,155)",
      "rgb(255,255,153)"
    ];

  const timer = setInterval(() => {
    // set i to wave
    if (i === 11) {
      direction = "down";
    }
    if (i === 0) {
      direction = "up";
    }
    direction === "up" ? i++ : i--;

    setGradient(blend1[i], blend2[i]);
  }, 100); // end of timer
} // end of animateHeaderBgColor
