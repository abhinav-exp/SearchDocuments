import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function NewScreen()
{
    const [sucessbool, changesucessbool] = useState(false);
    const [failtext, changefailtext] = useState("");
    const [formtitle, changeformtitle] = useState("");
    const [formtext, changeformtext] = useState("");

    const token = useCookies()[0]['authcookie']['access_token'];

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };  

    const onSubmitClick = (e) => {
        console.log(token)
        const postdata = {
            Title : formtitle, 
            Text : formtext
        };
        // console.log(e)
        axios.post(process.env.REACT_APP_BACKEND_URL+'api/document/',postdata, config)
        .then(r => {
            console.log(r)
            changesucessbool(true);
            changefailtext("");
        })
        .catch(error =>{
            changefailtext(JSON.stringify(error.response.data));
            changesucessbool(false);
        })
    } 

    return (
        <form className='container'>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
                    value = {formtitle} onChange = {(e) => {changeformtitle(e.target.value)}}></input>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">Example textarea</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="15"
                    value = {formtext} onChange = {(e) => {changeformtext(e.target.value)}}></textarea>
            </div>
            <button type="button" className="btn btn-primary" style={{"margin-bottom" : "2vh"}} onClick={onSubmitClick} >Submit</button>
            {sucessbool === true ? 
                <div className="alert alert-success" role="alert">
                    Upload Sucessful
                </div> : <div></div> }
            {failtext !== "" ? 
            <div className="alert alert-danger" role="alert">
                {failtext}
            </div> : <div></div> }
        </form>
    )
}

function UpdateScreen()
{
    const params = useParams()
    console.log(params)

    const [sucessbool, changesucessbool] = useState(false);
    const [failtext, changefailtext] = useState("");
    const [formtitle, changeformtitle] = useState("");
    const [formtext, changeformtext] = useState("");

    const token = useCookies()[0]['authcookie']['access_token'];

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };  

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL+'api/document/'+params.optid,
            config)
            .then(r => {
                console.log(r.data);
                changeformtitle(r.data.Title);
                changeformtext(r.data.Text);
            })
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    const onSubmitClick = (e) => {
        console.log(token)
        const postdata = {
            Title : formtitle, 
            Text : formtext
        };
        // console.log(e)
        axios.put(process.env.REACT_APP_BACKEND_URL+'api/document/'+params.optid+'/',
            postdata, config)
        .then(r => {
            console.log(r)
            changesucessbool(true);
            changefailtext("");
        })
        .catch(error =>{
            changefailtext(JSON.stringify(error.response.data));
            changesucessbool(false);
        })
    } 

    return (
        <form className='container'>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
                    value = {formtitle} onChange = {(e) => {changeformtitle(e.target.value)}}></input>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">Example textarea</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="15"
                    value = {formtext} onChange = {(e) => {changeformtext(e.target.value)}}></textarea>
            </div>
            <button type="button" className="btn btn-primary" style={{"margin-bottom" : "2vh"}} onClick={onSubmitClick} >Submit</button>
            {sucessbool === true ? 
                <div className="alert alert-success" role="alert">
                    Updated Sucessfully
                </div> : <div></div> }
            {failtext !== "" ? 
            <div className="alert alert-danger" role="alert">
                {failtext}
            </div> : <div></div> }
        </form>
    )

}

function DeleteScreen()
{
    const params = useParams()
    console.log(params)

    const [sucessbool, changesucessbool] = useState(false);
    const [failtext, changefailtext] = useState("");
    const [formtitle, changeformtitle] = useState("");
    const [formtext, changeformtext] = useState("");

    const token = useCookies()[0]['authcookie']['access_token'];

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };  

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL+'api/document/'+params.optid,
            config)
            .then(r => {
                console.log(r.data);
                changeformtitle(r.data.Title);
                changeformtext(r.data.Text);
            })
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    const onSubmitClick = () => {
        console.log(token)
        // console.log(e)
        axios.delete(process.env.REACT_APP_BACKEND_URL+'api/document/'+params.optid+'/',
            config)
        .then(r => {
            console.log(r)
            changesucessbool(true);
            changefailtext("");
        })
        .catch(error =>{
            changefailtext(JSON.stringify(error.response.data));
            changesucessbool(false);
        })
    } 

    return (
        <form className='container'>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
                    value = {formtitle} disabled={true} ></input>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">Example textarea</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="15"
                    value = {formtext} disabled={true}></textarea>
            </div>
            <button type="button" className="btn btn-danger" style={{"margin-bottom" : "2vh"}} onClick={onSubmitClick} >Delete</button>
            {sucessbool === true ? 
                <div className="alert alert-success" role="alert">
                    Deleted Sucessfully
                </div> : <div></div> }
            {failtext !== "" ? 
            <div className="alert alert-danger" role="alert">
                {failtext}
            </div> : <div></div> }
        </form>
    )
}

function ReadScreen()
{
    const params = useParams()
    console.log(params)

    const [formtitle, changeformtitle] = useState("");
    const [formtext, changeformtext] = useState("");

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL+'api/document/'+params.optid)
            .then(r => {
                console.log(r.data);
                changeformtitle(r.data.Title);
                changeformtext(r.data.Text);
            })
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <form className='container'>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
                    value = {formtitle} disabled={true} ></input>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">Example textarea</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="15"
                    value = {formtext} disabled={true}></textarea>
            </div>
        </form>
    )
}

function ShowScreen()
{
    const params = useParams()
    const [searchParams] = useSearchParams();
    console.log(params)
    console.log(searchParams.get('query'));

    const [formtitle, changeformtitle] = useState("");
    const [formtext, changeformtext] = useState("");

    const getauthcookie = useCookies()[0]['authcookie'];

    const config = (getauthcookie !== undefined ? {
        headers: { Authorization: `Bearer ${getauthcookie['access_token']}` }
    } : {})

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL+'api/click?query='+searchParams.get('query')+"&doc="+params.optid,
            config)
            .then(r => {
                console.log(r.data);
                changeformtitle(r.data.Title);
                changeformtext(r.data.Text);
            })
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <form className='container'>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
                    value = {formtitle} disabled={true} ></input>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">Example textarea</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="15"
                    value = {formtext} disabled={true}></textarea>
            </div>
        </form>
    )
}

export {NewScreen, UpdateScreen, DeleteScreen, ReadScreen, ShowScreen};