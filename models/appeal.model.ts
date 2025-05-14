import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
});

class Appeal extends Model {
  public id!: number;
  public theme!: string;
  public message!: string;
  public status!: "New" | "InProgress" | "Completed" | "Cancelled";
  public solution?: string;
  public cancelReason?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Appeal.init(
  {
    theme: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("New", "InProgress", "Completed", "Cancelled"),
      defaultValue: "New",
    },
    solution: { type: DataTypes.TEXT },
    cancelReason: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "appeal", timestamps: true },
);

export default Appeal;
