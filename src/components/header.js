import axios from 'axios';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Link } from "react-router-dom";

function MyCustomButton(props)
{
    const login = useGoogleLogin({
        onSuccess : tokenResponse => {
            console.log(tokenResponse);
            axios.post('http://localhost:8000/dj-rest-auth/google/', {
                access_token: tokenResponse.access_token,
            })
            .then(r => {
                props.CookieManager[1]('authcookie', r.data);
            });
        }
    });
    return (
        <button type="button" className="btn btn-primary towardsright" onClick={login}>
            Signin with Google
        </button>
    )
}

function MyGoogleSignIn(props)
{
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <MyCustomButton CookieManager = {props.CookieManager}>
            </MyCustomButton>
        </GoogleOAuthProvider>
    )
}

function Logout(props)
{
    const logoutonclick = () => {
        props.CookieManager[2]('authcookie');
    }
    return (
        <div className='towardsright'>
            <div className='Name-box'>
                Welcome, {props.CookieManager[0]['authcookie']['user']['first_name']} {props.CookieManager[0]['authcookie']['user']['last_name']} 
            </div>
            <button className="btn btn-primary" onClick={logoutonclick}> Logout </button>
        </div>
    )
}

function NavBar(props)
{
    return (
        <div className = 'NavBar'>
            <ul className="nav">
                <li className="nav-item">
                    <Link className='nav-link' to="/">Home</Link>   
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/trends">Trends</Link>
                </li>
                {
                    props.CookieManager[0]['authcookie'] !== undefined ?
                    <li className="nav-item">
                        <Link className="nav-link" to="/yours">Your Documents</Link>
                    </li> : <div></div>
                }
                
                {/* <li className="nav-item">
                    <a className="nav-link disabled" href="/">Disabled</a>
                </li> */}
            </ul>
        </div>
    )
}

function Header(props)
{
    console.log(props)
    return (
        <div className='header'>
            <NavBar CookieManager = {props.CookieManager}></NavBar>
            {props.CookieManager[0]['authcookie'] === undefined? 
                <MyGoogleSignIn CookieManager = {props.CookieManager}></MyGoogleSignIn> : <Logout CookieManager = {props.CookieManager}></Logout>
            }
        </div>
    )
}

export default Header;