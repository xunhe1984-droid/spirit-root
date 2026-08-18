import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

export default function Seo({ title, description, image, type = 'website' }) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title}` : 'Spirit Root — Cultivation Theory & Practice';
  const desc =
    description ||
    'A personal knowledge site compiling cultivation theory and related thought, collecting practitioner writings, and recording personal study notes and everyday reflections.';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="canonical" href={`https://spiritroot.online${pathname}`} />
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </Helmet>
  );
}
