import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const upload = multer({ dest: 'uploads/' });

const handler = nextConnect();

handler.use(upload.single('file'));

handler.post((req, res) => {
    const file = req.file;
    const newFilePath = path.join('public/images', file.originalname);

    fs.rename(file.path, newFilePath, (err) => {
        if (err) {
            console.error("Error renaming file:", err);
            res.status(500).json({ error: 'Failed to save file', details: err.message });
        } else {
            res.status(200).json({ filePath: `/images/${file.originalname}` });
        }
    });

});

export default handler;