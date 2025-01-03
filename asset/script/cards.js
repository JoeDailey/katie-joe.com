createDiscardStyles();

const deck = document.getElementById("deck");
const base = deck.getElementsByClassName("base")[0];
const seen = new Set();

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

  const seenCards = {};
  // index is the paint order not open order so its reversed
  for (i = 0; i < 12; i++) {
    const id = Math.floor(Math.random() * 18) + 1;
    if (id === 18 && i > 11) {
      --i; // No wildcard early
      continue;
    }

    if (id === 18 && id !== 1 && Math.random() > 0.5) {
      --i; // wildcard 1.4% chance except for last card
      continue;
    }

    const numOfId = seenCards[id] ?? 0;
    if (numOfId >= 3) {
      --i; // not too many of each
      continue;
    }

    seen.add(id);
    seenCards[id] = numOfId + 1;
    setTimeout(() => deck.appendChild(createCard(id, i)), 20 * i);
  }

  setTimeout(() => base.classList.remove("empty"), 1000);

  const discards = [...deck.querySelectorAll(".card[state=discarded]")];
  if (discards.length > 32) {
    discards.slice(0, 32).forEach((c) => c.remove());
  }
}

function createCard(id, i) {
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

  card.addEventListener("click", handleClick.bind(card));
  card.addEventListener("mousemove", handleHover.bind(card));
  card.addEventListener("mouseleave", handleReleaseHover.bind(card));
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
      break;
    }
  }

  card.setAttribute("state", state);
  if (cards().every((c) => is(c, "held", "holding", "discarded"))) {
    spawnPack();
  }
}

function handleClick(e) {
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

// Preload (and hold) all the images because they do not
// start (or stay) part of the DOM before and while opening packs.
const images = [];
setTimeout(() => {
  function img(src) {
    const image = new Image();
    image.onerror = console.error;
    image.src = src;
    return image;
  }

  images.push(img(`asset/cards/pack-1.png`));
  images.push(img(`asset/cards/pack-2.png`));
  images.push(img(`asset/cards/back-destination.png`));
  images.push(img(`asset/cards/back-moment.png`));
  images.push(img(`asset/cards/back-wildcard.png`));
  for (var i = 1; i <= 18; i++) {
    images.push(img(`asset/cards/face-${i}.png`));
  }
}, 500);
