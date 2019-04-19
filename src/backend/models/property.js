import { statuses } from "../../common/enums/statuses";

const property = (sequelize, DataTypes) => {
  const property = sequelize.define(
    "property",
    {
      zillow_propertyId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      zillow_path: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 100,
        validate: {
          notEmpty: true
        }
      },
      zillow_url: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 100,
        validate: {
          notEmpty: true
        }
      },
      streetAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 50,
        validate: {
          notEmpty: true
        }
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 50,
        validate: {
          notEmpty: true
        }
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 10,
        validate: {
          notEmpty: true
        }
      },
      zipcode: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 10,
        validate: {
          notEmpty: true
        }
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 125,
        validate: {
          notEmpty: true
        }
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      sqft: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      lotSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      beds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      baths: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      zestimate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      price_to_zestimate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      date_listed: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      year_built: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      zillow_status: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 20,
        validate: {
          notEmpty: true
        }
      },
      image_urls: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      date_sold: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      notes: {
        type: DataTypes.TEXT
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: statuses.ACTIVE.value
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: true,
        length: 50
      }
    },
    {
      tableName: "properties"
    }
  );

  property.associate = models => {
    //     property.hasMany(models.Play, { onDelete: 'CASCADE' });
    //     property.hasMany(models.ScoreBar, { onDelete: 'CASCADE' });
    //     property.belongsTo(models.Season, { onDelete: 'CASCADE' });
    //     property.belongsTo(models.SeasonMonth, { onDelete: 'CASCADE' });
  };

  return property;
};

export default property;
