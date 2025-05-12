import { useNavigate, Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react';
import { useLoginMutation } from './AuthApiSlice';
import { setCredentials } from './AuthSlice';
import usePersist from '../../hooks/usePersist';

export const Login = () => {
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string>('');
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();


  useEffect(() => {
    userRef?.current?.focus()
  }, []);

  useEffect(() => {
      setErrMsg('');
  }, [userName, password]);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value);
  const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev: boolean) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
        const { accessToken } = await login({ userName, password }).unwrap();
        dispatch(setCredentials({ accessToken }));
        setUserName('');
        setPassword('');
        navigate('/dashboard');
    } catch (err: any) {
        if (!err.status) {
            setErrMsg('No Server Response');
        } else if (err.status === 400) {
            setErrMsg('Missing Username or Password');
        } else if (err.status === 401) {
            setErrMsg('Unauthorized');
        } else {
            setErrMsg(err.data?.message);
        }
        errRef?.current?.focus();
    }
  }

  const errClass = errMsg ? "errmsg" : "offscreen"

  if (isLoading) return <p>Loading...</p>

  const content = (
    <section className="public">
        <header>
            <h1>Employee Login</h1>
        </header>
        <main className="login">
            <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    className="form__input"
                    type="text"
                    id="username"
                    ref={userRef}
                    value={userName}
                    onChange={handleUserInput}
                    autoComplete="off"
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    className="form__input"
                    type="password"
                    id="password"
                    onChange={handlePwdInput}
                    value={password}
                    required
                />
                <button className="form__submit-button">Sign In</button>

                <label htmlFor="persist" className="form__persist">
                  <input
                      type="checkbox"
                      className="form__checkbox"
                      id="persist"
                      onChange={handleToggle}
                      checked={persist}
                  />
                  Trust This Device
              </label>
            </form>
        </main>
        <footer>
            <Link to="/">Back to Home</Link>
        </footer>
    </section>
)

return content
};