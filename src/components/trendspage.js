import axios from 'axios';
import { useEffect, useState  } from 'react';
import {Link } from "react-router-dom";

function TrendCard(props)
{
    const [data, setdata] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8000/api/document/'+props.optid+"/")
        .then(r => {
            setdata(r.data);
            console.log(r.data);
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div>
            {
                data.Title !== undefined ?
                <div className="card text-center mycard">
                    <div className="card-body">
                        <h5 className="card-title">{data.Title}</h5>
                        <p className="card-text">{data.Text.substring(0, 300) + 
                            (data.Text.length > 300 ? "....." : "")}</p>
                        <Link to = {"/read/"+props.optid} className="btn btn-primary">Read Complete Document</Link>
                    </div>
                </div> : <div></div>
            }
        </div>
        
    )
}

function TrendScreen()
{
    const [arr, setarr] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/trends/')
        .then(r => {
            setarr(r.data.trends);
            console.log(arr);
        })
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
        
    return (
        <div className="container">
            {arr.length !== 0 ? arr.map(r => (<TrendCard optid = {r}></TrendCard>)) : <div className='alert alert-primary'>No Trends to show</div>}
        </div>
    )
}

export default TrendScreen;