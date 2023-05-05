import nextConnect from 'next-connect';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const handler = nextConnect();

handler.use((req, res, next) => {
    if (req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
        console.log("UPLOAD.handler.use --> req.method === 'POST' && req.head");
        const form = new formidable.IncomingForm();
        form.maxFileSize = 100 * 1024 * 1024;
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error parsing form data:', err);
                res.status(500).json({ error: err.message });
            } else {
                req.body = fields;
                req.files = files;
                next();
            }
        });
    } else {
        next();
    }
});

handler.post((req, res) => {
    const file = req.files.file;
    const newFilePath = path.join('public/images', file.name);
    console.log("UPLOAD.handler.post((req, res) => {");
    fs.rename(file.path, newFilePath, (err) => {
        if (err) {
            console.error('Server error:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ filePath: `/images/${file.name}` });
        }
    });
});

export default handler;
