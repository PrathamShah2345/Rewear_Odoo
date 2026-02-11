import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../services/api';

const Admin = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (err) {
        setError('Access denied.');
      }
      setLoading(false);
    };
    fetchUsers();
  }, [token, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete user? This cannot be undone.')) return;
    try {
      const result = await deleteUser(id, token);
      if (result.msg === 'User deleted successfully') {
        setUsers(users.filter(user => user.id !== id));
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (error) return <div className="p-12 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-black pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">System Administration</p>
            <h1 className="text-3xl font-bold uppercase tracking-tight">Users Database</h1>
          </div>
          <div className="w-1/3">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-4 text-xs font-bold uppercase tracking-widest">ID</th>
                <th className="py-4 text-xs font-bold uppercase tracking-widest">User</th>
                <th className="py-4 text-xs font-bold uppercase tracking-widest">Role</th>
                <th className="py-4 text-xs font-bold uppercase tracking-widest text-right">Points</th>
                <th className="py-4 text-xs font-bold uppercase tracking-widest text-right">Items</th>
                <th className="py-4 text-xs font-bold uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 text-sm text-gray-500">#{user.id}</td>
                  <td className="py-4">
                    <p className="font-bold text-sm">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="py-4 text-sm">
                    {user.role === 'admin' ? (
                      <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Admin</span>
                    ) : (
                      <span className="text-gray-500 text-xs uppercase tracking-wider">User</span>
                    )}
                  </td>
                  <td className="py-4 text-sm text-right font-medium">{user.points}</td>
                  <td className="py-4 text-sm text-right font-medium">{user.items_count}</td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-gray-400 hover:text-red-600 text-xs uppercase font-bold tracking-widest transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
