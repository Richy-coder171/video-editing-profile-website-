import { useEffect, useMemo, useState } from 'react';
import { ImageUp, LoaderCircle, Save, UploadCloud, X } from 'lucide-react';
import { portfolioTypes } from '../../data/portfolioMeta.js';
import { api } from '../../services/api.js';

const blankForm = {
  title: '',
  description: '',
  type: 'reel',
  category: '',
  projectDate: '',
  tools: '',
  mediaUrl: '',
  thumbnailUrl: '',
  cloudinaryPublicId: '',
  thumbnailPublicId: '',
  resourceType: 'video',
  sortOrder: '',
  featured: false
};

const parseLimitMb = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const MAX_IMAGE_SIZE_MB = parseLimitMb(import.meta.env.VITE_MAX_IMAGE_SIZE_MB, 25);
const MAX_VIDEO_SIZE_MB = parseLimitMb(import.meta.env.VITE_MAX_VIDEO_SIZE_MB, 100);
const imageExtensionPattern = /\.(avif|gif|heic|heif|jpe?g|png|webp)$/i;
const videoExtensionPattern = /\.(avi|m4v|mkv|mov|mp4|mpeg|mpg|webm)$/i;

const bytesFromMb = (value) => Number(value) * 1024 * 1024;

const formatFileSize = (bytes) => {
  const size = bytes / (1024 * 1024);
  return `${size >= 10 ? size.toFixed(1) : size.toFixed(2)}MB`;
};

const getFileKind = (file) => {
  if (!file) {
    return '';
  }

  if (file.type?.startsWith('image/')) {
    return 'image';
  }

  if (file.type?.startsWith('video/')) {
    return 'video';
  }

  if (imageExtensionPattern.test(file.name || '')) {
    return 'image';
  }

  if (videoExtensionPattern.test(file.name || '')) {
    return 'video';
  }

  return '';
};

const getExpectedMediaKind = (type) => (type === 'reel' || type === 'video' ? 'video' : 'image');

const getFileValidationError = (file, expectedKind) => {
  if (!file) {
    return '';
  }

  const detectedKind = getFileKind(file);

  if (!detectedKind) {
    return 'Unsupported file type. Use a supported image or video file.';
  }

  if (expectedKind && detectedKind !== expectedKind) {
    return `${expectedKind === 'video' ? 'Reels and videos' : 'Design uploads'} must use ${expectedKind} files.`;
  }

  const limitMb = detectedKind === 'video' ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;

  if (file.size > bytesFromMb(limitMb)) {
    const label = detectedKind === 'video' ? 'video' : 'image';
    const cloudinaryNote =
      detectedKind === 'video' ? ' Your current Cloudinary account rejects videos over this limit.' : '';

    return `This ${label} is ${formatFileSize(file.size)}. ${label === 'video' ? 'Videos' : 'Images'} must be ${limitMb}MB or smaller.${cloudinaryNote}`;
  }

  return '';
};

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
        projectDate: editingItem.projectDate || '',
        tools: (editingItem.tools || []).join(', '),
        mediaUrl: editingItem.mediaUrl || '',
        thumbnailUrl: editingItem.thumbnailUrl || '',
        cloudinaryPublicId: editingItem.cloudinaryPublicId || '',
        thumbnailPublicId: editingItem.thumbnailPublicId || '',
        resourceType: editingItem.resourceType || 'image',
        sortOrder: editingItem.sortOrder ?? '',
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

  const handleTypeChange = (value) => {
    updateField('type', value);

    if (mediaFile) {
      setError(getFileValidationError(mediaFile, getExpectedMediaKind(value)));
    }
  };

  const handleMediaFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    const validationError = getFileValidationError(selectedFile, getExpectedMediaKind(form.type));

    if (validationError) {
      setMediaFile(null);
      setError(validationError);
      event.target.value = '';
      return;
    }

    setMediaFile(selectedFile);
    setError('');
  };

  const handleThumbnailFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    const validationError = getFileValidationError(selectedFile, 'image');

    if (validationError) {
      setThumbnailFile(null);
      setError(validationError);
      event.target.value = '';
      return;
    }

    setThumbnailFile(selectedFile);
    setError('');
  };

  const savePortfolioAsset = async () => {
    const payload = new FormData();

    payload.append('title', form.title);
    payload.append('description', form.description);
    payload.append('type', form.type);
    payload.append('category', form.category);
    payload.append('project_date', form.projectDate);
    payload.append('tools', form.tools);
    payload.append('featured', String(form.featured));
    payload.append('sort_order', form.sortOrder);

    if (mediaFile) {
      payload.append('file', mediaFile);
    }

    if (thumbnailFile) {
      payload.append('thumbnail', thumbnailFile);
    }

    const { data } = await api.post('/upload', payload, {
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

  const updatePortfolioItem = async (payload) => {
    return api.put(`/portfolio/${editingItem.id}`, payload);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setProgress(0);

    try {
      const mediaValidationError = getFileValidationError(mediaFile, getExpectedMediaKind(form.type));
      const thumbnailValidationError = getFileValidationError(thumbnailFile, 'image');

      if (mediaValidationError || thumbnailValidationError) {
        setError(mediaValidationError || thumbnailValidationError);
        setSaving(false);
        return;
      }

      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        category: form.category,
        project_date: form.projectDate,
        tools: form.tools
          .split(',')
          .map((tool) => tool.trim())
          .filter(Boolean),
        featured: form.featured,
        sort_order: form.sortOrder,
        thumbnail_url: form.thumbnailUrl
      };

      if (editingItem?.id && !mediaFile) {
        if (thumbnailFile) {
          setError('Choose a media file too when replacing a thumbnail file, or update the thumbnail URL field.');
          setSaving(false);
          return;
        }

        await updatePortfolioItem(payload);
      } else {
        if (!mediaFile) {
          setError('Choose a media file to upload.');
          setSaving(false);
          return;
        }

        await savePortfolioAsset();

        if (editingItem?.id) {
          await api.delete(`/portfolio/${editingItem.id}`);
        }
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
          <select className="input" value={form.type} onChange={(event) => handleTypeChange(event.target.value)}>
            {portfolioTypes.map((option) => (
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
          Date
          <input
            className="input"
            type="date"
            value={form.projectDate}
            onChange={(event) => updateField('projectDate', event.target.value)}
          />
        </label>
        <label className="field-label">
          Tools used
          <input className="input" value={form.tools} onChange={(event) => updateField('tools', event.target.value)} placeholder="Premiere Pro, Photoshop" />
        </label>
        <label className="field-label">
          Sort order
          <input
            className="input"
            type="number"
            inputMode="numeric"
            value={form.sortOrder}
            onChange={(event) => updateField('sortOrder', event.target.value)}
            placeholder="0"
          />
        </label>
      </div>

      <label className="field-label mt-4">
        Description
        <textarea className="input min-h-28 resize-y" value={form.description} onChange={(event) => updateField('description', event.target.value)} required />
      </label>

      {editingItem && (
        <label className="field-label mt-4">
          Thumbnail URL
          <input
            className="input"
            value={form.thumbnailUrl}
            onChange={(event) => updateField('thumbnailUrl', event.target.value)}
          />
        </label>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="field-label">
          Media file
          <span className="file-drop">
            <UploadCloud size={20} />
            <span>{mediaFile ? mediaFile.name : 'Choose video or image'}</span>
            <input
              className="sr-only"
              type="file"
              accept="image/*,.avif,.heic,.heif,video/mp4,video/webm,video/quicktime,.mov,.m4v,.avi,.mkv"
              onChange={handleMediaFileChange}
            />
          </span>
        </label>
        <label className="field-label">
          Thumbnail
          <span className="file-drop">
            <ImageUp size={20} />
            <span>{thumbnailFile ? thumbnailFile.name : 'Optional poster image'}</span>
            <input
              className="sr-only"
              type="file"
              accept="image/*,.avif,.heic,.heif"
              onChange={handleThumbnailFileChange}
            />
          </span>
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
