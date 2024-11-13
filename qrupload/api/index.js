const { put } = require('@vercel/blob');
const multer = require('multer');
const upload = multer();  // Multer middleware to handle file uploads

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    // Use multer middleware to handle file uploads in serverless function
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to upload file', details: err.message });
      }

      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        // Upload the file to Vercel Blob
        const blob = await put(file.originalname, file.buffer, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN, // Token stored in environment variables
        });

        // Respond with the URL of the uploaded blob
        return res.status(200).json({
          url: blob.url,
        });
      } catch (error) {
        console.error('Error uploading to Vercel Blob:', error);
        return res.status(500).json({
          error: 'Error uploading file',
          details: error.message,  // Include error message for debugging
        });
      }
    });
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
