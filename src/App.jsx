import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";
import Navbar from "./sections/Navbar";
import Inventory from "./sections/Inventory";
import Contact from "./sections/Contact";
import Projects from "./sections/Projects";
import ProjectDetails from "./sections/ProjectDetails";
import { projects } from "./data/projectsData"; // Import the project details

function App() {
  const [activeSection, setActiveSection] = useState("game"); // ✅ Default state is "game"
  const [selectedProject, setSelectedProject] = useState(null);
  const [disableBackButton, setDisableBackButton] = useState(false);

  const isPaused = activeSection !== "game";

  const handleProjectSelect = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project);
    setActiveSection("project-details");
    setDisableBackButton(true); // Disable back button for collision logic
  };

  return (
    <>
      {/* 🔹 Project Details Popup - Now Uses `activeSection` */}
      {activeSection === "project-details" && selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onClose={() => {
            setSelectedProject(null);
            setActiveSection("game"); // ✅ Close should return to game
          }}
          onBack={() => {
            setSelectedProject(null);
            setActiveSection("projects"); // ✅ Back should return to Projects list
          }}
          disableBackButton={disableBackButton} // Pass the disableBackButton prop
        />
      )}

      {/* 🔹 Other UI Popups */}
      {activeSection === "inventory" && <Inventory onClose={() => setActiveSection("game")} />}
      {activeSection === "contact" && <Contact onClose={() => setActiveSection("game")} />}
      {activeSection === "projects" && (
        <Projects
          onClose={() => {
            console.log("❌ Closing Projects, returning to game...");
            setActiveSection("game");
          }}
          onProjectClick={(project) => {
            console.log(`📂 Project ${project.title} clicked!`); // ✅ Debug log
            setSelectedProject(project);
            setActiveSection("project-details"); // ✅ Now correctly opens ProjectDetails
            setDisableBackButton(false); // Enable back button for project list
          }}
        />
      )}

      {/* 🔹 Navbar - Ensures functions are passed correctly */}
      <Navbar
        onInventoryClick={() => setActiveSection(activeSection === "inventory" ? "game" : "inventory")} // ✅ About opens Inventory
        onProjectsClick={() => setActiveSection(activeSection === "projects" ? "game" : "projects")}
        onContactClick={() => setActiveSection("contact")}
      />

      {/* 🔹 Main Canvas */}
      <Canvas shadows>
        <Scene
          isPaused={isPaused} // ✅ Disables interaction when UI is open
          onProjectSelect={handleProjectSelect}
        />
      </Canvas>
    </>
  );
}

export default App;
