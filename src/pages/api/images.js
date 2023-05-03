import nextConnect from "next-connect";
import axios from "axios";

const handler = nextConnect();

const apiUrl = "http://localhost:5000/images";

handler.get(async (req, res) => {
    try {
        const { data } = await axios.get(apiUrl);
        res.json(data);
    } catch (error) {
        console.error("GET /api/images error:", error.message);
        console.error("Full error object:", error);
        res.status(500).json({ message: "An error occurred while fetching images." });
    }
});


handler.post(async (req, res) => {
    const newImage = JSON.parse(req.body);
    const { data } = await axios.post(apiUrl, newImage);
    res.json(data);
});

handler.put(async (req, res) => {
    const updatedImage = JSON.parse(req.body);
    const { data } = await axios.put(`${apiUrl}/${updatedImage.id}`, updatedImage);
    res.json(data);
});

export default handler;
