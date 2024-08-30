import jwt from "jsonwebtoken";
import Users from './models.js'
import { z } from "zod";
import { registerSchema, loginSchema } from "../Middlewares/inputValidation.js";
export const register = async (req, res) => {
    try {
      const { name, email, password,age,address } = registerSchema.parse(req.body);
  
      let User = await Users.findOne({ email });
      if (User) {
        return res.status(400).json({ message: "This mail already exists" });
      }
  
      User = new Users({ name, email, password,age,address });
      await User.save();
  
     
  
      res.status(201).json({
      
        User: { id: User._id, name: User.name, email: User.email },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0]?.message || "Validation error",
        });
      }
      console.log(error)
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const login = async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
  
      const User = await Users.findOne({ email });
      if (!User) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const isMatch = await User.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      res.status(200).json({
        token,
        User: { _id: User._id, name: User.name, email: User.email },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0]?.message || "Validation error",
        });
      }
  
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  };
  export const getProfile = async (req, res) => {
  
    try{
      const user = req.user;
      user.password = undefined;
     
      res.status(200).json({
        success: true,
        user,});
       
    }
    catch(error){
      return res.status(500).json({
        success: false,
        msg: "Internal server error",
      });
    }
  };

  // export const getActiveUsers = async (req, res) => {
  //   try {
  //     const activeUsers = await Users.find({ isRadio: false,isDoctor: false }).select('-password');
  //     res.status(200).json({
  //       success: true,
  //       users: activeUsers,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // };

  export const getActiveUsers = async (req, res) => {
    try {
      const { email } = req.query;
  
      // Base query to find non-radio and non-doctor users
      let query = { isRadio: false, isDoctor: false };
  
      // If email is provided, modify the query to include email matching
      if (email) {
        query.email = { $regex: email, $options: "i" }; // 'i' for case-insensitive match
      }
  
      // Execute the query and exclude the password field from the result
      const activeUsers = await Users.find(query).select('-password');
  
      // Respond with the list of users
      res.status(200).json({
        success: true,
        users: activeUsers,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

 

// Controller function to get all users where isRadio is false
// export const getNonRadioUsers = async (req, res) => {
//   try {
//     const users = await Users.find({ isRadio: false, isDeleted: false }); // Find users where isRadio is false and not deleted
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching users", error: error.message });
//   }
// };

export const getNonRadioUsers = async (req, res) => {
  try {
    const { email } = req.query;

    // Create a regex pattern for partial, case-insensitive matches
    const emailPattern = email ? new RegExp(email, 'i') : null;

    // Build the query
    const query = {
      isRadio: false,
      isDoctor: false,
    };

    if (emailPattern) {
      query.email = { $regex: emailPattern };
    }

    const activeUsers = await Users.find(query).select('-password');
    res.status(200).json({
      success: true,
      users: activeUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// export const getNonDoctorUsers = async (req, res) => {
//   try {
//     const users = await Users.find({ isDoctor: false, isDeleted: false,isRadio:true }); // Find users where isDoctor is false and not deleted
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching users", error: error.message });
//   }
// };

export const getNonDoctorUsers = async (req, res) => {
  try {
    const { email } = req.query;

    // Base query to find non-doctor, non-deleted users who are radiologists
    let query = { isDoctor: false, isDeleted: false, isRadio: true };

    // If email is provided, add a case-insensitive regex search for email
    if (email) {
      query.email = { $regex: email, $options: "i" }; // 'i' for case-insensitive match
    }

    // Execute the query
    const users = await Users.find(query);

    // Respond with the list of users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};


export const updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you're passing the user ID as a URL parameter
    const { details, radioName} = req.body; // Extracting details from the request body

    const user = await Users.findByIdAndUpdate(
      userId,
      { details: details, isRadio: true, radioName: radioName }, // Update details and set isRadio to true
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User details updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user details", error: error.message });
  }
};

export const updateDoctorRemarks = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you're passing the user ID as a URL parameter
    const { doctorRemarks, doctorName} = req.body; // Extracting doctorRemarks from the request body

    const user = await Users.findByIdAndUpdate(
      userId,
      { doctorRemarks: doctorRemarks, isDoctor: true, doctorName:doctorName }, // Update doctorRemarks and set isDoctor to true
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Doctor remarks updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating doctor remarks", error: error.message });
  }
};