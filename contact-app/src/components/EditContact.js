import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditContact = (props) => {
  const navigate = useNavigate();

  // const { id, name, email } = props.location.state.contact;
 
  const [state, setState] = useState({
    id: props.id,
    name: props.name,
    email: props.email,
  });

  console.log(state.name);

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