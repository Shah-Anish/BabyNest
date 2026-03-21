import MedicalDocument from "../model/MedicalDocument.js";
import mongoose from "mongoose";

// Upload a document
export const uploadDocument = async (req, res) => {
  try {
    const { visitId, fileUrl, fileType } = req.body;

    if (!visitId || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide visitId and fileUrl"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID format"
      });
    }

    const document = await MedicalDocument.create({
      visitId,
      fileUrl,
      fileType
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload document",
      error: error.message
    });
  }
};

// Get all documents by visit ID
export const getDocumentsByVisit = async (req, res) => {
  try {
    const { visitId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID format"
      });
    }

    const documents = await MedicalDocument.find({ visitId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
      error: error.message
    });
  }
};

// Delete a document
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID format"
      });
    }

    const document = await MedicalDocument.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
      data: document
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete document",
      error: error.message
    });
  }
};
