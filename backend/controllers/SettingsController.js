import Settings from "../model/Settings.js";

// Get all settings (Admin)
export const getSettings = async (req, res) => {
  try {
    const { key } = req.query;

    let filter = {};
    if (key) {
      filter.key = key;
    }

    const settings = await Settings.find(filter)
      .sort({ createdAt: -1 });

    // If searching for a specific key, return the single setting
    if (key && settings.length === 1) {
      return res.status(200).json({
        success: true,
        data: settings[0]
      });
    }

    res.status(200).json({
      success: true,
      count: settings.length,
      data: settings
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message
    });
  }
};

// Update settings (Admin)
export const updateSettings = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide key and value"
      });
    }

    // Upsert: update if exists, create if doesn't exist
    const setting = await Settings.findOneAndUpdate(
      { key },
      { key, value },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: setting
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message
    });
  }
};
