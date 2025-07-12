import React, { useEffect, useState } from 'react';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    // Get existing saved users
    const storedUsers = JSON.parse(localStorage.getItem('all_users')) || [];

    // Also fetch current logged-in user and add to the list if not already there
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && !storedUsers.some(u => u.email === currentUser.email)) {
      const newUser = {
        id: Date.now(),
        name: currentUser.name || 'Unnamed',
        email: currentUser.email,
        city: currentUser.city || 'Unknown',
        swaps: 0,
        date: new Date().toISOString().slice(0, 10),
      };
      storedUsers.push(newUser);
      localStorage.setItem('all_users', JSON.stringify(storedUsers));
    }

    setUsers(storedUsers);
  }, []);

  const handleEdit = (id, field, value) => {
    const updated = users.map(user => user.id === id ? { ...user, [field]: value } : user);
    setUsers(updated);
    localStorage.setItem('all_users', JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const updated = users.filter(user => user.id !== id);
    setUsers(updated);
    localStorage.setItem('all_users', JSON.stringify(updated));
  };

  const filteredUsers = users
    .filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'recent') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOption === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      } else {
        return 0;
      }
    });

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Users Overview</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-1/2"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-1/4"
        >
          <option value="">Sort by</option>
          <option value="recent">Recent First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">City</th>
              <th className="px-4 py-2 border">Swaps</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2 border">{user.id}</td>
                <td className="px-4 py-2 border">
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => handleEdit(user.id, 'name', e.target.value)}
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => handleEdit(user.id, 'email', e.target.value)}
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="text"
                    value={user.city}
                    onChange={(e) => handleEdit(user.id, 'city', e.target.value)}
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2 border text-center">{user.swaps}</td>
                <td className="px-4 py-2 border text-center">{user.date}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
