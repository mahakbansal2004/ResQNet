// import mongoose from "mongoose";

// const donationSchema = new mongoose.Schema(
//   {
//     type: {
//       type: String,
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//     contactInfo: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// const Donation = mongoose.model("Donation", donationSchema);

// export default Donation;



import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
