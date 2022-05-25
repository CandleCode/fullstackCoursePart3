import PersonList from "./PersonList";

const Persons = ({ persons, newFilter, handleClickDelete }) => {
  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().match(newFilter.toLowerCase())
  );

  return (
    <ul>
      {personsToShow.map((person) => (
        <PersonList
          key={person.id}
          person={person}
          handleClickDelete={handleClickDelete}
        />
      ))}
    </ul>
  );
};

export default Persons;
