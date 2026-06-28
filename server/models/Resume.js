import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Resume",
    },
    // --- Raw/Manual Input Structural Blocks ---
    personalDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      location: { type: String },
      website: { type: String },
    },
    education: [
      {
        institution: String,
        degree: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String, // Initial bullet points/notes entered by the user
      },
    ],
    projects: [
      {
        title: String,
        technologies: [String],
        description: String,
        link: String,
      },
    ],
    skills: [String],

    // --- AI Generated & Enhanced Layers ---
    aiFields: {
      professionalSummary: { type: String, default: "" },
      enhancedExperience: [
        {
          company: String,
          role: String,
          bulletPoints: [String], // AI polished high-impact metric action statements
        },
      ],
      enhancedProjects: [
        {
          title: String,
          aiBulletPoints: [String],
        },
      ],
      roleBasedSuggestions: { type: String, default: "" }, // Interview/Skill keyword suggestions
    },
    template: { type: String, default: "modern" },
  },
  { timestamps: true },
);

export const Resume = mongoose.model("Resume", resumeSchema);
