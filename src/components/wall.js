import './wall.css';
// import GoogleLogin from 'react-google-login';
import axios from 'axios';


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
        <button onClick={login}>
            Sign in with Google 🚀{' '}
        </button>
    )
}


function Wall()
{    
    console.log("breui");
    return (
        <div className="fullscreen">
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
        </GoogleOAuthProvider>;
    </div>);
}

export default Wall;