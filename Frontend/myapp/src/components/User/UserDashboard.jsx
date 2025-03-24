import React from 'react';
import { useParams } from 'react-router-dom';

const UserDashboard = () => {
    const { username } = useParams();
    return (
        <h1 className="text-5xl font-bold">Hello, {username}!</h1>
    );
}

export default UserDashboard;
