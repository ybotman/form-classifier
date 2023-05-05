import nextConnect from 'next-connect';
//import formidable from 'formidable';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const handler = nextConnect();
// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

handler.use(upload.single('file'));


handler.post((req, res) => {
    console.log("UPLOAD.handler.post: Request received");
    const file = req.file;
    const newFilePath = `/images/${file.filename}`;

    res.status(200).json({ filePath: newFilePath });
});

export default handler;

/* 
const processFormData = (req) => {
    console.log("function : processFormData");
    console.log("Content-Type:", req.headers["content-type"]);

    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            console.log("parsing");
            resolve({ body: fields, files });
        });
    });
};

handler.use(async (req, res, next) => {
    console.log("UPLOAD.handler.use: Request received");

    if (req.method === "POST" && req.headers["content-type"].startsWith("multipart/form-data")) {
        console.log("UPLOAD.handler.use: Processing form data");

        try {
            const formData = await processFormData(req);
            req.files = formData.files;
            req.body = formData.body;
            console.log("UPLOAD.handler.use: Form data processed");
        } catch (err) {
            console.error("UPLOAD.handler.use: Error processing form data", err);
            res.status(500).json({ error: "Error processing form data" });
            return;
        }
    }

    next();
});

handler.post((req, res) => {
    console.log("UPLOAD.handler.post: Request received");
    const file = req.files.file;
    const newFilePath = path.join('public/images', file.name);

    fs.rename(file.path, newFilePath, (err) => {
        console.log("Inside fs.rename callback");
        if (err) {
            console.error('Server error:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ filePath: `/images/${file.name}` });
        }
    });
});


export default handler;

*/

