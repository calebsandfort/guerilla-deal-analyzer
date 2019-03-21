const property = (sequelize, DataTypes) => {
    const property = sequelize.define('property', {
        zillow_propertyId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        zillow_path: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 100,
            validate: {
                notEmpty: true,
            },
        },
        zillow_url: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 100,
            validate: {
                notEmpty: true,
            },
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        sqft: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        beds: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        baths: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 100,
            validate: {
                notEmpty: true,
            },
        },
    }, {
        tableName: 'properties'
    });

    property.associate = models => {
    //     property.hasMany(models.Play, { onDelete: 'CASCADE' });
    //     property.hasMany(models.ScoreBar, { onDelete: 'CASCADE' });
    //     property.belongsTo(models.Season, { onDelete: 'CASCADE' });
    //     property.belongsTo(models.SeasonMonth, { onDelete: 'CASCADE' });
    };

    return property;
};

export default property;