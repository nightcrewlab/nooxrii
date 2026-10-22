// Returns the visitor's country code (ISO 3166-1 alpha-2) from Vercel's edge header.
// Used by the site to open in English for anyone connecting from outside Türkiye.
module.exports = (req, res) => {
  const country = String(req.headers['x-vercel-ip-country'] || '').toUpperCase().slice(0, 2);
  res.setHeader('Cache-Control', 'private, no-store');
  res.status(200).json({ country: /^[A-Z]{2}$/.test(country) ? country : null });
};
