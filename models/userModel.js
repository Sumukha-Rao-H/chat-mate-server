module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        uid: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        displayName: {
            type: DataTypes.STRING,
        },
        photoUrl: {
            type: DataTypes.TEXT,
            defaultValue: "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
        },
        publicKey: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    }, {
        timestamps: true,
    });

    return User;
};
