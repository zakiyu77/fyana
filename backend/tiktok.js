const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.json({ success: false, message: "URL tidak boleh kosong" });

  try {
    const encodedParams = new URLSearchParams();
    encodedParams.set("url", videoUrl);
    encodedParams.set("hd", "1");

    const response = await axios.post("https://tikwm.com/api/", encodedParams, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Cookie: "current_language=en",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    res.json({ success: true, platform: "tiktok", data: response.data.data });
  } catch (err) {
    res.json({ success: false, message: "Gagal mengambil data TikTok", error: err.message });
  }
});

module.exports = router;