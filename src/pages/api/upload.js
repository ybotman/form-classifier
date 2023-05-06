import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

const handler = nextConnect();

handler.use((req, res, next) => {
    //  console.log('Request headers:', req.headers);
    req.rawBody = '';
    req.on('data', (chunk) => {
        req.rawBody += chunk;
    });
    req.on('end', () => {
        console.log('Raw request body:', req.rawBody);
        next();
    });
});

handler.use(upload.single('file'));

handler.post((req, res) => {
    console.log("UPLOAD.handler.post: Request received");
    const file = req.file;
    console.log("UPLOAD.handler.post:file", file);
    const newFilePath = path.join('public/images', file.originalname);
    console.log("UPLOAD.handler.post:newFilePath", newFilePath);
    fs.rename(file.path, newFilePath, (err) => {
        console.log("Inside fs.rename callback");
        if (err) {
            console.error('Server error:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ filePath: `/images/${file.originalname}` });
        }
    });
});

export default handler;
