import { useEffect, useMemo, useState } from 'react';
import { ImageUp, LoaderCircle, Save, UploadCloud, X } from 'lucide-react';
import { api } from '../../services/api.js';

const blankForm = {
  title: '',
  description: '',
  type: 'reel',
  category: '',
  tools: '',
  mediaUrl: '',
  thumbnailUrl: '',
  cloudinaryPublicId: '',
  featured: false
};

const typeOptions = [
  { label: 'Reel', value: 'reel' },
  { label: 'Video', value: 'video' },
  { label: 'Photoshop', value: 'photoshop' },
  { label: 'Illustrator', value: 'illustrator' }
];

const PortfolioForm = ({ editingItem, onSaved, onCancel }) => {
  const [form, setForm] = useState(blankForm);
  const [mediaFile, setMediaFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title || '',
        description: editingItem.description || '',
        type: editingItem.type || 'reel',
        category: editingItem.category || '',
        tools: (editingItem.tools || []).join(', '),
        mediaUrl: editingItem.mediaUrl || '',
        thumbnailUrl: editingItem.thumbnailUrl || '',
        cloudinaryPublicId: editingItem.cloudinaryPublicId || '',
        featured: Boolean(editingItem.featured)
      });
    } else {
      setForm(blankForm);
    }

    setMediaFile(null);
    setThumbnailFile(null);
    setProgress(0);
    setError('');
  }, [editingItem]);

  const previewUrl = useMemo(() => {
    if (mediaFile) {
      return URL.createObjectURL(mediaFile);
    }

    return form.thumbnailUrl || form.mediaUrl || '';
  }, [form.mediaUrl, form.thumbnailUrl, mediaFile]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const uploadFile = async (file, type) => {
    const payload = new FormData();
    payload.append('file', file);

    const endpoint = type === 'video' ? '/upload/video' : '/upload/image';
    const { data } = await api.post(endpoint, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 0,
      onUploadProgress: (event) => {
        if (event.total) {
          setProgress(Math.round((event.loaded * 100) / event.total));
        }
      }
    });

    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setProgress(0);

    try {
      let payload = {
        ...form,
        tools: form.tools
          .split(',')
          .map((tool) => tool.trim())
          .filter(Boolean)
      };

      if (mediaFile) {
        const uploadType = form.type === 'reel' || form.type === 'video' ? 'video' : 'image';
        const uploaded = await uploadFile(mediaFile, uploadType);
        payload = {
          ...payload,
          mediaUrl: uploaded.mediaUrl,
          thumbnailUrl: uploaded.thumbnailUrl || payload.thumbnailUrl,
          cloudinaryPublicId: uploaded.cloudinaryPublicId
        };
      }

      if (thumbnailFile) {
        const uploadedThumbnail = await uploadFile(thumbnailFile, 'image');
        payload.thumbnailUrl = uploadedThumbnail.mediaUrl;
      }

      if (editingItem?._id) {
        await api.put(`/portfolio/${editingItem._id}`, payload);
      } else {
        await api.post('/portfolio', payload);
      }

      onSaved?.();
      setForm(blankForm);
      setMediaFile(null);
      setThumbnailFile(null);
      setProgress(0);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save portfolio item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="rounded-lg border border-white/10 bg-white/[0.045] p-5" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Portfolio item</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white">
            {editingItem ? 'Edit project' : 'Upload new work'}
          </h2>
        </div>
        {editingItem && (
          <button className="icon-button" type="button" onClick={onCancel} aria-label="Cancel edit">
            <X size={18} />
          </button>
        )}
      </div>

      {error && <p className="mt-4 rounded-lg border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{error}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="field-label">
          Title
          <input className="input" value={form.title} onChange={(event) => updateField('title', event.target.value)} required />
        </label>
        <label className="field-label">
          Type
          <select className="input" value={form.type} onChange={(event) => updateField('type', event.target.value)}>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Category
          <input className="input" value={form.category} onChange={(event) => updateField('category', event.target.value)} required />
        </label>
        <label className="field-label">
          Tools used
          <input className="input" value={form.tools} onChange={(event) => updateField('tools', event.target.value)} placeholder="Premiere Pro, Photoshop" />
        </label>
      </div>

      <label className="field-label mt-4">
        Description
        <textarea className="input min-h-28 resize-y" value={form.description} onChange={(event) => updateField('description', event.target.value)} required />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="field-label">
          Media file
          <span className="file-drop">
            <UploadCloud size={20} />
            <span>{mediaFile ? mediaFile.name : 'Choose video or image'}</span>
            <input className="sr-only" type="file" accept="image/*,video/mp4,video/webm,video/quicktime" onChange={(event) => setMediaFile(event.target.files?.[0] || null)} />
          </span>
        </label>
        <label className="field-label">
          Thumbnail
          <span className="file-drop">
            <ImageUp size={20} />
            <span>{thumbnailFile ? thumbnailFile.name : 'Optional poster image'}</span>
            <input className="sr-only" type="file" accept="image/*" onChange={(event) => setThumbnailFile(event.target.files?.[0] || null)} />
          </span>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="field-label">
          Media URL
          <input className="input" value={form.mediaUrl} onChange={(event) => updateField('mediaUrl', event.target.value)} required={!mediaFile} />
        </label>
        <label className="field-label">
          Thumbnail URL
          <input className="input" value={form.thumbnailUrl} onChange={(event) => updateField('thumbnailUrl', event.target.value)} />
        </label>
      </div>

      {previewUrl && (
        <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-black">
          {form.type === 'video' || form.type === 'reel' ? (
            <video className="h-64 w-full object-contain" src={previewUrl} controls muted playsInline />
          ) : (
            <img className="h-64 w-full object-cover" src={previewUrl} alt="Upload preview" />
          )}
        </div>
      )}

      {progress > 0 && (
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-electric transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      <label className="mt-5 flex items-center gap-3 text-sm text-white/70">
        <input
          type="checkbox"
          className="h-4 w-4 accent-electric"
          checked={form.featured}
          onChange={(event) => updateField('featured', event.target.checked)}
        />
        Featured project
      </label>

      <button className="btn-primary mt-6 w-full justify-center" type="submit" disabled={saving}>
        {saving ? <LoaderCircle className="animate-spin" size={18} /> : <Save size={18} />}
        {saving ? 'Saving...' : editingItem ? 'Update project' : 'Save project'}
      </button>
    </form>
  );
};

export default PortfolioForm;
