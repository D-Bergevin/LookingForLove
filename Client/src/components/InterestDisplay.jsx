function InterestDisplay(props) {
    return (
        <div className="interest">
            <span>{props.interest}</span>
            <span className="remove-button" onClick={() => {
                //LF: Remove interest from interests array in ProfileCreate if x button is clicked.
                props.setInterests(prevInterests => prevInterests.filter(interest => interest !== props.interest));
            }}> X</span>
        </div>
    );
}//LF: WIP! Placeholder for interest display. Needs X button for removing interest and styling.
//LF: Displaying only interest name for now.

export default InterestDisplay;