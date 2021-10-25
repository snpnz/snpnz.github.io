import { useEffect, useState } from 'react';
import './App.css';
import {
  getAuthLink,
  getAuthTokenAsync,
  setAuthTokenByCodeAsync,
  getUser
} from './services/authService';

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbLoading, setDbLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if(code?.length) {
      const getUserData = async () => {
        setLoading(true);
        try {
          await setAuthTokenByCodeAsync(code);
          window.history.pushState({},'', '/');
          window.location.reload();
          //window.location.href = window.location.href.replace(window.location.search, '');
        } catch (e) {
          setErr((e as Error).message)
          window.location.href = getAuthLink();
        }
        finally {
          setLoading(false);
        }
      }
      getUserData();
    } else {
      const getStoredData = async () => {
        setLoading(true);
        try {
          const token = await getAuthTokenAsync();
          setToken(token);
        } catch (e) {
          console.log(e)
          //window.location.href = getAuthLink();
        } finally {
          setLoading(false);
        }
      }

      getStoredData();
    }

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }



  return (
      <div className="App">
        {err && <p>{err}</p>}
        {token && <pre>{JSON.stringify(getUser(),null, '\t')}</pre>}
        {!token && <button  className="bigButton" onClick={() => window.location.href = getAuthLink()}>Войти в Strava</button>}
      </div>
  );
}

export default App;