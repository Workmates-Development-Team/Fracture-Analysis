import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    userid: { type: String},
    name:{type:String},
    age:{type:Number},
    address: { 
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true }
      },
    bone_type:{type:String},
    result:{type:String},
    details: { type: String},
    image: { type: Buffer}
}, { timestamps: true });

const report = mongoose.model('Report', reportSchema); 

export default report;