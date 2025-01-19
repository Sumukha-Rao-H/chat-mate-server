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
