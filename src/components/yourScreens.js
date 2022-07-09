import {Link } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

function DocCard(props)
{
    return (
        <div className="card text-center mycard">
            {/* <div className="card-header">
            </div> */}
            <div className="card-body">
                <h5 className="card-title">{props.datashow.Title}</h5>
                <p className="card-text">{props.datashow.Text.substring(0, 300) + 
                    (props.datashow.Text.length > 300 ? "....." : "")}</p>
                <Link to = {"/read/"+props.datashow.id} className = "btn btn-primary mybtn" >Read</Link>
                <Link to = {"/update/"+props.datashow.id} className="btn btn-success mybtn">Update</Link>
                <Link to = {"/delete/"+props.datashow.id} className='btn btn-danger mybtn'>Delete</Link>
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
        axios.get(process.env.REACT_APP_BACKEND_URL+'api/document/',
        config)
        .then(r => {
            setarr(r.data.list);
            console.log(arr);
        })
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="container">
            <Link type="button" className="btn btn-warning btnNew" to="/new">New</Link>
            {arr.length !== 0 ? arr.map(r => <DocCard datashow = {r}></DocCard>) : <div className='alert alert-primary'>No Documents to show</div>}
        </div>
    )
}

export default MyScreen;