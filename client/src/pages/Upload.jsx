import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { uploadItem } from '../services/api';
import { FiX, FiUploadCloud } from 'react-icons/fi';

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
  });

  const [files, setFiles] = useState([]); // Array of File objects
  const [previews, setPreviews] = useState([]); // Array of URL strings for preview

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('id');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Skipped fetching logic for edit
  }, [editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) {
      setError("Maximum 5 images allowed.");
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);

    // Generate previews
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('You must be logged in to upload.');
      return;
    }

    if (files.length === 0) {
      setError('Please upload at least one image.');
      return;
    }

    setUploading(true);

    try {
      // 1. Upload all images to Cloudinary
      const uploadPromises = files.map(async (file) => {
        const cloudData = new FormData();
        cloudData.append('file', file);
        cloudData.append('upload_preset', 'rewear');
        cloudData.append('cloud_name', 'dzbfhy0rz');

        const response = await fetch(`https://api.cloudinary.com/v1_1/dzbfhy0rz/image/upload`, {
          method: 'POST',
          body: cloudData,
        });

        if (!response.ok) throw new Error('Image upload failed');
        const result = await response.json();
        return result.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      const mainImageUrl = uploadedUrls[0];
      const additionalImages = uploadedUrls.slice(1);

      // 2. Submit Item Data
      const itemData = {
        ...formData,
        image_url: mainImageUrl,
        additional_images: JSON.stringify(additionalImages),
      };

      const result = await uploadItem(itemData, token);
      if (result.msg === "Item uploaded successfully") {
        setSuccess("Item uploaded successfully!");
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(result.msg || "Upload failed.");
        setUploading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black py-16 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="mb-12 border-b border-black pb-6">
          <h1 className="text-3xl font-bold uppercase tracking-tight">List an Item</h1>
          <p className="text-gray-500 mt-2">Share your pre-loved fashion. Upload up to 5 photos.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Section 1: Main Info */}
          <div className="md:col-span-7 space-y-8 order-2 md:order-1">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required
                  className="w-full border border-gray-300 p-4 focus:outline-none focus:border-black rounded-none placeholder-gray-400" placeholder="e.g. Vintage Denim Jacket" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={6}
                  className="w-full border border-gray-300 p-4 focus:outline-none focus:border-black rounded-none placeholder-gray-400" placeholder="Describe the item's history, fit, and feel..." />
              </div>

              {/* Categorization Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 p-3 bg-white focus:outline-none focus:border-black rounded-none">
                    <option value="">Select</option>
                    <option>Men</option>
                    <option>Women</option>
                    <option>Kids</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Condition</label>
                  <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border border-gray-300 p-3 bg-white focus:outline-none focus:border-black rounded-none">
                    <option value="">Select</option>
                    <option>New</option>
                    <option>Like New</option>
                    <option>Gently Used</option>
                    <option>Worn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Size</label>
                  <select name="size" value={formData.size} onChange={handleChange} className="w-full border border-gray-300 p-3 bg-white focus:outline-none focus:border-black rounded-none">
                    <option value="">Select</option>
                    <option>XS</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full border border-gray-300 p-3 bg-white focus:outline-none focus:border-black rounded-none">
                    <option value="">Select</option>
                    <option>Swap</option>
                    <option>Redeem</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Tags</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                  className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black rounded-none" placeholder="Comma separated..." />
              </div>
            </div>

            {error && <p className="text-red-600 font-medium">{error}</p>}
            {success && <p className="text-green-600 font-medium">{success}</p>}

            <button type="submit" disabled={uploading} className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition disabled:bg-gray-400">
              {uploading ? 'Uploading...' : (editId ? 'Update Listing' : 'Create Listing')}
            </button>
          </div>

          {/* Section 2: Image Upload */}
          <div className="md:col-span-5 order-1 md:order-2">
            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Photos (Max 5)</label>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {previews.map((src, idx) => (
                <div key={idx} className="relative aspect-square bg-gray-100 group">
                  <img src={src} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiX />
                  </button>
                  {idx === 0 && <span className="absolute bottom-1 left-1 bg-black text-white text-[10px] px-2 py-0.5 font-bold uppercase">Main</span>}
                </div>
              ))}

              {previews.length < 5 && (
                <div className="relative aspect-square border-2 border-dashed border-gray-300 hover:border-black transition bg-gray-50 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-black">
                  <FiUploadCloud className="w-8 h-8 mb-2" />
                  <span className="text-xs font-bold uppercase">Add Photo</span>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400">First image will be the main display image.</p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Upload;
