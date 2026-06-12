// api/gemini.js - Vercel Serverless Function
module.exports = async function handler(req, res) {
  // Hanya menerima metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Mengambil API Key dari Vercel Environment Variables
  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ 
      error: { message: 'GEMINI_API_KEY belum disetting di Vercel Environment Variables.' } 
    });
  }

  try {
    // Meneruskan request ke Google Gemini API secara rahasia (Server-to-Server)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body) // Mengirimkan payload image/text dari frontend  
    });
    
    const data = await response.json();
    
    // Kembalikan respons dari Google ke frontend
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
}
