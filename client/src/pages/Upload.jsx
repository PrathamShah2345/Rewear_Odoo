import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { uploadItem } from '../services/api';

const Upload = () => {
  const token = localStorage.getItem('token');
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Skipped for now
  }, [editId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imageUrl: reader.result, // preview
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('You must be logged in to upload.');
      return;
    }

    let uploadedImageUrl = formData.imageUrl;

    // 🟢 Upload to Cloudinary if image selected
    if (formData.image) {
      const cloudData = new FormData();
      cloudData.append('file', formData.image);
      cloudData.append('upload_preset', 'rewear'); // Change this
      cloudData.append('cloud_name', 'dzbfhy0rz'); // Change this

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/dzbfhy0rz/image/upload`, {
          method: 'POST',
          body: cloudData,
        });

        const result = await response.json();
        uploadedImageUrl = result.secure_url;
      } catch (err) {
        console.error(err);
        setError('Image upload failed.');
        return;
      }
    }

    const itemData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      size: formData.size,
      condition: formData.condition,
      tags: formData.tags,
      image_url: uploadedImageUrl,
    };

    try {
      const result = await uploadItem(itemData, token);
      if (result.msg === "Item uploaded successfully") {
        setSuccess("Item uploaded successfully!");
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        setError(result.msg || "Upload failed.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
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

          {error && <div className="text-red-600 text-center text-sm">{error}</div>}
          {success && <div className="text-green-600 text-center text-sm">{success}</div>}

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

          {formData.imageUrl && (
            <div>
              <label className="block text-sm font-medium mb-1">Preview:</label>
              <img src={formData.imageUrl} alt="preview" className="w-full h-52 object-cover rounded-md mb-2" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
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
