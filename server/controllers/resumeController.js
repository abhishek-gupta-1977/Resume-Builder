import { Resume } from "../models/Resume.js";
import { GoogleGenAI } from "@google/genai";
import htmlPDF from "html-pdf-node";
import PDFDocument from "pdfkit";
import { Template } from "../models/Template.js";
// Initialize the modern Google Gen AI SDK client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/* ==========================================================================
   1 & 2 & 3 & 4. SUBMIT RAW DATA & GENERATE AI RESUME CONTENT
   ========================================================================== */
export const generateResumeAI = async (req, res) => {
  try {
    const { personalDetails, education, experience, projects, skills, title } =
      req.body;

    if (!personalDetails?.fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required to initialize a profile.",
      });
    }

    // System instruction prompt to enforce structured JSON responses
    const targetPrompt = `
      You are an expert technical resume builder. Review the following raw user data:
      Name: ${personalDetails.fullName}
      Target Skills: ${skills.join(", ")}
      Raw Experience: ${JSON.stringify(experience)}
      Raw Projects: ${JSON.stringify(projects)}

      Generate professional, metrics-driven, high-impact content for an elite resume.
      Provide the result strictly in valid JSON format matching this structure:
      {
        "professionalSummary": "A dynamic 3-4 sentence elevator pitch highlighting key skills and value.",
        "enhancedExperience": [
          {
            "company": "Company Name matching input",
            "role": "Role matching input",
            "bulletPoints": ["3 clear metric-driven action bullets starting with strong action verbs using the STAR method"]
          }
        ],
        "enhancedProjects": [
          {
            "title": "Project Title matching input",
            "aiBulletPoints": ["2 technical high-impact bullet points tracking engineering achievements"]
          }
        ],
        "roleBasedSuggestions": "Suggestions for missing keywords or next steps to optimize for ATS filters."
      }
    `;

    // Execute generation with structural safety configurations
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: targetPrompt,
      config: {
        responseMimeType: "application/json", // Forces output parsing correctness
      },
    });

    const parsedAiResult = JSON.parse(response.text);

    // Save the input data along with the AI enhancements into the database
    const newResume = new Resume({
      userId: req.user.id,
      title: title || "My Professional Resume",
      personalDetails,
      education,
      experience,
      projects,
      skills,
      aiFields: parsedAiResult,
    });

    await newResume.save();

    return res.status(201).json({
      success: true,
      message: "AI Resume generated and saved successfully.",
      data: newResume,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================================================
   5 & 6. UPDATE GENERATED RESUME CONTENT MANUALLY
   ========================================================================== */
export const updateResumeContent = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const updatePayload = req.body; // Contains modified aiFields or structural parameters

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId: req.user.id },
      { $set: updatePayload },
      { returnDocument: "after", runValidators: true },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume profile not found or unauthorized.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume documentation refreshed and verified successfully.",
      data: resume,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================================================
   7. EXPORT COMPILED RESUME DATA TO PDF
   ========================================================================== */

export const exportResumePdf = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Target profile document unavailable.",
      });
    }

    /* --------------------------------------------------------------------------
       Template style definitions
    -------------------------------------------------------------------------- */
    const getTemplateStyles = (templateName) => {
      const styles = {
        modern: {
          primaryColor: "#1e3a8a", // indigo-900
          secondaryColor: "#475569", // slate-600
          accentColor: "#666666",
          fontHeader: "Helvetica-Bold",
          fontSubheader: "Helvetica-Oblique",
          fontBody: "Helvetica",
          titleFontSize: 24,
          sectionFontSize: 14,
          bodyFontSize: 10,
          showBorderLines: true,
          layout: "standard",
        },
        classic: {
          primaryColor: "#2c3e50",
          secondaryColor: "#7f8c8d",
          accentColor: "#555555",
          fontHeader: "Times-Bold",
          fontSubheader: "Times-Italic",
          fontBody: "Times-Roman",
          titleFontSize: 22,
          sectionFontSize: 13,
          bodyFontSize: 10,
          showBorderLines: false,
          layout: "standard",
        },
        minimal: {
          primaryColor: "#000000",
          secondaryColor: "#333333",
          accentColor: "#666666",
          fontHeader: "Helvetica-Bold",
          fontSubheader: "Helvetica",
          fontBody: "Helvetica",
          titleFontSize: 20,
          sectionFontSize: 12,
          bodyFontSize: 9,
          showBorderLines: false,
          layout: "compact",
        },
        creative: {
          primaryColor: "#d97706", // amber-600
          secondaryColor: "#b45309", // orange-700
          accentColor: "#78350f", // amber-900
          fontHeader: "Helvetica-Bold",
          fontSubheader: "Helvetica-Oblique",
          fontBody: "Helvetica",
          titleFontSize: 28,
          sectionFontSize: 16,
          bodyFontSize: 10,
          showBorderLines: true,
          layout: "standard",
        },
        elegant: {
          primaryColor: "#7c3aed", // violet-600
          secondaryColor: "#a78bfa", // violet-400
          accentColor: "#4c1d95", // violet-900
          fontHeader: "Times-Bold",
          fontSubheader: "Times-Italic",
          fontBody: "Times-Roman",
          titleFontSize: 26,
          sectionFontSize: 15,
          bodyFontSize: 10,
          showBorderLines: true,
          layout: "standard",
        },
        tech: {
          primaryColor: "#0ea5e9", // sky-500
          secondaryColor: "#0284c7", // sky-600
          accentColor: "#082f49", // sky-950
          fontHeader: "Helvetica-Bold",
          fontSubheader: "Helvetica-Oblique",
          fontBody: "Helvetica",
          titleFontSize: 22,
          sectionFontSize: 13,
          bodyFontSize: 10,
          showBorderLines: false,
          layout: "standard",
        },
        executive: {
          primaryColor: "#0f172a", // slate-900
          secondaryColor: "#334155", // slate-700
          accentColor: "#1e293b", // slate-800
          fontHeader: "Helvetica-Bold",
          fontSubheader: "Helvetica",
          fontBody: "Helvetica",
          titleFontSize: 20,
          sectionFontSize: 12,
          bodyFontSize: 9,
          showBorderLines: false,
          layout: "compact",
        },
        fresh: {
          primaryColor: "#059669", // emerald-600
          secondaryColor: "#10b981", // emerald-500
          accentColor: "#064e3b", // emerald-900
          fontHeader: "Helvetica-Bold",
          fontSubheader: "Helvetica-Oblique",
          fontBody: "Helvetica",
          titleFontSize: 24,
          sectionFontSize: 14,
          bodyFontSize: 10,
          showBorderLines: true,
          layout: "standard",
        },
        dark: {
          primaryColor: "#ffffff", // white
          secondaryColor: "#cbd5e1", // slate-300
          accentColor: "#94a3b8", // slate-400
          fontHeader: "Helvetica-Bold",
          fontSubheader: "Helvetica",
          fontBody: "Helvetica",
          titleFontSize: 24,
          sectionFontSize: 14,
          bodyFontSize: 10,
          showBorderLines: false,
          layout: "standard",
          // Optionally set background? PDFKit doesn't support per-section easily, but you could add a background rectangle.
        },
      };
      return styles[templateName] || styles.modern;
    };

    const template = resume.template || "modern";
    const style = getTemplateStyles(template);

    // Initialize PDF document
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    // Set download headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resume.personalDetails.fullName.replace(/\s+/g, "_")}_Resume.pdf"`,
    );

    doc.pipe(res);

    /* --------------------------------------------------------------------------
       PDF GENERATION with selected template
    -------------------------------------------------------------------------- */

    // 1. Header Section (Name & Contact Details)
    doc
      .font(style.fontHeader)
      .fontSize(style.titleFontSize)
      .fillColor(style.primaryColor)
      .text(resume.personalDetails.fullName.toUpperCase(), { align: "left" });
    doc.moveDown(0.2);

    doc
      .font(style.fontBody)
      .fontSize(style.bodyFontSize)
      .fillColor(style.accentColor);
    const contactInfo = `${resume.personalDetails.email}  |  ${resume.personalDetails.phone || ""}  |  ${resume.personalDetails.location || ""}`;
    doc.text(contactInfo);

    if (resume.personalDetails.website) {
      doc.text(resume.personalDetails.website);
    }

    // Divider line (if template shows borders)
    if (style.showBorderLines) {
      doc
        .moveDown(0.5)
        .moveTo(40, doc.y)
        .lineTo(555, doc.y)
        .strokeColor(style.secondaryColor)
        .lineWidth(1.5)
        .stroke();
    }
    doc.moveDown(1);

    // Helper to render section titles
    const renderSectionTitle = (title) => {
      doc.moveDown(0.5);
      doc
        .font(style.fontHeader)
        .fontSize(style.sectionFontSize)
        .fillColor(style.primaryColor)
        .text(title.toUpperCase());
      if (style.showBorderLines) {
        doc
          .moveDown(0.2)
          .moveTo(40, doc.y)
          .lineTo(555, doc.y)
          .strokeColor("#dddddd")
          .lineWidth(1)
          .stroke();
      }
      doc.moveDown(0.5);
    };

    // 2. Professional Summary
    if (resume.aiFields?.professionalSummary) {
      renderSectionTitle("Professional Summary");
      doc
        .font(style.fontBody)
        .fontSize(style.bodyFontSize)
        .fillColor(style.accentColor)
        .text(resume.aiFields.professionalSummary, {
          align: "justify",
          lineGap: 3,
        });
      doc.moveDown(0.5);
    }

    // 3. Experience
    if (resume.aiFields?.enhancedExperience?.length > 0) {
      renderSectionTitle("Experience");
      resume.aiFields.enhancedExperience.forEach((exp) => {
        doc
          .font(style.fontHeader)
          .fontSize(style.bodyFontSize + 1)
          .fillColor(style.primaryColor)
          .text(exp.role);
        doc
          .font(style.fontSubheader)
          .fontSize(style.bodyFontSize)
          .fillColor(style.secondaryColor)
          .text(exp.company);

        doc
          .font(style.fontBody)
          .fontSize(style.bodyFontSize)
          .fillColor(style.accentColor);
        exp.bulletPoints.forEach((bullet) => {
          doc.text(`• ${bullet}`, {
            paragraphGap: 4,
            indent: 15,
            align: "justify",
          });
        });
        doc.moveDown(0.5);
      });
    }

    // 4. Projects
    if (resume.aiFields?.enhancedProjects?.length > 0) {
      renderSectionTitle("Projects");
      resume.aiFields.enhancedProjects.forEach((proj) => {
        doc
          .font(style.fontHeader)
          .fontSize(style.bodyFontSize + 1)
          .fillColor(style.primaryColor)
          .text(proj.title);

        doc
          .font(style.fontBody)
          .fontSize(style.bodyFontSize)
          .fillColor(style.accentColor);
        proj.aiBulletPoints.forEach((bullet) => {
          doc.text(`• ${bullet}`, {
            paragraphGap: 4,
            indent: 15,
            align: "justify",
          });
        });
        doc.moveDown(0.5);
      });
    }

    // 5. Skills
    if (resume.skills?.length > 0) {
      renderSectionTitle("Skills");
      doc
        .font(style.fontBody)
        .fontSize(style.bodyFontSize)
        .fillColor(style.accentColor)
        .text(resume.skills.join(", "), { lineGap: 2 });
    }

    doc.end();
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      userId: req.user.id,
    });
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all available templates
export const getTemplates = async (req, res) => {
  try {
    let templates = await Template.find({ isActive: true });
    if (templates.length === 0) {
      // Seed default templates
      const defaultTemplates = [
        { name: "modern", displayName: "Modern Professional", isActive: true },
        { name: "classic", displayName: "Classic Elegance", isActive: true },
        { name: "minimal", displayName: "Minimal Clean", isActive: true },
        { name: "creative", displayName: "Creative Portfolio", isActive: true },
        { name: "elegant", displayName: "Elegant Violet", isActive: true },
        { name: "tech", displayName: "Tech Sky", isActive: true },
        { name: "executive", displayName: "Executive Slate", isActive: true },
        { name: "fresh", displayName: "Fresh Emerald", isActive: true },
        { name: "dark", displayName: "Dark Mode (Light Text)", isActive: true },
      ];
      await Template.insertMany(defaultTemplates);
      templates = defaultTemplates;
    }
    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    // Fallback static templates if DB fails
    const fallback = [
      { name: "modern", displayName: "Modern Professional" },
      { name: "classic", displayName: "Classic Elegance" },
      { name: "minimal", displayName: "Minimal Clean" },
    ];
    res.status(200).json({ success: true, data: fallback });
  }
};

// Update template for a specific resume
export const updateResumeTemplate = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { template } = req.body; // template name/id

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId: req.user.id },
      { template },
      { new: true, runValidators: true },
    );

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
