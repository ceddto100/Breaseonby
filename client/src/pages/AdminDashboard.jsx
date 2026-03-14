import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import {
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  uploadVideoFile,
  uploadThumbnail,
} from '../api';

const CATEGORIES = ['Musicians', 'Athletes', 'Hustlers', 'Icons', 'Politicians'];
const EMPTY_FORM = {
  title: '',
  subjectName: '',
  description: '',
  category: 'Musicians',
  tags: '',
  cloudinaryUrl: '',
  cloudinaryPublicId: '',
  thumbnailUrl: '',
  thumbnailPublicId: '',
  featured: false,
};

export default function AdminDashboard() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [mostWatched, setMostWatched] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchVideos();
  }, [isAdmin, navigate]);

  const fetchVideos = async () => {
    try {
      const { data } = await getVideos({ limit: 100 });
      const allVideos = data.videos || [];
      setVideos(allVideos);
      const views = allVideos.reduce((sum, v) => sum + (v.views || 0), 0);
      setTotalViews(views);
      const top = allVideos.reduce(
        (max, v) => ((v.views || 0) > (max?.views || 0) ? v : max),
        null
      );
      setMostWatched(top);
    } catch (err) {
      console.error('Failed to load videos:', err);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', file);
      const { data } = await uploadVideoFile(formData, (event) => {
        const percent = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(percent);
      });
      setForm((prev) => ({
        ...prev,
        cloudinaryUrl: data.url,
        cloudinaryPublicId: data.publicId,
      }));
      setMessage('Video uploaded successfully');
    } catch (err) {
      setMessage('Video upload failed');
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
      setForm((prev) => ({
        ...prev,
        thumbnailUrl: data.url,
        thumbnailPublicId: data.publicId,
      }));
      setMessage('Thumbnail uploaded');
    } catch (err) {
      setMessage('Thumbnail upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await updateVideo(editingId, payload);
        setMessage('Video updated');
      } else {
        await createVideo(payload);
        setMessage('Video created');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowModal(false);
      fetchVideos();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (video) => {
    setForm({
      title: video.title,
      subjectName: video.subjectName,
      description: video.description || '',
      category: video.category,
      tags: (video.tags || []).join(', '),
      cloudinaryUrl: video.cloudinaryUrl,
      cloudinaryPublicId: video.cloudinaryPublicId || '',
      thumbnailUrl: video.thumbnailUrl || '',
      thumbnailPublicId: video.thumbnailPublicId || '',
      featured: video.featured || false,
    });
    setEditingId(video._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video permanently?')) return;
    try {
      await deleteVideo(id);
      fetchVideos();
      setMessage('Video deleted');
    } catch (err) {
      setMessage('Delete failed');
    }
  };

  const openNewForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — UNCOVERED</title>
      </Helmet>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-bebas text-4xl tracking-wider text-off-white">
              ADMIN DASHBOARD
            </h1>
            <div className="w-20 h-1 bg-neon mt-2" />
          </div>
          <button
            onClick={() => { logout(); navigate('/admin/login'); }}
            className="font-mono text-xs text-gray-500 border border-dark-border px-4 py-2 hover:text-neon-red hover:border-neon-red transition-all"
          >
            LOGOUT
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">
              Total Videos
            </p>
            <p className="font-bebas text-4xl text-neon mt-2">{videos.length}</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">
              Total Views
            </p>
            <p className="font-bebas text-4xl text-gold mt-2">
              {totalViews.toLocaleString()}
            </p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-wider">
              Most Watched
            </p>
            <p className="font-bebas text-2xl text-neon-red mt-2 truncate">
              {mostWatched?.subjectName || '—'}
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-3 bg-neon/10 border border-neon/30 text-neon text-sm font-mono">
            {message}
          </div>
        )}

        {/* Upload button */}
        <div className="mb-6">
          <button onClick={openNewForm} className="btn-neon px-6 py-3">
            + UPLOAD NEW BIOGRAPHY
          </button>
        </div>

        {/* Video table */}
        <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">
                    Subject
                  </th>
                  <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">
                    Title
                  </th>
                  <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">
                    Category
                  </th>
                  <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">
                    Views
                  </th>
                  <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">
                    Featured
                  </th>
                  <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video._id} className="border-b border-dark-border/50 hover:bg-dark-border/20">
                    <td className="p-4 font-bebas text-gold text-lg">
                      {video.subjectName}
                    </td>
                    <td className="p-4 text-gray-300 text-sm">{video.title}</td>
                    <td className="p-4">
                      <span className="font-mono text-xs text-neon uppercase">
                        {video.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-400">
                      {video.views?.toLocaleString()}
                    </td>
                    <td className="p-4">
                      {video.featured && (
                        <span className="text-gold text-xs font-mono">FEATURED</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(video)}
                          className="font-mono text-xs text-neon border border-neon/30 px-3 py-1 hover:bg-neon/10 transition-colors"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDelete(video._id)}
                          className="font-mono text-xs text-neon-red border border-neon-red/30 px-3 py-1 hover:bg-neon-red/10 transition-colors"
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 font-mono">
                      No videos yet. Upload your first biography.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-dark-card border border-dark-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bebas text-2xl tracking-wider text-off-white">
                {editingId ? 'EDIT BIOGRAPHY' : 'UPLOAD NEW BIOGRAPHY'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-off-white text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={form.subjectName}
                    onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                    className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="hip-hop, 90s, new york"
                    className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white placeholder-gray-600 focus:outline-none focus:border-neon font-mono text-sm"
                  />
                </div>
              </div>

              {/* Video upload */}
              <div>
                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Video File
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border file:border-dark-border file:text-neon file:bg-dark file:font-mono file:text-xs file:uppercase file:cursor-pointer hover:file:border-neon"
                />
                {uploading && (
                  <div className="mt-2">
                    <div className="w-full bg-dark border border-dark-border rounded-full h-3">
                      <div
                        className="bg-neon h-full rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="font-mono text-xs text-neon mt-1">{uploadProgress}%</p>
                  </div>
                )}
                {form.cloudinaryUrl && (
                  <p className="font-mono text-xs text-neon mt-1 truncate">
                    {form.cloudinaryUrl}
                  </p>
                )}
              </div>

              {/* Thumbnail upload */}
              <div>
                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border file:border-dark-border file:text-neon file:bg-dark file:font-mono file:text-xs file:uppercase file:cursor-pointer hover:file:border-neon"
                />
                {form.thumbnailUrl && (
                  <div className="mt-2">
                    <img
                      src={form.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-40 h-auto rounded border border-dark-border"
                    />
                  </div>
                )}
              </div>

              {/* Featured toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-5 h-5 accent-neon"
                />
                <span className="font-mono text-sm text-gray-400 uppercase tracking-wider">
                  Featured Biography
                </span>
              </label>

              {/* Manual URL input (fallback) */}
              <div>
                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Video URL (manual)
                </label>
                <input
                  type="text"
                  value={form.cloudinaryUrl}
                  onChange={(e) => setForm({ ...form, cloudinaryUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white placeholder-gray-600 focus:outline-none focus:border-neon font-mono text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving || !form.cloudinaryUrl}
                  className="btn-neon px-8 py-3 disabled:opacity-50"
                >
                  {saving ? 'SAVING...' : editingId ? 'UPDATE' : 'PUBLISH'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="font-mono text-sm text-gray-500 border border-dark-border px-6 py-3 hover:text-off-white transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
