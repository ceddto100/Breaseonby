import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVideo, uploadVideoFile, uploadThumbnail } from '../../api';

const CATEGORIES = ['Musicians', 'Athletes', 'Hustlers', 'Icons', 'Politicians'];

export default function UploadVideo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    subjectName: '',
    description: '',
    category: 'Musicians',
    cloudinaryUrl: '',
    cloudinaryPublicId: '',
    thumbnailUrl: '',
    thumbnailPublicId: '',
    featured: false,
    status: 'published',
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('video', file);
      const { data } = await uploadVideoFile(formData, (event) => {
        setUploadProgress(Math.round((event.loaded * 100) / event.total));
      });
      setForm((prev) => ({ ...prev, cloudinaryUrl: data.url, cloudinaryPublicId: data.publicId }));
      setMessage({ text: 'Video uploaded successfully', type: 'success' });
    } catch {
      setMessage({ text: 'Video upload failed', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);
      const { data } = await uploadThumbnail(formData);
      setForm((prev) => ({ ...prev, thumbnailUrl: data.url, thumbnailPublicId: data.publicId }));
      setMessage({ text: 'Thumbnail uploaded', type: 'success' });
    } catch {
      setMessage({ text: 'Thumbnail upload failed', type: 'error' });
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().replace(/,/g, '');
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      await createVideo({ ...form, tags });
      setMessage({ text: 'Biography Published Successfully', type: 'success' });
      setTimeout(() => navigate('/admin/videos'), 1500);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Publish failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-bebas text-3xl tracking-wider text-off-white mb-2">UPLOAD VIDEO</h1>
      <div className="w-16 h-1 bg-neon mb-8" />

      {message.text && (
        <div className={`mb-6 p-3 border font-mono text-sm ${
          message.type === 'success'
            ? 'bg-neon/10 border-neon/30 text-neon'
            : 'bg-neon-red/10 border-neon-red/30 text-neon-red'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-6">
        {/* Video file */}
        <div>
          <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
            Video File
          </label>
          <div className="border-2 border-dashed border-dark-border rounded-lg p-8 text-center hover:border-neon/30 transition-colors">
            <input type="file" accept="video/mp4,video/mov,video/avi,video/webm" onChange={handleVideoUpload} className="hidden" id="video-upload" />
            <label htmlFor="video-upload" className="cursor-pointer">
              <svg className="w-10 h-10 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="font-mono text-sm text-gray-500">Drag & drop or click to upload</p>
              <p className="font-mono text-xs text-gray-600 mt-1">MP4, MOV, AVI, WEBM</p>
            </label>
          </div>
          {uploading && (
            <div className="mt-3">
              <div className="w-full bg-dark border border-dark-border rounded-full h-3">
                <div className="bg-neon h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="font-mono text-xs text-neon mt-1">{uploadProgress}%</p>
            </div>
          )}
          {form.cloudinaryUrl && (
            <div className="mt-3">
              <video src={form.cloudinaryUrl} controls className="w-full max-w-md rounded border border-dark-border" />
            </div>
          )}
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
            Thumbnail
          </label>
          <div className="border-2 border-dashed border-dark-border rounded-lg p-6 text-center hover:border-neon/30 transition-colors">
            <input type="file" accept="image/jpg,image/jpeg,image/png,image/webp" onChange={handleThumbnailUpload} className="hidden" id="thumb-upload" />
            <label htmlFor="thumb-upload" className="cursor-pointer font-mono text-sm text-gray-500">
              Click to upload thumbnail (JPG, PNG, WEBP)
            </label>
          </div>
          {form.thumbnailUrl && (
            <img src={form.thumbnailUrl} alt="Thumbnail" className="mt-3 w-40 rounded border border-dark-border" />
          )}
        </div>

        {/* Title + Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Title *</label>
            <input
              type="text" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Biography title e.g. The Untold Story of..."
              className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white placeholder-gray-600 focus:outline-none focus:border-neon font-mono text-sm"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Subject Name *</label>
            <input
              type="text" required value={form.subjectName}
              onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
              placeholder="Who is this biography about?"
              className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white placeholder-gray-600 focus:outline-none focus:border-neon font-mono text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
            placeholder="Full biography description..."
            className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white placeholder-gray-600 focus:outline-none focus:border-neon font-mono text-sm resize-y"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-neon/10 border border-neon/30 text-neon font-mono text-xs rounded-full">
                {tag}
                <button type="button" onClick={() => removeTag(i)} className="hover:text-neon-red">&times;</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Type tag and press Enter"
            className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white placeholder-gray-600 focus:outline-none focus:border-neon font-mono text-sm"
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox" checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-5 h-5 accent-neon"
            />
            <span className="font-mono text-sm text-gray-400 uppercase tracking-wider">Featured Video</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.status === 'published'}
              onChange={(e) => setForm({ ...form, status: e.target.checked ? 'published' : 'draft' })}
              className="w-5 h-5 accent-neon"
            />
            <span className="font-mono text-sm text-gray-400 uppercase tracking-wider">Published</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving || !form.cloudinaryUrl}
          className="btn-neon px-8 py-3 disabled:opacity-50"
        >
          {saving ? 'PUBLISHING...' : 'PUBLISH BIOGRAPHY'}
        </button>
      </form>
    </div>
  );
}
