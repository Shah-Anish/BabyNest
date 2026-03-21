import ChildProfile from "../model/ChildProfile.js";
import mongoose from "mongoose";

// Create a new child profile
export const createChild = async (req, res) => {
  try {
    const { parentId, name, birthDate, gender, medicalConditions, allergies } = req.body;

    // Validate required fields
    if (!parentId || !name || !birthDate || !gender) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: parentId, name, birthDate, gender"
      });
    }

    // Validate parentId format
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent ID format"
      });
    }

    // Create new child profile
    const childProfile = await ChildProfile.create({
      parentId,
      name,
      birthDate,
      gender,
      medicalConditions: medicalConditions || [],
      allergies: allergies || []
    });

    res.status(201).json({
      success: true,
      message: "Child profile created successfully",
      data: childProfile
    });
  } catch (error) {
    console.error("Error creating child profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create child profile",
      error: error.message
    });
  }
};

// Get all children by parent ID
export const getChildrenByParent = async (req, res) => {
  try {
    const { parentId } = req.params;

    // Validate parentId format
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent ID format"
      });
    }

    const children = await ChildProfile.find({ parentId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: children.length,
      data: children
    });
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch children",
      error: error.message
    });
  }
};

// Get a single child by ID
export const getChildById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    const child = await ChildProfile.findById(id).populate("parentId", "name email");

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child profile not found"
      });
    }

    res.status(200).json({
      success: true,
      data: child
    });
  } catch (error) {
    console.error("Error fetching child:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch child profile",
      error: error.message
    });
  }
};

// Update a child profile
export const updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    // Prevent updating parentId
    if (updateData.parentId) {
      return res.status(400).json({
        success: false,
        message: "Parent ID cannot be updated"
      });
    }

    const updatedChild = await ChildProfile.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedChild) {
      return res.status(404).json({
        success: false,
        message: "Child profile not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Child profile updated successfully",
      data: updatedChild
    });
  } catch (error) {
    console.error("Error updating child:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update child profile",
      error: error.message
    });
  }
};

// Delete a child profile
export const deleteChild = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid child ID format"
      });
    }

    const deletedChild = await ChildProfile.findByIdAndDelete(id);

    if (!deletedChild) {
      return res.status(404).json({
        success: false,
        message: "Child profile not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Child profile deleted successfully",
      data: deletedChild
    });
  } catch (error) {
    console.error("Error deleting child:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete child profile",
      error: error.message
    });
  }
};
