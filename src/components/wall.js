import './wall.css';
// import GoogleLogin from 'react-google-login';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


import { GoogleOAuthProvider } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
// import { GoogleLogin } from '@react-oauth/google';
function MyCustomButton()
{
    const login = useGoogleLogin({
        onSuccess : tokenResponse => {
            console.log(tokenResponse);
            axios.post('http://localhost:8000/dj-rest-auth/google/', {
                access_token: tokenResponse.access_token,
            })
            .then(r => {console.log(r.data.access_token)});
        }
    });
    return (
        <button type="button" className="btn btn-primary towardsright" onClick={login}>
            Signin with Google
        </button>
    )
}

function SideBar()
{
    return (
        <div className = 'SideBar'>
            <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
                <a href="/" className="nav-link active" aria-current="page">
                    Home
                </a>
            </li>
            <li>
            <a href="/" className="nav-link text-white">
                Dashboard
            </a>
            </li>
            <li>
            <a href="/" className="nav-link text-white">
                Orders
            </a>
            </li>
            </ul>
        </div>
    )
}

function Header()
{
    return (
        <div className='header'>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <MyCustomButton >
            </MyCustomButton>
            {/* <GoogleLogin        // commented code works for one tap
                onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                    let res = axios.post('http://localhost:8000/dj-rest-auth/google/', {
                        id_token: credentialResponse.credential,
                    });
                    console.log(res);
                    // return res.status;
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />; */}
            </GoogleOAuthProvider>
        </div>
    )
}

function SearchButton()
{
    return (
        <div className='searchBar'>
            <div className="input-group">
                <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                <button type="button" className="btn btn-outline-primary">search</button>
            </div>
        </div>
    )
}

function MainScreen()
{
    return (
        <div className='MainScreen'>
            <SearchButton></SearchButton>
        </div>
    )
}

function Wall()
{    
    return (
        <div className="fullscreen">
            <div className='leftpart'>
                <SideBar></SideBar>
            </div>
            <div className='rightpart'>
                <Header></Header>
                <MainScreen></MainScreen>
            </div>
        </div>
    );
}

export default Wall;