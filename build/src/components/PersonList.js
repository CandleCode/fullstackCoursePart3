const PersonList = ({ person, handleClickDelete }) => {
  const handleClick = (person) => () => {
    if (window.confirm(`delete ${person.name}?`)) handleClickDelete(person.id);
  };

  return (
    <li>
      {person.name} {person.number}
      <button onClick={handleClick(person)}>Delete</button>
    </li>
  );
};

export default PersonList;
