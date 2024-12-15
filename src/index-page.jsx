import { Page } from '@nakedjsx/core/page'
import { Cover } from './cover'

Page.Create('en');
Page.AppendHead(<title>Katie and Joe's Wedding</title>);
Page.AppendHead(<meta charset="UTF-8"></meta>);
Page.AppendHead(<meta name="viewport" content="width=device-width, initial-scale=1"></meta>);
Page.AppendBody(
    <Container Page={Page}>
    <div class="container">
        <Cover />
        <section id="welcome">
            <div class="background gradient-clip">
                <div class="inset">
                    <div>
                        <h1>La Jolla, California</h1>
                        <h2>Saturday, May 17, 2025</h2>
                    </div>
                    <a id="rsvp" class="gradient-clip" href="https://withjoy.com/joe-and-katie-may-25/rsvp"
                        target="_blank">
                        <span>
                            <span class="gradient-clip">
                                RSVP
                            </span>
                        </span>
                    </a>
                    <p>
                        Our love story began in Seattle in the summer of 2018 when Katie, a bright-eyed intern, joined
                        my team. It didn’t take long to realize there was more than just workplace synergy between us.
                        After Katie returned to college and later moved to San Francisco for work, it seemed like we
                        might never reconnect. But in 2020, with the pandemic and remote work changing everything, Katie
                        made the bold decision to move to Seattle to be with me. Since then, we’ve survived the
                        pandemic, gotten a puppy, traveled to new places, and moved to Houston. Now, we’re excited to
                        start the next chapter of our lives together!
                    </p>
                    <a class="next" href="#info">View Event Details and More</a>
                </div>
            </div>
        </section>
        <section id="info">
            <h2>Event Schedule</h2>
            <div class="schedule">
                <div class="time gradient-clip">4:00</div>
                <div class="block gradient-clip">
                    <h3>Ceremony</h3>
                    <p><a class="gradient-clip"
                            href="https://www.google.com/maps/place/The+Wedding+Bowl/@32.8441643,-117.2817798,17z/data=!3m1!4b1!4m6!3m5!1s0x80dc03435d0ba36d:0x51bd66d95ca99684!8m2!3d32.8441598!4d-117.2792049!16s%2Fg%2F11n7n8jjc_?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D">The
                            Wedding Bowl / Cuvier Park</a></p>
                </div>
                <div class="time gradient-clip">4:30</div>
                <div class="block gradient-clip">
                    <h3>Cocktail Hour</h3>
                    <p><a class="gradient-clip"
                            href="https://www.google.com/maps/place/Cuvier+Club+by+Wedgewood+Weddings/@32.8441955,-117.2792809,17z/data=!3m1!4b1!4m6!3m5!1s0x80dc03e52a93be8f:0x61b40b925e731938!8m2!3d32.844191!4d-117.276706!16s%2Fg%2F1vtzhhtk?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D">Cuvier
                            Club (5 minute walk)</a></p>
                </div>
                <div class="time gradient-clip">5:30</div>
                <div class="block gradient-clip">
                    <h3>Dinner, Music, Open Bar</h3>
                </div>
                <div class="time gradient-clip">10:00</div>
            </div>
        </section>
        <section id="game"></section>
    </Container>
);
Page.Render('index.html');