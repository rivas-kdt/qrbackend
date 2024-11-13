const express = require('express');
const multer = require('multer');
const { put } = require('@vercel/blob');
const app = express();
const cors = require('cors');
const upload = multer();  // Multer middleware to handle file uploads

app.use(cors());

// API endpoint to handle file upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;

    // If no file is uploaded, return a JSON error response
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload the file to Vercel Blob
    const blob = await put(file.originalname, file.buffer, {
      access: 'public',
    });

    // Respond with the URL of the uploaded blob
    return res.json({
      url: blob.url,
    });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);

    // Send a proper JSON response with error details
    return res.status(500).json({
      error: 'Error uploading file',
      details: error.message,  // Include error message for debugging
    });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
