const { sequelize, User} = require("../db");
const { Op } = require("sequelize");

const createOrUpdateUser = async (req, res) => {
    const { uid, email, name, picture } = req.user;

    try {
        const [user, created] = await User.findOrCreate({
            where: { uid },
            defaults: {
                email,
                displayName: name,
                photoUrl: picture,
            },
        });
        res.status(200).json({ user, created });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchUsers = async (req, res) => {
    const query = req.query.query; // Extract the search query from the request
    if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    try {
        // Search for users where displayName matches the query (case-insensitive)
        const users = await User.findAll({
            where: {
                displayName: {
                    [Op.iLike]: `%${query}%`, // Case-insensitive match
                },
            },
            attributes: ["uid","displayName","photoUrl"], // Only return displayName
        });

        res.status(200).json(users); // Send results back to the client
    } catch (error) {
        res.status(500).json({ message: "Error querying users", error: error.message });
    }
};

const updateDisplayName = async (req, res) => {
    const { uid, displayName } = req.body; // assuming displayName is passed in the body

    if (!displayName) {
        return res.status(400).json({ message: "displayName is required" });
    }

    try {
        // Find the user by UID
        const user = await User.findOne({ where: { uid } });

        if (user) {
            // Update the displayName field
            const updatedUser = await user.update({ displayName });

            res.status(200).json({ user: updatedUser });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDisplayName = async (req, res) => {
    const { uid } = req.query; // uid is expected in the URL params

    try {
        // Find the user by UID
        const user = await User.findOne({ where: { uid }, attributes: ['displayName'] });

        if (user) {
            res.status(200).json({ displayName: user.displayName });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//store public key into db
const storePublicKey = async (req, res) => {
    console.log("STORE PUBLIC KEY HIT");
    const { uid, publicKey } = req.body;

    try {
        const user = await User.findOne({ where: { uid } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.publicKey = publicKey;
        await user.save();

        res.status(200).json({ message: "Public key stored successfully" });
    } catch (error) {
        console.error("Error storing public key:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Retrieve the public key for a user
const getPublicKey = async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findOne({ where: { uid } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.publicKey) {
            return res.status(404).json({ message: "Public key not set for this user" });
        }

        res.status(200).json({ publicKey: user.publicKey });
    } catch (error) {
        console.error("Error retrieving public key:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createOrUpdateUser, searchUsers, storePublicKey, getPublicKey, updateDisplayName, getDisplayName };
