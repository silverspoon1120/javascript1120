import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import queryString from 'query-string';

import api from '../services/api';

interface ITokenPayload {
    id: number;
    admin: boolean;
}

interface ILoginLogoutHook {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isFetching: boolean;
}

interface ThemeContextProviderProps {
    children: React.ReactNode;
}

const Context = createContext({} as ILoginLogoutHook);

export function LoginLogoutContextProvider({ children }: ThemeContextProviderProps) {

    const router = useRouter();

    const [getToken, setToken] = useState('');

    const [getIsFetching, setIsFetching] = useState(false);

    const firstRender = useRef(true);

    useEffect( () => {
        if(process.browser){
            const token = localStorage.getItem('token');
            if (token) setToken(token);
        }
    }, []);

    useEffect( () => {
        if(firstRender.current === false) session(getToken);
        else firstRender.current = false;
    }, [getToken])

    async function login(email: string, password: string) {
        try {
            setIsFetching(true);
            const response = await api.post('/sessions', {
                email,
                password
            });

            session(response.data.token);

            return true;

        } catch (error) {
            //console.log(error);
            alert('Erro ao fazer login');
            setIsFetching(false);

            return false;
        }
    }

    async function session(token: string) {
        
        const tokenPayload: ITokenPayload = jwt.decode(token) as ITokenPayload;

        try {

            if (!tokenPayload || tokenPayload.admin == false) return alert('Conta não autorizada');

            localStorage.setItem('token', token);
            api.defaults.headers.authorization = `Bearer ${token}`;

            setIsFetching(true);
            // confirm if the token is valid
            await api.get(`/users/${tokenPayload.id}`);

            const menuQueryString = queryString.parse(router.asPath)['/admin?menu'];

            const menu = menuQueryString ? menuQueryString : 'products-list';
            
            router.push({
                pathname: '/admin',
                query: {
                    menu
                }
            });

            setIsFetching(false);

        } catch (error) {
            console.error(error);
            logout();
            setIsFetching(false);
        }
    }

    function logout(){

        api.defaults.headers.authorization = undefined;

        localStorage.removeItem('token');

        router.push('/');
    }

    return (
        <Context.Provider
            value={{
                login,
                logout,
                isFetching: getIsFetching,
            }}
        >
            {children}
        </Context.Provider>
    );
}

export function useLoginLogout() {

    const context = useContext(Context);

    return context;
}
