import './wall.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CookiesProvider } from 'react-cookie';
import { useCookies } from 'react-cookie';
import Header from './header'
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function TrendScreen()
{
    return (
        <div>
            Trends
        </div>
    )
}

function MyScreen()
{
    return (
        <div>
            yours
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
                
                {/* </div> */}
            </div>
        </CookiesProvider>
    );
}

export default Wall;