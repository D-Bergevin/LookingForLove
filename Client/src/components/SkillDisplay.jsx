function SkillDisplay(props) {
    return (
        <div className="skill">
            <span>{props.skill.name}</span>
            <span className="remove-button" onClick={() => {
                //LF: Remove skill from skills array in ProfileCreate if x button is clicked.
                props.setSkills(prevSkills => prevSkills.filter(skill => skill.id !== props.skill.id));
            }}> X</span>
        </div>
    );
}//LF: WIP! Placeholder for skill display. Needs X button for removing skill and styling. Similar to InterestDisplay.jsx, could be removed later.
//LF: Displaying only skill name for now.

export default SkillDisplay;