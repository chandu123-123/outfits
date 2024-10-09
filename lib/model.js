const { Schema, model, default: mongoose } = require("mongoose");


const userlogi= new Schema(
  { image:{type:String},
   links: [
    {
      imageLink: { type: String, required: true },
      productLink: { type: String, required: true }
    }
  ]
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

export const items =
  mongoose.models.Heroine || new mongoose.model("Heroine", userlogi);

