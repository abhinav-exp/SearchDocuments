import axios from 'axios';
import { useEffect, useState  } from 'react';

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
        <div className="card text-center mycard">
            {/* <div className="card-header">
            </div> */}
            <div className="card-body">
                <h5 className="card-title">{data.Title}</h5>
                <p className="card-text">{data.Text}</p>
                <a href="/" className="btn btn-primary">Go somewhere</a>
            </div>
            {/* <div className="card-footer text-muted">
                {/* {data} */}
            {/* </div> */} 
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
            {arr.map(r => (<TrendCard optid = {r}></TrendCard>))}
        </div>
    )
}

export default TrendScreen;