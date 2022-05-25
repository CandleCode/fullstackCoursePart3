import { useState, useEffect } from "react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState({
    text: "",
    isError: false,
  });

  const notificationChange = (text, isError) => {
    setNotificationMessage({
      text: text,
      isError: isError,
    });
    setTimeout(() => {
      setNotificationMessage({ text: "", isError: false });
    }, 5000);
  };

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    if (newName && !persons.some((person) => person.name === newName)) {
      const personObject = { name: newName, number: newNumber };
      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        notificationChange(`${returnedPerson.name} was added`, false);
      });
      setNewName("");
      setNewNumber("");
    } else if (newName) {
      if (newNumber) {
        if (
          window.confirm(
            `${newName} is already added to phonebook, replace the old number with new one?`
          )
        ) {
          const person = persons.find((person) => person.name === newName);
          const changedPerson = { ...person, number: newNumber };
          personService
            .update(changedPerson.id, changedPerson)
            .then((returnedPerson) => {
              setPersons(
                persons.map((person) =>
                  person.id !== changedPerson.id ? person : returnedPerson
                )
              );
              setNewName("");
              setNewNumber("");
              notificationChange(
                `${returnedPerson.name}'s number has been replaced`,
                false
              );
            })
            .catch((error) => {
              notificationChange(
                `${person.name} has already been removed from the server`,
                true
              );
              setPersons(persons.filter((p) => p.id !== person.id));
              setNewName("");
              setNewNumber("");
            });
        }
      } else {
        alert(`${newName} is already added to phonebook`);
      }
    }
  };

  const handleClickDelete = (id) => {
    personService
      .deleteObject(id)
      .then(() => setPersons(persons.filter((person) => person.id !== id)));
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        setPersons={setPersons}
        newFilter={newFilter}
        handleClickDelete={handleClickDelete}
      />
    </div>
  );
};

export default App;
