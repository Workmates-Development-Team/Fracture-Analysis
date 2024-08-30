import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },

  age: { type: String, required: true },  // Updated age field to Number type
  
  address: {  // New address field
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  },

  details: { type: String},
  isDeleted: { type: Boolean, default: false },
  isRadio: { type: Boolean, default: false },
  isDoctor: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  radioName:{type: String},
  doctorName:{type: String},
  doctorRemarks:{type: String}
  
 
}, {
  timestamps: true,
});

// Password hash middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }



  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};



export default mongoose.model("Users", userSchema);
