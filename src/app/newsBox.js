import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import "../app/newsBox.css"
import "boxicons"

export default function BusinessNewsBox(props){
    return (
        <div className="newsBoxLay">
            <div className="newsBoxBox">
                <div className="linksec">
                <h5>{props.author}</h5>
                <box-icon href={props.link} name='link' color="#0072F5"></box-icon>
                </div>
                
               
                <div className="newsBoxImg2">
                    <img src={props.url} width={'300px'} style={{objectFit:'cover', border:'none', borderRadius:'10px'}}></img>
                </div>
                <h4>{props.title}</h4>
                <p>{props.des}</p>
                <br></br>
                <div className="newsDel">
                    <small className="s1">Source : {props.source}</small>
                    <small className="s2">{props.date}</small>
                </div>
            </div>
        </div>
    )
}