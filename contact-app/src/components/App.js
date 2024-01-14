import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

import './App.css';
import Header from './Header';
import AddContact from './AddContact';
import ContactList from './ContactList';
import ContactDetail from './ContactDetail';
import EditContact from './EditContact';
import api from '../api/contacts';

function App() {

  const LOCAL_STORAGE_KEY="contacts";
  const [contacts, setContacts]=useState([]);
  const [searchTerm, setSearchTerm]=useState("");
  const [searchResults, setSearchResults]=useState([]);

  //retrieve contacts from json server
  const retrieveContacts = async () => {
    const response = await api.get("/contacts");
    return response.data;
  }
  
  const addContactHandler = async (contact) => {

    const request={
      id: nanoid(),
      ...contact
    }

    const response = await api.post("/contacts", request);
    setContacts([...contacts, response.data]);

    //this will add contact and display it on screen. but once i refresh, it will all be gone. so to store it, we will use useeffect
    // setContacts([...contacts, { id: nanoid(), ...contact }]);
  };

  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact);
    const {id, name, email} = response.data;

    setContacts(
        contacts.map((contact) => {
        return contact.id === id ? {...response.data} : contact;
      })
    );
  };

  const removeContactHandler = async (id) => {

    let answer=window.confirm("Delete this contact?");

    if(answer){
      
      //api delete
      await api.delete(`/contacts/${id}`);

      //local storage
      const newContactList=contacts.filter((contact) => {
        return contact.id !== id;
      });
  
      setContacts(newContactList);
    }
  };

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);

    if(searchTerm !== ""){
      const newContactList = contacts.filter((contact) => {
        return Object
              .values(contact)
              .join(" ")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
      });

      setSearchResults(newContactList);
    }

    else{
      setSearchResults(contacts);
    }
  };

  //this will get data from local storage and will retain if we refresh page
  useEffect(() => {
    
    //retrieve data from local storage
    // const retrieveContacts=JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if(retrieveContacts) setContacts(retrieveContacts);

    //fetching data from server
    const getAllContacts = async () => {
      const allContacts = await retrieveContacts();
      if(allContacts) setContacts(allContacts);
    };

    getAllContacts();
  }, []);

  //this will store in local storage
  useEffect(() => {

    //local storage
    //without this if statement, it was not storing on refreshing
    // if(contacts.length>0){
    //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
    // }
  }, [contacts]);
   
  return (
    <div className='ui container'>
      <Router>
        <Header /> <br/><br/><br/>
        <Routes>
          {/* this routes matches the path we write in url with path here. so w/o "exact", if
          i write /add, it will show contact list only and not addcontact bcoz
          /add ka / matches / of contact list. so it wont search further. hence we write "exact"
          so that pura pura match kare toh hi contactlist dikhana */}

          <Route path="/" exact element={<ContactList contacts={searchTerm.length < 1 ? contacts : searchResults } getContactId={removeContactHandler} term={searchTerm} searchKeyword={searchHandler} />} />
          <Route path="/add" element={<AddContact addContactHandler={addContactHandler} />} />
          <Route path="/edit" element={<EditContact updateContactHandler={updateContactHandler} />} />
          <Route path="/contact/:id" element={<ContactDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
