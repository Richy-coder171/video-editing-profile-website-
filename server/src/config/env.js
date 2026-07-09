const requiredServerEnv = [
  'JWT_SECRET',
  'ADMIN_EMAIL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'SUPABASE_URL',
  'SUPABASE_SECRET_KEY'
];

const placeholderPatterns = [
  /^replace_with/i,
  /^change_me/i,
  /^your_/i,
  /^you@example\.com$/i,
  /your-project-id/i,
  /supabase_service_role_key/i,
  /cloudinary_cloud_name/i,
  /cloudinary_api_key/i,
  /cloudinary_api_secret/i
];

const isBlank = (value) => !String(value || '').trim();

const hasPlaceholderValue = (value) => {
  const normalizedValue = String(value || '').trim();
  return placeholderPatterns.some((pattern) => pattern.test(normalizedValue));
};

const throwMissingEnv = (name) => {
  throw new Error(`Missing required environment variable: ${name}`);
};

const throwPlaceholderEnv = (name) => {
  throw new Error(`Environment variable ${name} still has a placeholder value. Fill it in server/.env.`);
};

const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const validateServerEnv = () => {
  requiredServerEnv.forEach((name) => {
    if (isBlank(process.env[name])) {
      throwMissingEnv(name);
    }
  });

  if (isBlank(process.env.ADMIN_PASSWORD) && isBlank(process.env.ADMIN_PASSWORD_HASH)) {
    throwMissingEnv('ADMIN_PASSWORD or ADMIN_PASSWORD_HASH');
  }

  [...requiredServerEnv, 'ADMIN_PASSWORD', 'ADMIN_PASSWORD_HASH'].forEach((name) => {
    if (!isBlank(process.env[name]) && hasPlaceholderValue(process.env[name])) {
      throwPlaceholderEnv(name);
    }
  });

  if (!isValidHttpUrl(process.env.SUPABASE_URL)) {
    throw new Error('SUPABASE_URL must be a valid HTTP or HTTPS URL, for example https://your-project-id.supabase.co');
  }
};

export { validateServerEnv };
