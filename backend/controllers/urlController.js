import { customAlphabet } from "nanoid";
import Link from "../models/linkModel.js";

const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  7
);

const shortUrl = async (req, res) => {
  const { longUrl, customAlias, expirationDate } = req.body;
  const userId = req.user._id;
  if (!longUrl) {
    return res.status(400).json({ message: "longUrl is required" });
  }

  try {
    let shortCode;
    if (customAlias) {
      const existing = await Link.findOne({ shortCode: customAlias });
      if (existing) {
        return res.status(400).json({ message: "Custom alias already in use" });
      }
      shortCode = customAlias;
    } else {
      let generatedCode;
      let existing = true;
      while (existing) {
        generatedCode = nanoid();
        existing = await Link.findOne({ shortCode: generatedCode });
      }
      shortCode = generatedCode;
    }

    const newLink = new Link({
      originalUrl: longUrl,
      shortCode: shortCode,
      userId: userId,
      expiresAt: expirationDate ? new Date(expirationDate) : null,
    });

    await newLink.save();

    const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
    res.status(201).json({
      originalUrl: newLink.originalUrl,
      shortUrl: shortUrl,
      shortCode: newLink.shortCode,
      createdAt: newLink.createdAt,
      expiresAt: newLink.expiresAt,
    });
  } catch (error) {
    console.error("Error creating short link:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const redirectUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const link = await Link.findOne({ shortCode: shortCode });

    if (!link) {
      return res.status(404).send("Link not found");
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      return res.status(410).send("Link expired");
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    res.redirect(301, link.originalUrl);

    Link.updateOne(
      { _id: link._id },
      {
        $inc: { clickCount: 1 },
        $push: {
          analytics: {
            ipAddress: ipAddress,
            userAgent: userAgent,
            timestamp: new Date(),
          },
        },
      }
    )
      .exec()
      .catch((err) => console.error("Error logging analytics:", err));
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).send("Server error");
  }
};

const urlAnalytics = async (req, res) => {
  const userId = req.user._id;

  try {
    const links = await Link.find({ userId: userId }).sort({ createdAt: -1 });

    const analyticsData = links.map((link) => {
      const shortUrlBase = `${req.protocol}://${req.get("host")}/`;
      const isExpired = link.expiresAt && link.expiresAt < new Date();
      return {
        _id: link._id,
        originalUrl: link.originalUrl,
        shortUrl: shortUrlBase + link.shortCode,
        shortCode: link.shortCode,
        totalClicks: link.clickCount,
        createdAt: link.createdAt,
        expiresAt: link.expiresAt,
        expirationStatus: isExpired
          ? "Expired"
          : link.expiresAt
          ? "Active"
          : "Never",
        // You might want to aggregate analytics further here for charts
        // e.g., clicks per day, device breakdown etc.
        // For now, just returning the raw list
        rawAnalytics: link.analytics,
      };
    });

    res.json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { shortUrl, redirectUrl, urlAnalytics};
