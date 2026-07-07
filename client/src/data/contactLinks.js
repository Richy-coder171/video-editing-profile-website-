import { ExternalLink, Instagram, Mail, MessageCircle, Youtube } from 'lucide-react';

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || '';
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL || '';

const primaryContactLinks = [
  contactEmail
    ? {
        label: contactEmail,
        href: `mailto:${contactEmail}`,
        icon: Mail
      }
    : null,
  whatsappUrl
    ? {
        label: 'WhatsApp',
        href: whatsappUrl,
        icon: MessageCircle
      }
    : null
].filter(Boolean);

const socialLinks = [
  { label: 'Instagram', href: import.meta.env.VITE_INSTAGRAM_URL, icon: Instagram },
  { label: 'YouTube', href: import.meta.env.VITE_YOUTUBE_URL, icon: Youtube },
  { label: 'Behance', href: import.meta.env.VITE_BEHANCE_URL, icon: ExternalLink },
  { label: 'Dribbble', href: import.meta.env.VITE_DRIBBBLE_URL, icon: ExternalLink }
].filter((link) => Boolean(link.href));

export { contactEmail, primaryContactLinks, socialLinks };
