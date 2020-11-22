import styled from 'styled-components';

export const Container = styled.nav`

    width: 100%;
    height: 50px;
    background: ${props => props.theme.secondary};

    div.limit-center {
        width: 100%;
        height: 100%;
        max-width: 1100px;
        margin: 0 auto;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    div.limit-center .category-and-searchbar {
        width: 100%;
        
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    div.limit-center > div.switch-container {
        height: 28px;
    }

    div.mobile-menu {
        display: none !important;

        width: 100%;
        height: 100%;

        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    div.mobile-menu button {
        width: 50px;
        height: 40px;
        margin-right: 5px;
        border: 0;
        border-radius: 4px;
        background: ${props => props.theme.primary};
        color: ${props => props.theme.color};
        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    div.react-switch-bg svg {
        margin: 4px 3px;
    }

    @media (max-width: 650px) {
        div.limit-center .category-and-searchbar {
            display: none !important;
        }

        div.limit-center div.mobile-menu {
            display: flex !important;
        }

        div.limit-center {
            padding-left: 10px;
        }
    }
`;

export const SearchBarForm = styled.form`
    
    position: relative;
    width: 100%;
    max-width: 400px;

    & > div {
        display: flex;
        align-items: center;
    }

    input {
        width: 100%;
        height: 40px;
        padding: 5px;
        border: none;
        font-size: 20px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        text-align: center;
    }

    button {
        width: 40px;
        height: 40px;

        border: none;
        cursor: pointer;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }  

    ul.dropdown-search {
        position: absolute;
        top: 45px;
        z-index: 10;

        width: 100%;
        background: #eee;
        list-style: none;
    }

    ul.dropdown-search li {
        color: #111;
        margin-bottom: 5px;
    }

    ul.dropdown-search li a {
        cursor: pointer;

        display: flex;
        justify-content: space-between;
    }

    ul.dropdown-search li div.img-container {
        width: 100px;
        height: 45px;
    }

    ul.dropdown-search li img {
        width: auto;
        height: 45px;
    }

    ul.dropdown-search li span.title {
        width: 100%;
        padding: 0 5px;
        font-size: 20px;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* number of lines to show */
        -webkit-box-orient: vertical;
    }

    ul.dropdown-search li span.price {
        width: 200px;
        font-size: 20px;
        font-weight: bold;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    li span.price > span {
        font-size: 15px;
    }
`;

export const CategoryDropdownMenu = styled.div`
    ul {
        list-style: none;
        z-index: 10;
        position: relative;
    }
                
    ul li { 
        width: 200px; 
        height: 40px; 
        background: ${props => props.theme.primary};
        float: left; 
        line-height: 40px; 
        font-size: 20px;
        text-align: center; 
        user-select: none; 
        position: relative;
    }

    ul li.category-menu {
        border-radius: 5px;
    }

    ul li.category-menu.active {
        border-radius: 5px 5px 0 0;
        border-bottom: 1px solid ${props => props.theme.secondary};
    }

    ul li p {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
                
    ul li:hover { 
        background: ${props => props.theme.secondary};
    }

    ul li:active { 
        background: ${props => props.theme.primary};
    }

    li + li {
        border-top: 1px solid ${props => props.theme.secondary};
    } 

    li > ul {
        display: none;
    }

    li.has-children > ul {
        position: absolute; 
        left: 200px; 
        top: 0; 
    }

    li.active > ul {
        display: block;
    }

    li.has-children:hover > ul { 
        display: block;
    }
`;