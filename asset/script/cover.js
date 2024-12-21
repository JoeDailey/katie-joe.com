const title = document.querySelector(".title>h1");
const subtitle = document.querySelector(".title>p");
let frame;
document.querySelector(".container").addEventListener(
  "scroll",
  (params) => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (params.target.scrollTop >= window.innerHeight / 4) {
        title.classList.add("scrolled");
        subtitle.classList.add("scrolled");
      } else {
        title.classList.remove("scrolled");
        subtitle.classList.remove("scrolled");
      }
    });
  },
  { passive: true }
);
