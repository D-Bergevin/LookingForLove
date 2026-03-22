function SkillDisplay(props) {
    return (
        <div className="skill">
            <span>{props.skill}</span>
            <span className="remove-button" onClick={() => {
                //LF: Remove skill from skills array in ProfileCreate if x button is clicked.
                props.setSkills({skills: prevSkills => prevSkills.filter(skill => skill !== props.skill)});
            }}> X</span>
        </div>
    );
}//LF: WIP! Placeholder for skill display. Needs X button for removing skill and styling. Similar to InterestDisplay.jsx, could be removed later.
//LF: Displaying only skill name for now.

export default SkillDisplay;