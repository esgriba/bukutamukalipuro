import fs from "fs";
import path from "path";

// Create the uploads directory if it doesn't exist
// This helps ensure the directory is available when the app starts
try {
  const uploadsDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created uploads directory:", uploadsDir);
  }
} catch (error) {
  console.error("Error creating uploads directory:", error);
}
