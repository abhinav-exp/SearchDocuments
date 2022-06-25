import './wall.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CookiesProvider, useCookies } from 'react-cookie';
import Header from './header'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrendScreen from './trendspage';
import axios from 'axios';
import { useEffect, useState  } from 'react';

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

function SearchScreen()
{
    return (
        <div className='MainScreen'>
            <SearchButton></SearchButton>
        </div>
    )
}

function DocCard(props)
{
    return (
        <div className="card text-center mycard">
            {/* <div className="card-header">
            </div> */}
            <div className="card-body">
                <h5 className="card-title">{props.datashow.Title}</h5>
                <p className="card-text">{props.datashow.Text}</p>
                <a href="/" className="btn btn-primary">Go somewhere</a>
            </div>
            {/* <div className="card-footer text-muted">
                {/* {data} */}
            {/* </div> */} 
        </div>
    )
}

function MyScreen()
{

    const [arr, setarr] = useState([]);

    const token = useCookies()[0]['authcookie']['access_token'];

    // console.log(token)

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };  

    useEffect(() => {
        axios.get('http://localhost:8000/api/document/',
        config)
        .then(r => {
            setarr(r.data.list);
            console.log(arr);
        })
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="container">
            {arr.map(r => <DocCard datashow = {r}></DocCard>)}
        </div>
    )
}

function Wall()
{    
    const CookieManager = useCookies();
    return (
        <CookiesProvider>
            <div className="fullscreen">
                {/* <div className='leftpart'>
                    <SideBar CookieManager={CookieManager}></SideBar>
                </div> */}
                {/* <div className='rightpart'> */}
                <BrowserRouter>
                    <Header CookieManager={CookieManager}></Header>
                    <Routes>
                        <Route path="/" element={<SearchScreen></SearchScreen>}></Route>
                        <Route path="trends" element={<TrendScreen></TrendScreen>}></Route>
                        <Route path="yours" element= {<MyScreen></MyScreen>}></Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </CookiesProvider>
    );
}

export default Wall;