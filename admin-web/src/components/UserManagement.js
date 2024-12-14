import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../api/index';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [naturalCount, setNaturalCount] = useState(0);
    const [socialCount, setSocialCount] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await getAllUsers();
                console.log('Fetched users:', data); // Log fetched users
                setUsers(data.users); // Set the user data
                setTotalCount(data.totalCount); // Set total user count
                setNaturalCount(data.naturalCount); // Set natural count
                setSocialCount(data.socialCount); // Set social count
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>User Management</h1>
            <input 
                type="text" 
                placeholder="Search by name or ID" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <div>
                <h2>Total Users: {totalCount}</h2>
                <h2>Natural Stream Users: {naturalCount}</h2>
                <h2>Social Stream Users: {socialCount}</h2>
            </div>
            <ul>
                {users.filter(user => 
                    user.name.includes(searchTerm) || user._id.includes(searchTerm) // Use _id for filtering
                ).map(user => (
                    <li key={user._id}>{user.name} ({user.phoneNumber})</li> // Use phoneNumber or another identifier
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;
