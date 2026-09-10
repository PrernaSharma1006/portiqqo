const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

// Base uploads directory
const uploadBaseDir = path.join(__dirname, '..', 'uploads');
const directories = ['images', 'videos', 'documents', 'resumes', 'avatars', 'general'];

directories.forEach(dir => {
  const dirPath = path.join(uploadBaseDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Configure Cloudinary if credentials are provided
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key' &&
  process.env.CLOUDINARY_API_SECRET && 
  process.env.CLOUDINARY_API_SECRET !== 'your_cloudinary_api_secret';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Multer Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = req.body?.folder || 'general';
    if (file.mimetype.startsWith('image/')) {
      folder = req.body?.folder === 'avatars' ? 'avatars' : 'images';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'videos';
    } else if (file.mimetype === 'application/pdf' || file.mimetype.includes('document')) {
      folder = req.body?.folder === 'resumes' ? 'resumes' : 'documents';
    }

    const dest = path.join(uploadBaseDir, folder);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const sanitizedOriginal = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 30);
    cb(null, `${sanitizedOriginal}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  const allowedDocTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes, ...allowedDocTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: Images, Videos, PDFs, Word docs.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

// Helper for single file upload with error handling
const handleSingleUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File size limit exceeded (Max: 50MB)' });
      }
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// Process uploaded file (upload to Cloudinary if available, otherwise return local URL)
const processUploadedFile = async (req, file) => {
  const relPath = path.relative(uploadBaseDir, file.path).replace(/\\/g, '/');
  
  if (isCloudinaryConfigured) {
    try {
      const resourceType = file.mimetype.startsWith('video/') ? 'video' : (file.mimetype.startsWith('image/') ? 'image' : 'raw');
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `portiqqo/${req.body?.folder || 'uploads'}`,
        resource_type: resourceType
      });

      // Clean up local temp file after upload to Cloudinary
      try { fs.unlinkSync(file.path); } catch (_) {}

      return {
        url: result.secure_url,
        publicId: result.public_id,
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        storage: 'cloudinary'
      };
    } catch (cErr) {
      console.warn('Cloudinary upload failed, falling back to local file:', cErr.message);
    }
  }

  // Local storage URL
  const serverUrl = process.env.API_URL || process.env.APP_URL || 'http://localhost:5001';
  const fileUrl = `${serverUrl}/uploads/${relPath}`;

  return {
    url: fileUrl,
    publicId: relPath,
    name: file.originalname,
    size: file.size,
    type: file.mimetype,
    storage: 'local'
  };
};

// Route: POST /api/upload/image
router.post('/image', handleSingleUpload, async (req, res) => {
  try {
    const file = req.files?.[0];
    if (!file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const fileInfo = await processUploadedFile(req, file);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileInfo.url,
      file: fileInfo,
      data: fileInfo
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Image upload failed' });
  }
});

// Route: POST /api/upload/video
router.post('/video', handleSingleUpload, async (req, res) => {
  try {
    const file = req.files?.[0];
    if (!file) {
      return res.status(400).json({ success: false, message: 'No video file provided' });
    }

    const fileInfo = await processUploadedFile(req, file);

    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      url: fileInfo.url,
      file: fileInfo,
      data: fileInfo
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Video upload failed' });
  }
});

// Route: POST /api/upload/pdf
router.post('/pdf', handleSingleUpload, async (req, res) => {
  try {
    const file = req.files?.[0];
    if (!file) {
      return res.status(400).json({ success: false, message: 'No PDF file provided' });
    }

    const fileInfo = await processUploadedFile(req, file);

    res.status(200).json({
      success: true,
      message: 'PDF uploaded successfully',
      url: fileInfo.url,
      file: fileInfo,
      data: fileInfo
    });
  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'PDF upload failed' });
  }
});

// Route: POST /api/upload/file (generic upload)
router.post('/file', handleSingleUpload, async (req, res) => {
  try {
    const file = req.files?.[0];
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const fileInfo = await processUploadedFile(req, file);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: fileInfo.url,
      file: fileInfo,
      data: fileInfo
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'File upload failed' });
  }
});

// Route: POST /api/upload/multiple
router.post('/multiple', handleSingleUpload, async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files provided' });
    }

    const uploadedFiles = [];
    for (const f of files) {
      const fileInfo = await processUploadedFile(req, f);
      uploadedFiles.push(fileInfo);
    }

    res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Multiple upload failed' });
  }
});

// Route: DELETE /api/upload/file
router.delete('/file', async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'Public ID or path required' });
    }

    // Try deleting from Cloudinary if configured
    if (isCloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (_) {}
    }

    // Try deleting local file
    const localFilePath = path.join(uploadBaseDir, publicId);
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (_) {}
    }

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete file' });
  }
});

module.exports = router;