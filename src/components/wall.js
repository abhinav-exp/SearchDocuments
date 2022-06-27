import './wall.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CookiesProvider, useCookies } from 'react-cookie';
import Header from './header'
import { BrowserRouter, Routes, Route, useParams} from "react-router-dom";
import TrendScreen from './trendspage';
import MyScreen from './yourScreens';
import {NewScreen, UpdateScreen, DeleteScreen, ReadScreen, ShowScreen} from './CRUDscreens';
import { useEffect, useState } from 'react';
import {Link } from "react-router-dom";
import axios from 'axios';

function SearchButton(props)
{
    const [query, changequery] = useState(props.query !== undefined ? props.query : "");

    return (
        <div className='searchBar'>
            <div className="input-group">
                <input type="search" className="form-control rounded" placeholder='Search' value={query} onChange = {e => changequery(e.target.value)}
                 aria-label="Search" aria-describedby="search-addon" />
                <Link to = {"/search/"+query} className="btn btn-outline-primary" >search</Link>
            </div>
        </div>
    )
}

function MainScreen()
{
    return (
        <div className='MainScreen'>
            <h1 className='textlogo'>SearchDocuments</h1>
            <SearchButton></SearchButton>
        </div>
    )
};

function ClickTab(props)
{
    const [data, setdata] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8000/api/document/'+props.optid+"/")
        .then(r => {
            setdata(r.data);
            console.log(r.data);
        })
    }, [props.optid]) // eslint-disable-line react-hooks/exhaustive-deps

    //explained here -> https://dmitripavlutin.com/react-useeffect-explanation/

    return (
        <div>
        {data.Title !== undefined ?
            <div className="card text-center mycard">
            {/* <div className="card-header">
            </div> */}
            <div className="card-body">
                <h5 className="card-title">{data.Title}</h5>
                <p className="card-text">{data.Text.substring(0, 300) + 
                    (data.Text.length > 300 ? "....." : "")}</p>
                <Link to = {"/show/"+props.optid+"?query="+props.query} className="btn btn-primary">Read Complete Document</Link>
            </div>
            {/* <div className="card-footer text-muted">
                {/* {data} */}
            {/* </div> */} 
            </div> : <div></div>
        } </div>
    )
}

function SearchScreen()
{

    const params = useParams();

    if(params.query === undefined)
        params.query = ""

    const [suggestion, changeSuggestion] = useState([])

    const getauthcookie = useCookies()[0]['authcookie'];

    const config = (getauthcookie !== undefined ? {
        headers: { Authorization: `Bearer ${getauthcookie['access_token']}` }
    } : {})

    useEffect(() => {
        axios.get('http://localhost:8000/api/search?query='+params.query,
        config)
        .then(r => {
            console.log(r.data.suggestion)
            changeSuggestion(r.data.suggestion);
        })
    }, [params.query]); // eslint-disable-line react-hooks/exhaustive-deps
    

    return (
        <div className='container'>
            <SearchButton query = {params.query}></SearchButton>
            <div>{suggestion.length !== 0 ?
                suggestion.map(r => (<ClickTab optid = {r} query = {params.query}></ClickTab>))
                : <div className='alert alert-primary'>No suggestion to show</div> }</div>
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
                        <Route path="/" element={<MainScreen></MainScreen>}></Route>
                        <Route path="search/:query" element={<SearchScreen></SearchScreen>}></Route>
                        <Route path="search/" element={<SearchScreen></SearchScreen>}></Route>
                        <Route path="trends" element={<TrendScreen></TrendScreen>}></Route>
                        <Route path="yours" element= {<MyScreen></MyScreen>}></Route>
                        <Route path="new" element={<NewScreen></NewScreen>} ></Route>
                        <Route path="read/:optid" element={<ReadScreen></ReadScreen>} ></Route>
                        <Route path="update/:optid" element={<UpdateScreen></UpdateScreen>} ></Route>
                        <Route path="delete/:optid" element={<DeleteScreen></DeleteScreen>} ></Route>
                        <Route path="show/:optid" element={<ShowScreen></ShowScreen>} ></Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </CookiesProvider>
    );
}

export default Wall;