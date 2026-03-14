import { useState, useEffect } from 'react';
import {
  getVideos, updateVideo, deleteVideo,
  uploadVideoFile, uploadThumbnail,
} from '../../api';

const CATEGORIES = ['Musicians', 'Athletes', 'Hustlers', 'Icons', 'Politicians'];
const PER_PAGE = 20;

export default function ManageVideos() {
  const [videos, setVideos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFeatured, setFilterFeatured] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selected, setSelected] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editTags, setEditTags] = useState([]);
  const [editTagInput, setEditTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, [page, sortBy]);

  const fetchVideos = async () => {
    try {
      const params = { page, limit: PER_PAGE, sort: sortBy === 'views' ? 'views' : undefined };
      if (search) params.search = search;
      if (filterCategory) params.category = filterCategory;
      const { data } = await getVideos(params);
      let vids = data.videos || [];
      if (filterStatus) vids = vids.filter((v) => (v.status || 'published') === filterStatus);
      if (filterFeatured === 'yes') vids = vids.filter((v) => v.featured);
      if (filterFeatured === 'no') vids = vids.filter((v) => !v.featured);
      setVideos(vids);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVideos();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('DELETE THIS BIOGRAPHY?\nThis cannot be undone.')) return;
    try {
      await deleteVideo(id);
      setMessage('Video deleted');
      fetchVideos();
    } catch {
      setMessage('Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return;
    if (!window.confirm(`Delete ${selected.length} video(s)? This cannot be undone.`)) return;
    try {
      await Promise.all(selected.map((id) => deleteVideo(id)));
      setSelected([]);
      setMessage(`${selected.length} videos deleted`);
      fetchVideos();
    } catch {
      setMessage('Bulk delete failed');
    }
  };

  const handleBulkStatus = async (status) => {
    if (!selected.length) return;
    try {
      await Promise.all(selected.map((id) => updateVideo(id, { status })));
      setSelected([]);
      setMessage(`${selected.length} videos ${status === 'published' ? 'published' : 'unpublished'}`);
      fetchVideos();
    } catch {
      setMessage('Bulk update failed');
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === videos.length) setSelected([]);
    else setSelected(videos.map((v) => v._id));
  };

  const openEdit = (video) => {
    setEditingVideo(video._id);
    setEditForm({
      title: video.title,
      subjectName: video.subjectName,
      description: video.description || '',
      category: video.category,
      cloudinaryUrl: video.cloudinaryUrl,
      cloudinaryPublicId: video.cloudinaryPublicId || '',
      thumbnailUrl: video.thumbnailUrl || '',
      thumbnailPublicId: video.thumbnailPublicId || '',
      featured: video.featured || false,
      status: video.status || 'published',
    });
    setEditTags(video.tags || []);
    setEditTagInput('');
  };

  const handleEditVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      fd.append('video', file);
      const { data } = await uploadVideoFile(fd, (ev) => {
        setUploadProgress(Math.round((ev.loaded * 100) / ev.total));
      });
      setEditForm((p) => ({ ...p, cloudinaryUrl: data.url, cloudinaryPublicId: data.publicId }));
    } catch { /* */ }
    setUploading(false);
  };

  const handleEditThumbUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('thumbnail', file);
      const { data } = await uploadThumbnail(fd);
      setEditForm((p) => ({ ...p, thumbnailUrl: data.url, thumbnailPublicId: data.publicId }));
    } catch { /* */ }
  };

  const handleEditTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = editTagInput.trim().replace(/,/g, '');
      if (tag && !editTags.includes(tag)) setEditTags([...editTags, tag]);
      setEditTagInput('');
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateVideo(editingVideo, { ...editForm, tags: editTags });
      setMessage('Video updated');
      setEditingVideo(null);
      fetchVideos();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <h1 className="font-bebas text-3xl tracking-wider text-off-white mb-2">MANAGE VIDEOS</h1>
      <div className="w-16 h-1 bg-neon mb-6" />

      {message && (
        <div className="mb-4 p-3 bg-neon/10 border border-neon/30 text-neon text-sm font-mono">
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or subject..."
            className="px-4 py-2 bg-dark border border-dark-border text-off-white placeholder-gray-600 focus:outline-none focus:border-neon font-mono text-sm w-56"
          />
          <button type="submit" className="btn-neon px-4 py-2 text-sm">SEARCH</button>
        </form>
        <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-dark border border-dark-border text-off-white font-mono text-sm">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-dark border border-dark-border text-off-white font-mono text-sm">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select value={filterFeatured} onChange={(e) => { setFilterFeatured(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-dark border border-dark-border text-off-white font-mono text-sm">
          <option value="">Featured?</option>
          <option value="yes">Featured</option>
          <option value="no">Not Featured</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 bg-dark border border-dark-border text-off-white font-mono text-sm">
          <option value="newest">Newest</option>
          <option value="views">Most Views</option>
          <option value="title">Title</option>
        </select>
        <button type="button" onClick={() => { setSearch(''); setFilterCategory(''); setFilterStatus(''); setFilterFeatured(''); setSortBy('newest'); setPage(1); }}
          className="font-mono text-xs text-gray-500 px-3 py-2 hover:text-off-white">CLEAR</button>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex gap-3 mb-4 p-3 bg-dark-card border border-neon/20 rounded">
          <span className="font-mono text-sm text-neon">{selected.length} selected</span>
          <button onClick={handleBulkDelete} className="font-mono text-xs text-neon-red border border-neon-red/30 px-3 py-1 hover:bg-neon-red/10">DELETE</button>
          <button onClick={() => handleBulkStatus('published')} className="font-mono text-xs text-neon border border-neon/30 px-3 py-1 hover:bg-neon/10">PUBLISH</button>
          <button onClick={() => handleBulkStatus('draft')} className="font-mono text-xs text-gray-400 border border-dark-border px-3 py-1 hover:bg-dark-border/30">UNPUBLISH</button>
        </div>
      )}

      {/* Video table */}
      <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="p-4"><input type="checkbox" checked={selected.length === videos.length && videos.length > 0} onChange={toggleAll} className="accent-neon" /></th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Thumbnail</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Title</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Subject</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Category</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Views</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Status</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Featured</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Date</th>
                <th className="font-mono text-xs text-gray-500 uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v._id} className="border-b border-dark-border/50 hover:bg-dark-border/20">
                  <td className="p-4"><input type="checkbox" checked={selected.includes(v._id)} onChange={() => toggleSelect(v._id)} className="accent-neon" /></td>
                  <td className="p-4">
                    {v.thumbnailUrl ? (
                      <img src={v.thumbnailUrl} alt="" className="w-16 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-10 bg-dark-border rounded flex items-center justify-center">
                        <span className="text-gray-600 text-xs">N/A</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-gray-300 text-sm max-w-[200px] truncate">{v.title}</td>
                  <td className="p-4 font-bebas text-gold text-lg">{v.subjectName}</td>
                  <td className="p-4"><span className="font-mono text-xs text-neon uppercase">{v.category}</span></td>
                  <td className="p-4 font-mono text-sm text-gray-400">{v.views?.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`font-mono text-xs px-2 py-1 rounded ${(v.status || 'published') === 'published' ? 'bg-neon/10 text-neon' : 'bg-gray-800 text-gray-500'}`}>
                      {(v.status || 'published').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">{v.featured && <span className="text-gold text-xs font-mono">FEATURED</span>}</td>
                  <td className="p-4 font-mono text-xs text-gray-500">{new Date(v.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(v)} className="font-mono text-xs text-neon border border-neon/30 px-3 py-1 hover:bg-neon/10">EDIT</button>
                      <button onClick={() => handleDelete(v._id)} className="font-mono text-xs text-neon-red border border-neon-red/30 px-3 py-1 hover:bg-neon-red/10">DELETE</button>
                    </div>
                  </td>
                </tr>
              ))}
              {videos.length === 0 && (
                <tr><td colSpan={10} className="p-8 text-center text-gray-500 font-mono">No videos found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`font-mono text-sm px-3 py-1 border ${p === page ? 'border-neon text-neon bg-neon/10' : 'border-dark-border text-gray-500 hover:text-off-white'}`}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingVideo && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-dark-card border border-dark-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bebas text-2xl tracking-wider text-off-white">EDIT BIOGRAPHY</h2>
              <button onClick={() => setEditingVideo(null)} className="text-gray-500 hover:text-off-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Subject Name *</label>
                  <input type="text" required value={editForm.subjectName} onChange={(e) => setEditForm({ ...editForm, subjectName: e.target.value })}
                    className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm" />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Title *</label>
                  <input type="text" required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm" />
                </div>
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={4}
                  className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm resize-y" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Category *</label>
                  <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Status</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white focus:outline-none focus:border-neon font-mono text-sm">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              {/* Tags */}
              <div>
                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editTags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-neon/10 border border-neon/30 text-neon font-mono text-xs rounded-full">
                      {tag}<button type="button" onClick={() => setEditTags(editTags.filter((_, j) => j !== i))} className="hover:text-neon-red">&times;</button>
                    </span>
                  ))}
                </div>
                <input type="text" value={editTagInput} onChange={(e) => setEditTagInput(e.target.value)} onKeyDown={handleEditTagKeyDown}
                  placeholder="Type tag and press Enter"
                  className="w-full px-4 py-2 bg-dark border border-dark-border text-off-white placeholder-gray-600 focus:outline-none focus:border-neon font-mono text-sm" />
              </div>
              {/* Video upload */}
              <div>
                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Video File</label>
                <input type="file" accept="video/*" onChange={handleEditVideoUpload}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border file:border-dark-border file:text-neon file:bg-dark file:font-mono file:text-xs file:uppercase file:cursor-pointer" />
                {uploading && (
                  <div className="mt-2">
                    <div className="w-full bg-dark border border-dark-border rounded-full h-3">
                      <div className="bg-neon h-full rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="font-mono text-xs text-neon mt-1">{uploadProgress}%</p>
                  </div>
                )}
                {editForm.cloudinaryUrl && <p className="font-mono text-xs text-neon mt-1 truncate">{editForm.cloudinaryUrl}</p>}
              </div>
              {/* Thumbnail upload */}
              <div>
                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">Thumbnail</label>
                <input type="file" accept="image/*" onChange={handleEditThumbUpload}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border file:border-dark-border file:text-neon file:bg-dark file:font-mono file:text-xs file:uppercase file:cursor-pointer" />
                {editForm.thumbnailUrl && <img src={editForm.thumbnailUrl} alt="Thumbnail" className="mt-2 w-40 rounded border border-dark-border" />}
              </div>
              {/* Featured toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editForm.featured} onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })} className="w-5 h-5 accent-neon" />
                <span className="font-mono text-sm text-gray-400 uppercase tracking-wider">Featured Biography</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="btn-neon px-8 py-3 disabled:opacity-50">{saving ? 'SAVING...' : 'UPDATE'}</button>
                <button type="button" onClick={() => setEditingVideo(null)} className="font-mono text-sm text-gray-500 border border-dark-border px-6 py-3 hover:text-off-white">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
