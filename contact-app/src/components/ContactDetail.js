import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import user from  '../images/user.png';
import api from '../api/contacts';

const ContactDetail = (props) => {

    // const {name, email} = props.location.state.contact;

    const [contact, setContact]=useState({});
    let {pathname}=useLocation();

    const retrieveContact = async () => {
        const response = await api.get("/contacts");
        return response.data;
    }

    useEffect(() => {

        //using server storage
        const getContact = async () => {
            const contacts = await retrieveContact();
    
            if (contacts) {
                const currentContactId = pathname.split('/')[2];
    
                const currentContact = contacts.find(
                    (contact) => contact.id.toString() === currentContactId
                );
    
                if (currentContact) {
                    const { name, email } = currentContact;
                    setContact({ name, email });
                }
            }
        };
    
        getContact();

        //using local storage
        // const retrieveContacts = JSON.parse(localStorage.getItem('contacts'));

        // if(retrieveContacts){
        //     const currentContactId=pathname.split('/')[2];

        //     const {name, email} = retrieveContacts.find(
        //         (contact) => contact.id === currentContactId
        //     );

        //     setContact({name, email});
        // }
    }, [pathname]);

    return (
        <div className="main">
            <div className="ui card centered">
                <div className="image">
                    <img src={user} alt="user" />
                </div>

                <div className="content">
                    <div className="header">{contact.name}</div>
                    <div className="description">{contact.email}</div>
                </div>

                <div className="center-div">
                    <Link to="/">
                        <button className="ui button blue center">Back To Contact List</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ContactDetail;