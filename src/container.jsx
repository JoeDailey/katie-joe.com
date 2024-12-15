export const Countdown = ({Page, context, children}) => {
    context.Page = Page;
    
    return <div css={`{
        scroll-snap-type: y mandatory;
        height: 100vh;
        width: 100vw;
        overflow: scroll;
        display: grid;
        scroll-behavior: smooth;
    }`}>{children}</div>;
};