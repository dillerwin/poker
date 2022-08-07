export default function Cardtable(props) {
    return(
        <div className="cardtable-container">
            <div>This is the play area</div>
            <button onClick={props.advDealer}>Winner!</button>
        </div>
    )
}