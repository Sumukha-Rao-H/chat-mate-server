const { UserSettings } = require("../db"); // Adjust the path as needed
const { User } = require("../db");

const getUserSettings = async (req, res) => {
  const { uid } = req.query;

  try {
    if (!uid) {
      return res.status(400).json({ message: "Missing uid parameter." });
    }

    // Find settings for the given user
    let settings = await UserSettings.findOne({ where: { userId: uid } });

    // If settings do not exist, create default settings
    if (!settings) {
      settings = await UserSettings.create({
        userId: uid,
        profileImageUrl: null,    // Default value (no image)
        notificationsEnabled: true,
        profileVisibility: "Public",
      });
    }

    return res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

const updateUserSettings = async (req, res) => {
  const { uid, displayName, profileImageUrl, notificationsEnabled, profileVisibility } = req.body;

  try {
    if (!uid) {
      return res.status(400).json({ message: "Missing uid in request body." });
    }

    // Find the existing settings for the user
    let settings = await UserSettings.findOne({ where: { userId: uid } });

    if (!settings) {
      // Create new settings if none exist
      settings = await UserSettings.create({
        userId: uid,
        profileImageUrl: profileImageUrl || null,
        notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : true,
        profileVisibility: profileVisibility || "Public",
      });
    } else {
      // Update only provided fields
      if (profileImageUrl !== undefined) {
        settings.profileImageUrl = profileImageUrl;

        // Update the User table when profileImageUrl changes
        await User.update(
          { photoUrl: profileImageUrl },
          { where: { uid } }
        );
      }
      if (notificationsEnabled !== undefined) settings.notificationsEnabled = notificationsEnabled;
      if (profileVisibility !== undefined) settings.profileVisibility = profileVisibility;

      await settings.save();
    }

    return res.status(200).json(settings);
  } catch (error) {
    console.error("Error updating user settings:", error);
    return res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = {
  getUserSettings,
  updateUserSettings,
};
