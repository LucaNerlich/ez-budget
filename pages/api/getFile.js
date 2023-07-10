import axios from "axios";

export default async function handler(req, res) {
    try {
        const responseData = await axios.get(req.body.url)
        res.status(200);
        res.send(responseData.data);
    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}
