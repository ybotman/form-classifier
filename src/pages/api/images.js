import nextConnect from "next-connect";
import axios from "axios";
import { apiUrl } from "./apiConfig";


const handler = nextConnect();

console.log("image.js")

handler.get(async (req, res) => {
<<<<<<< HEAD
    console.log("axios.put", req, res)
=======
    console.log(".get")
>>>>>>> 67fbc19a5f75849c45aebc0b038283542f7a0aed
    try {
        const { data } = await axios.get(`${apiUrl}/images`);
        res.json(data);
    } catch (error) {
        console.error("GET /api/images error:", error.message);
        console.error("Full error object:", error);
        res.status(500).json({ message: "An error occurred while fetching images." });
    }
});


handler.post(async (req, res) => {
<<<<<<< HEAD
    console.log("axios.post")
=======
    console.log(".post")
>>>>>>> 67fbc19a5f75849c45aebc0b038283542f7a0aed
    const newImage = JSON.parse(req.body);
    const { data } = await axios.post(apiUrl, newImage);
    res.json(data);
});

handler.put(async (req, res) => {
<<<<<<< HEAD
    console.log("axios.put")
=======
    console.log(".put")
>>>>>>> 67fbc19a5f75849c45aebc0b038283542f7a0aed
    const updatedImage = JSON.parse(req.body);
    const { data } = await axios.put(`${apiUrl}/${updatedImage.id}`, updatedImage);
    res.json(data);
});

export default handler;
