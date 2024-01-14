import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/contacts';

const EditContact = (props) => {
  const navigate = useNavigate();

  // const { id, name, email } = props.location.state.contact;
 
  const { state: {contact} }=useLocation();

  const [state, setState] = useState({
    id: '',
    name: '',
    email: '',
  });

  useEffect(() => {
    async function getContactDetails() {
      const response = await api.put(
        `/contacts/${contact.id}`,
        contact
      );

      setState({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
      });
    }

    getContactDetails();
  }, [contact]);

  const update = (e) => {
    e.preventDefault();

    if (state.name === '' || state.email === '') {
      alert('All the fields are mandatory!');
      return;
    }

    props.updateContactHandler(state);
    setState({ name: '', email: '' });
    navigate('/');
  };

  return (
    <div className='ui main'>
      <h2>Edit Contact</h2>
      <form className='ui form' onSubmit={update}>
        <div className='field'>
          <label>Name</label>
          <input
            type='text'
            name='name'
            placeholder='Name'
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
          />
        </div>

        <div className='field'>
          <label>Email</label>
          <input
            type='text'
            name='email'
            placeholder='Email'
            value={state.email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
          />
        </div>

        <button className='ui button blue'>Update</button>
      </form>
    </div>
  );
};

export default EditContact;
