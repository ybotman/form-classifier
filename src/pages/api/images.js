import nextConnect from "next-connect";
import axios from "axios";
import { apiUrl } from "../../apiConfig";


const handler = nextConnect();


handler.get(async (req, res) => {
    console.log("IMAGES > handler.get", req, res)
    try {
        console.log("IMAGES> handler.get TRY");
        const { data } = await axios.get(`${apiUrl}/images`);
        res.json(data);
    } catch (error) {
        console.error("GET /api/images error:", error.message);
        console.error("Full error object:", error);
        res.status(500).json({ message: "An error occurred while fetching images." });
    }
});

handler.post(async (req, res) => {
    console.log("IMAGES >>handler.post")
    try {
        const newImage = JSON.parse(req.body);
        const { data } = await axios.post(apiUrl, newImage);
        res.json(data);
    } catch (error) {
        console.error("POST /api/images error:", error.message);
        console.error("Full error object:", error);
        res.status(500).json({ message: "An error occurred while posting the image." });
    }
});

handler.put(async (req, res) => {
    console.log("IMAGES > >>handler.put")
    try {
        const updatedImage = JSON.parse(req.body);
        const { data } = await axios.put(`${apiUrl}/${updatedImage.id}`, updatedImage);
        res.json(data);
    } catch (error) {
        console.error("PUT /api/images error:", error.message);
        console.error("Full error object:", error);
        res.status(500).json({ message: "An error occurred while updating the image." });
    }
});

export default handler;
