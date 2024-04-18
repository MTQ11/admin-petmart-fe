// NotFound.js
import React from 'react';
import './notfound.css'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1><FontAwesomeIcon icon={faExclamationCircle} /> Page Not Found</h1>
            <p>The page you're looking for does not exist.</p>
            <Link to="/" className="back-link"><FontAwesomeIcon icon={faArrowLeft} /> Go back</Link>
        </div>
    );
};

export default NotFound;
