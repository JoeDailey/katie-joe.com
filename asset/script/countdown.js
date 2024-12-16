const countdown = document.getElementById('countdown');
const till = new Date("May 17, 2025 16:00:00").getTime();
function getTimeRemaining() {
    const now = new Date().getTime();
    return till - now;
}

const unit = {
    days: [document.querySelector('.digit[day="0"]'), document.querySelector('.digit[day="1"]'), document.querySelector('.digit[day="2"]')],
    hours: [document.querySelector('.digit[hour="0"]'), document.querySelector('.digit[hour="1"]')],
    minutes: [document.querySelector('.digit[min="0"]'), document.querySelector('.digit[min="1"]')],
    seconds: [document.querySelector('.digit[sec="0"]'), document.querySelector('.digit[sec="1"]')],
};

function apply(time, part) {
    const digits = String(time).padStart(part.length, "0").split('');
    let visible = false;
    for (let i = 0; i < digits.length; i++) {
        if (visible || digits[i] !== '0') {
            visible = true;
        }
        if (part[i].innerHTML === digits[i]) {
            continue;
        }

        part[i].classList.add('tick');
        part[i].innerHTML = digits[i];
        setTimeout(() => part[i].classList.remove('tick'), 800);
    }
}

const tick = setInterval(() => {
    const remainder = getTimeRemaining();
    apply(Math.floor(remainder / (1000 * 60 * 60 * 24)), unit.days);
    apply(Math.floor((remainder % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), unit.hours);
    apply(Math.floor((remainder % (1000 * 60 * 60)) / (1000 * 60)), unit.minutes);
    apply(Math.floor((remainder % (1000 * 60)) / 1000), unit.seconds);
}, 200);

setTimeout(() => {
    if (getTimeRemaining() <= 0) {
        clearInterval(tick);
        countdown.remove();
        return;
    }

    countdown.classList.remove('hidden');
    setTimeout(() => {

    }, 1000);
}, 1000);