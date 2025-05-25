import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SetupTeam.css';

// Dynamically import all images from the assets directory
const logoImages = import.meta.glob('./assets/*.{png,jpg,jpeg,gif,svg}', { eager: true, import: 'default' });

function getLogoOptions() {
  // Only include files that start with "logo"
  return Object.entries(logoImages)
    .map(([path, url]) => ({
      fileName: path.split('/').pop() || "",
      url: url as string,
    }))
    .filter(opt => opt.fileName.startsWith("logo"));
}

interface TeamForm {
  id: string; // Use string for unique id (uuid or timestamp)
  name: string;
  logo: string | null;
  preview: string | null;
}

interface SetupTeamProps {
  onSubmit: (teams: { id: string; name: string; logo: string | null }[]) => void;
}

// Helper to generate a unique id
const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const initialTeams: TeamForm[] = [
  { id: generateId(), name: "", logo: null, preview: null },
  { id: generateId(), name: "", logo: null, preview: null },
  { id: generateId(), name: "", logo: null, preview: null },
  { id: generateId(), name: "", logo: null, preview: null },
];

const logoOptions = getLogoOptions();

const SetupTeam: React.FC<SetupTeamProps> = ({ onSubmit }) => {
  const [teams, setTeams] = useState<TeamForm[]>(initialTeams);
  const navigate = useNavigate();

  const handleNameChange = (idx: number, value: string) => {
    setTeams(teams =>
      teams.map((team, i) =>
        i === idx ? { ...team, name: value } : team
      )
    );
  };

  const handleLogoChange = (idx: number, logoFileName: string) => {
    const logoObj = logoOptions.find(opt => opt.fileName === logoFileName);
    setTeams(teams =>
      teams.map((team, i) =>
        i === idx
          ? {
              ...team,
              logo: logoFileName,
              preview: logoObj ? logoObj.url : null,
            }
          : team
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass id along with name and logo
    onSubmit(teams.map(({ id, name, logo }) => ({ id, name, logo })));
    navigate("/");
  };

  return (
    <div className="setup-team-container">
      <h2>Setup Your Teams</h2>
      <form onSubmit={handleSubmit} className="setup-team-form">
        {teams.map((team, idx) => (
          <div key={team.id} className="setup-team-block">
            <h3>Team {idx + 1}</h3>
            <div>
              <label htmlFor={`team-name-${idx}`}>Team Name:</label>
              <input
                id={`team-name-${idx}`}
                type="text"
                value={team.name}
                onChange={e => handleNameChange(idx, e.target.value)}
                required
              />
            </div>
            <div>
              <label>Team Logo:</label>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: 4 }}>
                {logoOptions.map(opt => (
                  <label key={opt.fileName} style={{ cursor: "pointer" }}>
                    <input
                      type="radio"
                      name={`team-logo-${idx}`}
                      value={opt.fileName}
                      checked={team.logo === opt.fileName}
                      onChange={() => handleLogoChange(idx, opt.fileName)}
                      style={{ display: "none" }}
                    />
                    <img
                      src={opt.url}
                      alt={opt.fileName}
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "contain",
                        border: team.logo === opt.fileName ? "2px solid #1f2937" : "2px solid transparent",
                        borderRadius: 8,
                        background: "#fafafa",
                        boxShadow: team.logo === opt.fileName ? "0 0 6px #1f2937" : "0 1px 4px rgba(0,0,0,0.04)",
                        transition: "border 0.2s, box-shadow 0.2s"
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>
            {team.logo && (
              <div className="setup-team-logo-preview">
                <img
                  src={logoOptions.find(opt => opt.fileName === team.logo)?.url}
                  alt={`Logo Preview ${idx + 1}`}
                  style={{ width: 80, height: 80, objectFit: "contain" }}
                />
              </div>
            )}
          </div>
        ))}
        <button type="submit">Save Teams</button>
      </form>
    </div>
  );
};

export default SetupTeam;