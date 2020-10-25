import React, { useState, useEffect } from 'react';

import { useUser } from '../contexts/userContext';

import ForgotPasswordModal from './ForgotPasswordModal';

export default function ModalLogin() {

    const [getName, setName] = useState('');
    const [getEmail, setEmail] = useState('');
    const [getPassword, setPassword] = useState('');
    const [getConfirmPassword, setConfirmPassword] = useState('');

    const [getDisabledButton, setDisabledButton] = useState(true);

    const [getCreateNewAccount, setCreateNewAccount] = useState(false);
    const [getForgotPassword, setForgotPassword] = useState(false);

    const userContext = useUser();

    useEffect( () => {

        if(getCreateNewAccount){
            if(
                getName.length > 3 &&
                getEmail.length > 7 &&
                getPassword.length > 5 &&
                getConfirmPassword == getPassword
            ){
                setDisabledButton(false);
            } else {
                setDisabledButton(true);
            }
        } else {
            if(
                getEmail.length > 8 &&
                getPassword.length > 5
            ){
                setDisabledButton(false);
            } else {
                setDisabledButton(true);
            }
        }

    }, [getName, getEmail, getPassword, getConfirmPassword]);

    async function handleCreateOrLogin(event){

        event.preventDefault();

        if(getCreateNewAccount){

            userContext.createUser(getName, getEmail, getPassword);

        } else {

            const result = await userContext.logIn(getEmail, getPassword);
            
            if(!result) alert('Erro ao logar');
        }
    }

    return (
        <>
            <div className='modal'>

                <div className='modal-content'>

                    <div className="modal-head">
                        <h1>{(getCreateNewAccount) ? 'Cadastrar' : (getForgotPassword) ? 'Recuperar' : 'Login'}</h1>
                        <button 
                            type='button' 
                            className='close-modal'
                            onClick={() => userContext.handleSwitchModal()}
                        >
                            X
                        </button>
                    </div>

                    {(getForgotPassword)
                        ? <ForgotPasswordModal setForgotPassword={setForgotPassword} />    
                        : (
                            <>
                                <form>
                                    {(getCreateNewAccount) && (
                                        <div className="input-group">
                                            <label htmlFor="login-name">Nome completo</label>
                                            <input 
                                                type='text' 
                                                id="login-name"
                                                value={getName}
                                                onChange={(event) => setName(event.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div className="input-group">
                                        <label htmlFor="login-email">e-mail</label>
                                        <input 
                                            type='email' 
                                            id="login-email"
                                            value={getEmail}
                                            onChange={(event) => setEmail(event.target.value.trim())}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="login-password">
                                            Senha {(getCreateNewAccount) && <span>(no mínimo 6 dígitos)</span>}
                                        </label>
                                        <input 
                                            type='password' 
                                            id="login-password"
                                            value={getPassword}
                                            onChange={(event) => setPassword(event.target.value.trim())}
                                        />
                                    </div>

                                    {(getCreateNewAccount) && (
                                        <div className="input-group">
                                            <label htmlFor="login-confirm-password">Confirmar senha</label>
                                            <input 
                                                type='password' 
                                                id="login-confirm-password"
                                                value={getConfirmPassword}
                                                onChange={(event) => setConfirmPassword(event.target.value.trim())}
                                            />
                                        </div>
                                    )}

                                    <button 
                                        type="submit" 
                                        className='login-button'
                                        disabled={getDisabledButton}
                                        onClick={(event) => handleCreateOrLogin(event)}
                                    >
                                        {(getCreateNewAccount) ? 'Cadastrar' : 'Entrar'}
                                    </button>

                                </form>

                                <div className='create-forgot'>
                                    {(getCreateNewAccount == false) && (
                                        <>
                                            <a 
                                                onClick={() => setCreateNewAccount(true)}
                                            >
                                                Criar nova conta
                                            </a> 
                                            <a
                                                onClick={() => setForgotPassword(true)}
                                            >
                                                Esqueci a senha
                                            </a>
                                        </>
                                    )}

                                    {(getCreateNewAccount) && (
                                        <>
                                            <a 
                                                onClick={() => setCreateNewAccount(false)}
                                            >
                                                Voltar para Login
                                            </a> 
                                        </>
                                    )}
                                </div>
                            </>
                        )
                    }
                </div>
            </div>

            <style jsx>{`
                .modal {
                    position: fixed; /* Stay in place */
                    z-index: 30; /* Sit on top */
                    left: 0;
                    top: 0;
                    width: 100%; /* Full width */
                    height: 100%; /* Full height */
                    overflow: auto; /* Enable scroll if needed */
                    background-color: rgb(0,0,0); /* Fallback color */
                    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
                }

                .modal-content {
                    background-color: #0D2235;
                    margin: 10% auto; /* 15% from the top and centered */
                    padding: 20px;
                    width: 100%;
                    max-width: 400px;
                    min-height: 350px;
                    border-radius: 5px;
                }

                .modal-content .modal-head {
                    display: flex;
                    justify-content: space-between;
                }

                .modal-content .close-modal {
                    width: 30px;
                    height: 30px;
                    border: 0;
                    border-radius: 5px;
                    font-weight: bold;
                    background: #a32e39;
                    cursor: pointer;
                }

                .modal-content .close-modal:hover {
                    background: #bf2232;
                }

                .modal-content form {
                    width: 100%;
                    height: 100%;
                    padding: 60px 0 0 0;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .modal-content form .input-group  {
                    display: flex;
                    flex-direction: column;
                    width: 300px;
                }

                .modal-content form .input-group label {
                    margin: 0 0 0 5px;
                }

                .modal-content form .input-group label span {
                    font-size: 14px;
                }

                .modal-content form .input-group + .input-group {
                    margin: 20px 0 0 0;
                }

                .modal-content form input {
                    width: 100%;
                    height: 40px;
                    font-size: 20px;
                    padding: 5px;
                    border: 1px solid #60615b;
                    border-radius: 5px;
                }

                .modal-content form .login-button {
                    margin: 30px 0 0 0;
                    width: 300px;
                    height: 50px;
                    border: 0;
                    border-radius: 5px;
                    background: #3E8C34;
                    font-size: 15px;
                    cursor: pointer;
                    color: inherit;
                }

                .modal-content form .login-button:hover {
                    background: #41A933;
                }

                .modal-content form .login-button:active {
                    background: #3E8C34;
                }

                .modal-content form .login-button:disabled {
                    background: #a32e39;
                }

                .modal-content form .login-button:disabled:hover {
                    background: #bf2232;
                }

                .create-forgot {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    margin: 10px 0;
                }

                .create-forgot a {
                    cursor: pointer;
                    margin: 10px 0 0 0;
                }

            `}</style>
        </>
    );
}