createDiscardStyles();

const deck = document.getElementById("deck");
const base = deck.getElementsByClassName("base")[0];
const seen = new Set();

const flipSFX = new Audio("asset/sound/card-flip.mp3");
const shuffleSFX = new Audio("asset/sound/card-shuffle.mp3");
const openSFX = new Audio("asset/sound/open-pack.mp3");
const yaySFX = new Audio("asset/sound/yay.m4a");

spawnPack("start");

function spawnPack(phase) {
  let pack = deck.getElementsByClassName("pack");
  if ([...pack].length > 0) {
    return;
  }

  pack = document.createElement("div");
  pack.classList.add("pack");
  if (phase === "start") {
    pack.classList.add("start");
    pack.setAttribute("state", "holding");
    pack.innerHTML = `
            <img src="asset/cards/pack-1.png" />
            <div class="glimmer"></div>
            <svg viewBox="0 0 100 18">
                <text text-anchor="middle" x="50" y="18" fill="#faf5ddff">Open Me</text>
            </svg>
        `;
    deck.insertBefore(pack, base.nextSibling);
  } else {
    const id = Math.ceil(Math.random() * 2);
    pack.setAttribute("state", "spawned");
    pack.innerHTML = `
            <img src="asset/cards/pack-${id}.png" />
            <div class="glimmer"></div>
            <svg viewBox="0 0 100 18">
                <text text-anchor="middle" x="50" y="18" fill="#faf5ddff">${seen.size} of 18 Found</text>
            </svg>
        `;
    deck.insertBefore(pack, base.nextSibling);
    setTimeout(() => pack.setAttribute("state", "holding"), 100);
  }

  pack.transform = function (rX, rY) {
    pack.style.transform = `rotateX(${rX}deg) rotateY(${rY}deg)`;
  };

  pack.addEventListener("mousemove", handleHover.bind(pack));
  pack.addEventListener("mouseleave", handleReleaseHover.bind(pack));
  pack.addEventListener("click", () => {
    pack.style.transform = "";
    pack.setAttribute("state", "unwrapped");
    openPack();
    setTimeout(() => pack.remove(), 1000);
  });
}

function openPack() {
  cards().forEach((c) => now(c, "discarded"));
  openSFX.play();

  // remove discard from the bottom of the pile to free up resources
  const discards = [...deck.querySelectorAll(".card[state=discarded]")];
  if (discards.length > 18) {
    discards.slice(0, 18).forEach((c) => c.remove());
  }

  const allowWildcard = seen.size >= 17;
  const upperLimit = allowWildcard ? 18 : 17;

  const seenCards = {};
  for (i = 0; i < 12; i++) {
    const id = Math.floor(Math.random() * upperLimit) + 1;
    // index is the paint order (not open order) so its reversed
    if (id === 18 && i > 9) {
      --i; // No wildcard early
      continue;
    }

    const numOfId = seenCards[id] ?? 0;
    if (numOfId >= 2 || (id === 18 && numOfId >= 1)) {
      --i; // not too many of each
      continue;
    }

    seen.add(id);
    seenCards[id] = numOfId + 1;
    setTimeout(() => deck.appendChild(createCard(id, i)), 20 * i);
  }

  setTimeout(() => base.classList.remove("empty"), 1000);
}

function createCard(id, i) {
  if (i === 12) {
    setTimeout(() => shuffleSFX.play(), 700);
  }

  let type = "moment";
  if (id > 9) type = "destination";
  if (id === 18) type = "wildcard";

  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
      <div class="card-front">
          <img src="asset/cards/face-${id}.png" />
          <div class="glimmer"></div>
      </div>
      <div class="card-back">
          <img src="asset/cards/back-${type}.png" />
      </div>
  `;

  card.transform = function (rX, rY) {
    card.style.transform = `scale(1.3) rotateX(${rX}deg) rotateY(${
      180 + rY
    }deg)`;
  };

  // record the listeners so they can be removed on discard
  const frees = [];
  function listen(event, fn) {
    card.addEventListener(event, fn);
    frees.push(() => card.removeEventListener(event, fn));
  }

  listen("click", handleClick.bind(card));
  listen("mousemove", handleHover.bind(card));
  listen("mouseleave", handleReleaseHover.bind(card));
  if (id === 18) {
    listen("click", celebrate.bind(card));
  }

  // Remove event listeners once discard to free up resources
  listen("discard", () => frees.forEach((f) => f()));

  return card;
}

function is(card, ...checks) {
  const state = card.getAttribute("state") ?? "none";
  for (const check of checks) {
    if (state === check) {
      return true;
    }
  }

  return false;
}

function cards() {
  return [...deck.getElementsByClassName("card")];
}

function now(card, state) {
  if (is(card, "discarded")) {
    return;
  }

  switch (state) {
    case "held": {
      flipSFX.playbackRate = Math.random() * 2 + 1;
      flipSFX.play();
      cards().forEach((c) => is(c, "held", "holding") && now(c, "discarded"));
      if (cards().filter((c) => is(c, "none")).length <= 1) {
        base.classList.add("empty");
      }
      if (card !== card.parentNode.lastChild) {
        card.parentNode.append(card);
      }
      setTimeout(() => now(card, "holding"), 600);
      break;
    }

    case "discarded": {
      do {
        var discardI = Math.floor(10 * Math.random());
      } while (card.parentNode.lastChild.getAttribute("discard") == discardI);
      card.setAttribute("discard", discardI);
      card.dispatchEvent(new Event("discard"));
      break;
    }
  }

  card.setAttribute("state", state);
  if (cards().every((c) => is(c, "held", "holding", "discarded"))) {
    spawnPack();
  }
}

function handleClick(e) {
  console.log("click");
  if (is(this, "none")) {
    now(this, "held");
    return;
  }

  if (is(this, "held", "holding")) {
    now(this, "discarded");
    return;
  }
}

function handleHover(e) {
  if (!is(this, "holding")) {
    return;
  }

  const rect = this.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rectX = e.clientX - rect.left;
  const rectY = e.clientY - rect.top;
  const distanceX = rectX - centerX;
  const distanceY = rectY - centerY;

  const rotateX = distanceY * 0.1;
  const rotateY = distanceX * -0.2;
  this.style.transform = this.transform(rotateX, rotateY);

  const glimmerX = (rectX / rect.width) * 100;
  const glimmerY = (rectY / rect.height) * 100;
  const glimmer = this.querySelector(".glimmer");
  glimmer.style.background = `radial-gradient(circle at ${glimmerX}% ${glimmerY}%, #faf5dd33 20%, #faf5dd00 100%)`;
  glimmer.style.opacity = "1.0";
}

function handleReleaseHover() {
  this.style.transform = ``;
  const glimmer = this.querySelector(".glimmer");
  glimmer.style.opacity = ""; // dont remove background (not transitionable)
}

function createDiscardStyles() {
  const style = document.createElement("style");
  function calc(base, value, unit) {
    return `calc(var(${base}) ${value < 0 ? "-" : "+"} ${Math.abs(
      value
    )}${unit})`;
  }

  for (i = 0; i < 10; i++) {
    const rotate = Math.floor(100 * Math.random()) - 50;
    const shiftX = Math.floor(4 * Math.random()) - 2;
    const shiftY = Math.floor(4 * Math.random()) - 2;
    style.innerHTML += `
            @keyframes discarded${i} {
                0% {
                    top: var(--held-top);
                    left: var(--held-left);
                    transform: scale(1.3) rotateY(180deg);
                }
                
                100% {
                    top:  ${calc("--discard-top", shiftY, "%")};
                    left: ${calc("--discard-left", shiftX, "%")};
                    transform: scale(1) rotateY(180deg) rotateZ(${rotate}deg);
                }
            }

            .card[state="discarded"][discard="${i}"] {
                animation-name: discarded${i};
                animation-duration: .2s;
            }
        `;
  }
  document.head.appendChild(style);
}

setTimeout(async () => {
  // Add these hidden images to the DOM early so they are download
  // before someone starts interacting with the cards.
  const div = document.createElement("div");
  div.style.width = 0;
  div.style.height = 0;
  div.style.overflow = "hidden";
  div.innerHTML = `
    <img src="asset/cards/back-destination.png"></img>
    <img src="asset/cards/back-moment.png"></img>
    <img src="asset/cards/back-wildcard.png"></img>
    <img src="asset/cards/face-1.png"></img>
    <img src="asset/cards/face-10.png"></img>
    <img src="asset/cards/face-11.png"></img>
    <img src="asset/cards/face-12.png"></img>
    <img src="asset/cards/face-13.png"></img>
    <img src="asset/cards/face-14.png"></img>
    <img src="asset/cards/face-15.png"></img>
    <img src="asset/cards/face-16.png"></img>
    <img src="asset/cards/face-17.png"></img>
    <img src="asset/cards/face-18.png"></img>
    <img src="asset/cards/face-2.png"></img>
    <img src="asset/cards/face-3.png"></img>
    <img src="asset/cards/face-4.png"></img>
    <img src="asset/cards/face-5.png"></img>
    <img src="asset/cards/face-6.png"></img>
    <img src="asset/cards/face-7.png"></img>
    <img src="asset/cards/face-8.png"></img>
    <img src="asset/cards/face-9.png"></img>
    <img src="asset/cards/pack-1.png"></img>
    <img src="asset/cards/pack-2.png"></img>
  `;
  document.body.append(div);
}, 1000);

function celebrate() {
  yaySFX.play();
  document.documentElement.style.setProperty(
    "--bg-gradient",
    `
    radial-gradient(at 30% 22%, hsla(2,83%,73%,1) 0px, transparent 50%),
    radial-gradient(at 4% 95%, hsla(287,88%,67%,1) 0px, transparent 50%),
    radial-gradient(at 0% 0%, hsla(339,100%,80%,1) 0px, transparent 50%),
    radial-gradient(at 93% 13%, hsla(287,87%,67%,1) 0px, transparent 50%),
    radial-gradient(at 80% 76%, hsla(180,55%,53%,1) 0px, transparent 50%)
  `
  );

  const celebrate = (elements) =>
    [...elements].forEach((e) => e.classList.add("celebrating"));

  celebrate([document.body]);
  celebrate(document.querySelectorAll("section a"));
  celebrate(document.querySelectorAll("section a:after"));
  celebrate(document.querySelectorAll(".gradient-clip"));
  celebrate(document.querySelectorAll(".next"));
  celebrate(document.querySelectorAll(".next:after"));
}
