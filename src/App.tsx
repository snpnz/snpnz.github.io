import { useEffect, useState } from 'react';
import './App.css';
import {
  getAuthLink,
  unAuthorizeAsync
} from './services/authService';
import MainScreen from "./components/MainScreen";

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

    const get = async () => {
      try {
        const rawUserData = await fetch(
            '/api/user/',
            { credentials: 'include'});
        const userData = await rawUserData.json();
        if (userData.success === false) {
          setUserData(undefined);
        } else {
          setUserData(userData.data);
        }

      } catch (e) {
        setErr((e as Error).message);
      }
    }
    get().then();


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
          <button  style={{float:'right'}} onClick={() => unAuthorizeAsync()}>Выйти</button>
          <img src={userData.photo} alt={userData.name} style={{float:'left'}} width={40} />
          <div>{userData.name}<br />{userData.surname}</div>
        </div>
        <MainScreen />
      </div>
  );
}

export default App;