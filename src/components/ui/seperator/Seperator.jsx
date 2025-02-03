import './Seperator.css'

export default function Seperator(props){
    
    return (
    <div className="separation-field">
        <span className="separation-border">{`${props.text}`}</span>
    </div>
    );
}