// api/gas.js - Vercel Serverless Function
export default async function handler(req, res) {
  // Mengambil URL GAS dari Vercel Environment Variables
  const GAS_URL = process.env.GAS_URL;
  
  if (!GAS_URL) {
    return res.status(500).json({ error: 'GAS_URL belum disetting di Vercel Environment Variables.' });
  }

  try {
    if (req.method === 'GET') {
      // Endpoint GET untuk mengambil statistik dari GAS
      const targetUrl = GAS_URL.includes("script.google.com") ? `${GAS_URL}?action=stats` : `${GAS_URL}/stats`;
      const response = await fetch(targetUrl);
      const data = await response.json();
      return res.status(200).json(data);
    } 
    else if (req.method === 'POST') {
      // Endpoint POST untuk menyimpan Log Eksperimen / Kuisioner ke GAS
      const targetUrl = GAS_URL.includes("script.google.com") ? GAS_URL : `${GAS_URL}/logs`;
      
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });
      
      // Biasanya Google Apps Script akan me-return respons HTTP 200/302.
      // Kita langsung tangkap bahwa eksekusi berhasil dan teruskan ke frontend
      return res.status(200).json({ status: 'success' });
    }
    else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
