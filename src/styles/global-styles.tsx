import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
// import { normalize } from "styled-normalize";

const GlobalStyles = createGlobalStyle`
    ${reset};
    *{
        box-sizing:border-box;
    }
    html,body{
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        font-size: 14px;
    }
    /* svg{
        fill:#262626;
    } */
    a{
        text-decoration:none;
        color:inherit;
    }
`;

export default GlobalStyles;
