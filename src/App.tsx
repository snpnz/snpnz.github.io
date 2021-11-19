import { useEffect, useState } from 'react';
import './App.css';
import {
  getAuthLink
} from './services/authService';
import MainScreen from "./components/MainScreen";
import {get} from "./helpers/httpClient";

interface IUser {
  "id": string;
  "login": string;
  "name": string;
  "surname": string;
  "photo": string;
  "strava_id": string;
  "register_date": string;
}

function App() {
  const [userData, setUserData] = useState<IUser | null | undefined>(null);
  const [err, setErr] = useState('');

  useEffect(() => {

    const params = new URLSearchParams(document.location.search.substring(1));
    const token = params.get("token");
    const id = params.get("id");
    const expiration = params.get("expiration");

    if (token && id && expiration) {
      localStorage.setItem('snpzn-auth', JSON.stringify({ token, id, expiration }));
      window.location.href = "/";
      return;
    }


    const getd = async () => {
      try {
        const userData = await get('/api/user/');
        if (userData.success === false) {
          setUserData(undefined);
        } else {
          setUserData(userData.data);
        }

      } catch (e) {
        setErr((e as Error).message);
      }
    }
    getd().then();


  }, []);

  if (userData === null) {
    return <div>Loading...</div>;
  }

  if (userData === undefined) {
    return (
        <div className="App">
          <button  className="bigButton" onClick={() => window.location.href = getAuthLink()}>Войти в Strava</button>
        </div>
    );
  }

  return (
      <div className="App">
        {err && <p>{err}</p>}
        <div style={{textAlign:'left', lineHeight: '15px', padding: '8px'}}>
          <button  style={{float:'right'}} onClick={() => { window.localStorage.clear(); window.location.href = "/"; }}>Выйти</button>
          <img src={userData.photo} alt={userData.name} style={{float:'left'}} width={40} />
          <div>{userData.name}<br />{userData.surname}</div>
        </div>
        <MainScreen />
      </div>
  );
}

export default App;