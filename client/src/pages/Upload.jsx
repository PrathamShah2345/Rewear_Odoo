// src/pages/Upload.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Upload = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    tags: '',
    image: null,
    imageUrl: '',
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('id');

  // Prefill data if editing
  useEffect(() => {
  if (!currentUser || !editId) return;

  const key = `uploads_${currentUser.email}`;
  const uploads = JSON.parse(localStorage.getItem(key)) || [];
  const itemToEdit = uploads.find((item) => item.id.toString() === editId);

  if (itemToEdit && formData.title === '') {
    setFormData({
      ...itemToEdit,
      image: null, // Don’t overwrite file input
    });
  }
}, [editId, currentUser, formData.title]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in to upload.");

    const key = `uploads_${currentUser.email}`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];

    let updatedUpload = {
      ...formData,
      id: editId ? parseInt(editId) : Date.now(),
      timestamp: new Date().toISOString(),
    };

    // 🖼 If new image selected, update imageUrl
    if (formData.image) {
      updatedUpload.imageUrl = URL.createObjectURL(formData.image);
    } else {
      const existingItem = existing.find((item) => item.id.toString() === editId);
      updatedUpload.imageUrl = existingItem?.imageUrl || '';
    }

   const filtered = existing.filter((item) => item.id.toString() !== editId);

    localStorage.setItem(key, JSON.stringify([updatedUpload, ...filtered]));

    alert(editId ? "Item updated successfully!" : "Item uploaded successfully!");
    navigate('/dashboard');
  };

  return (
   <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="pt-24 min-h-screen bg-gradient-to-tr from-green-50 via-emerald-100 to-green-200 px-4 py-8"
>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-xl shadow border border-emerald-200">
          <h2 className="text-2xl font-bold text-emerald-800">Item Details</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Item Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md border-emerald-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-md border-emerald-300"
            />
          </div>

          {/* Existing image preview */}
          {formData.imageUrl && (
            <div>
              <label className="block text-sm font-medium mb-1">Current Image:</label>
              <img src={formData.imageUrl} alt="preview" className="w-full h-52 object-cover rounded-md mb-2" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Upload New Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 text-sm border h-10 border-emerald-300 rounded-md"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6 bg-white p-6 rounded-xl shadow border border-emerald-200">
          <h2 className="text-2xl font-bold text-emerald-800">Categorization</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md border-emerald-300"
            >
              <option value="">Select a category</option>
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
              <option>Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Listing Type</label>
            <div className="flex items-center space-x-4 mt-1">
              <label className="flex items-center space-x-2">
                <input type="radio" name="type" value="Swap" checked={formData.type === 'Swap'} onChange={handleChange} />
                <span>Swap</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="type" value="Redeem" checked={formData.type === 'Redeem'} onChange={handleChange} />
                <span>Redeem for Points</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md border-emerald-300"
            >
              <option value="">Select a size</option>
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
              <option>XXL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md border-emerald-300"
            >
              <option value="">Select condition</option>
              <option>New</option>
              <option>Like New</option>
              <option>Gently Used</option>
              <option>Worn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              type="text"
              name="tags"
              placeholder="e.g. cotton, summer, casual"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition duration-200"
          >
            {editId ? 'Update Item' : 'Upload Item'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Upload;
