import styled from 'styled-components';

export const Container = styled.div`

    nav {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px;    
    }

    nav ul {
        display: flex;
        list-style: none;
    }

    ul li button {
        margin: 5px;
        padding: 10px 20px;
        border: ${props => props.theme.title == 'light' ? '1px solid #111' : 0};
        border-radius: 2px;
        font-size: 25px;
        color: ${props => props.theme.primary};
        cursor: pointer;
    }

    ul li button:hover {
        background: ${props => props.theme.secondary};
    }

    ul li button:active {
        background: ${props => props.theme.primary};
    }

    ul li button.active {
        background: ${props => props.theme.primary};
        color: ${props => props.theme.color};
    }
`;
