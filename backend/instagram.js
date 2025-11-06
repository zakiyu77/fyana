const express = require("express");
const axios = require("axios");
const qs = require("qs");
const cheerio = require("cheerio");

const router = express.Router();

async function instadl(url) {
    const data = qs.stringify({
        url: url,
        v: "3",
        lang: "en"
    });

    const config = {
        method: "POST",
        url: "https://api.downloadgram.org/media",
        headers: {
            "User-Agent": "Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
            "Content-Type": "application/x-www-form-urlencoded",
            "accept-language": "id-ID",
            "referer": "https://downloadgram.org/",
            "origin": "https://downloadgram.org",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "priority": "u=0",
            "te": "trailers"
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        const $ = cheerio.load(response.data);
        let mediaInfo = {};

        if ($("video").length) {
            mediaInfo.videoUrl = $("video source").attr("src");
            mediaInfo.downloadUrl = $('a[download]').attr("href");
            mediaInfo.posterUrl = $("video").attr("poster");
        } else if ($("img").length) {
            mediaInfo.imageUrl = $("img").attr("src");
            mediaInfo.downloadUrl = $('a[download]').attr("href");
        }

        for (let key in mediaInfo) {
            if (mediaInfo.hasOwnProperty(key) && mediaInfo[key]) {
                mediaInfo[key] = mediaInfo[key].replace(/\\"/g, '');
            }
        }

        return mediaInfo;
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

// Endpoint GET /api/instagram
router.get("/", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ success: false, error: "Url is required" });

    try {
        const media = await instadl(url);
        if (media.error) return res.json({ success: false, error: media.error });

        res.json({ success: true, result: media });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;