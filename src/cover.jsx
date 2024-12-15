import { Countdown } from './countdown';

export const Cover = () => (
    <section id="cover">
        <img src="asset/cover.jpg" alt="Cover" />
        <div>
            <h1 id="title" class="gradient-clip">Katie andJoe</h1>
            <p id="subtitle" class="gradient-clip">Join us at our wedding </p>
        </div>
       <Countdown />
    </section>
)
