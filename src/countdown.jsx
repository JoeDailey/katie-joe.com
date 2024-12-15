export const Countdown = ({context}) => {
    return <pre>
        {JSON.stringify(context)}
    </pre>
    return <h2 id="countdown" class="hidden">
        <span class="digit gradient-clip" day="0">&nbsp;</span>
        <span class="digit gradient-clip" day="1">&nbsp;</span>
        <span class="digit gradient-clip" day="2">&nbsp;</span>
        <span class="sep">Days</span>
        <span class="digit gradient-clip" hour="0">&nbsp;</span>
        <span class="digit gradient-clip" hour="1">&nbsp;</span>
        <span class="sep">Hours</span>
        <div class="flex-break"></div>
        <span class="digit gradient-clip" min="0">&nbsp;</span>
        <span class="digit gradient-clip" min="1">&nbsp;</span>
        <span class="sep">Minutes</span>
        <span class="digit gradient-clip" sec="0">&nbsp;</span>
        <span class="digit gradient-clip" sec="1">&nbsp;</span>
        <span class="sep">Seconds</span>
    </h2>
};

const Digit = ({day}) => (
    <span class="gradient-clip" css={`
            background-size: 150% 95%;
        `} day={String(day)}>&nbsp;</span>
)