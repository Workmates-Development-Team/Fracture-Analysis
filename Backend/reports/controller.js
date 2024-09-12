import Report from '../reports/model.js'

export const createReport = async (req, res) => {
    try {
      const { userid, name, age, address, bone_type, result, details, image } = req.body;
  
      // Validate required fields
      if (!userid || !name || !age || !address || !address.street || !address.city || !address.state || !address.zip || !bone_type || !result) {
        return res.status(400).json({ message: "All required fields must be filled." });
      }
  
      // Create new report instance
      const newReport = new Report({
        userid,
        name,
        age,
        address,
        bone_type,
        result,
        details,
        image
      });
  
      // Save to database
      const savedReport = await newReport.save();
      res.status(201).json(savedReport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Could not create report.' });
    }
  };

  export const getReportsByUserId = async (req, res) => {
    try {
      const { userid } = req.params; // Get the userid from the request params
      const reports = await Report.find({ userid }); // Find all reports with the given userid
  
      if (!reports || reports.length === 0) {
        return res.status(404).json({ message: "No reports found for this user." });
      }
  
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ message: "Server error while fetching reports", error });
    }
  };


  export const getReportById = async (req, res) => {
    try {
      const { reportId } = req.params; // Get the reportId from the request params
      const report = await Report.findById(reportId); // Find the report by its ID
  
      if (!report) {
        return res.status(404).json({ message: "Report not found." });
      }
  
      res.status(200).json(report);
    } catch (error) {
      res.status(500).json({ message: "Server error while fetching report", error });
    }
  };