import React, { useState } from 'react';
import './TeamStandings.css';

// Define the type for a single team
type Team = {
  id: number; // Add id property
  name: string;
  points: number;
  logo: string;
  g1?: string | number;
  g2?: string | number;
  g3?: string | number;
  g4?: string | number;
};

interface TeamStandingsProps {
  teams: Team[];
  onUpdateCell?: (teamIndex: number, field: string, value: string) => void;
}

// Import all logo images from assets
const logoImages = import.meta.glob('./assets/*.{png,jpg,jpeg,gif,svg}', { eager: true, import: 'default' });

function getLogoPath(logoFileName: string) {
  const match = Object.entries(logoImages).find(([path]) => path.endsWith(logoFileName));
  return match ? match[1] as string : "";
}

const editableFields = ["g1", "g2", "g3", "g4"]; // Only allow editing G1-G4

const TeamStandings: React.FC<TeamStandingsProps> = ({ teams, onUpdateCell }) => {
  const [modal, setModal] = useState<{
    open: boolean;
    teamIndex: number | null;
    field: string | null;
    value: string;
  }>({ open: false, teamIndex: null, field: null, value: "" });

  const sortedTeams = [...teams].sort((a, b) => Number(b.points) - Number(a.points));

  const handleCellClick = (id: number, field: string, currentValue: any) => {
    if (!editableFields.includes(field)) return;
    setModal({ open: true, teamIndex: id, field, value: currentValue ?? "" });
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModal(modal => ({ ...modal, value: e.target.value }));
  };

  const handleModalSave = () => {
    // Only allow values 0, 1, 2, or 3
    if (!["0", "1", "2", "3"].includes(modal.value)) {
      alert("Please enter a value of 0, 1, 2, or 3.");
      return;
    }
    if (modal.teamIndex !== null && modal.field && onUpdateCell) {
      onUpdateCell(modal.teamIndex, modal.field, modal.value); // This notifies the parent
    }
    setModal({ open: false, teamIndex: null, field: null, value: "" });
  };

  const handleModalClose = () => {
    setModal({ open: false, teamIndex: null, field: null, value: "" });
  };

  return (
    <div className="standings-container">
      <h2 className="standings-title">Score</h2>
      <table className="standings-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Logo</th>
            <th>Team</th>
            <th>G1</th>
            <th>G2</th>
            <th>G3</th>
            <th>G4</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team) => {
            return (
              <tr key={team.id}>
                <td>{sortedTeams.findIndex(t => t.id === team.id) + 1}</td>
                <td>
                  <div className="standings-logo-box">
                    <img
                      src={getLogoPath(team.logo)}
                      alt={team.name + " logo"}
                      className="standings-logo-img"
                    />
                  </div>
                </td>
                <td>{team.name}</td>
                {["g1", "g2", "g3", "g4"].map((field) => (
                  <td
                    key={`${team.id}-${field}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCellClick(team.id, field, team[field as keyof typeof team])}
                  >
                    {team[field as keyof typeof team]}
                  </td>
                ))}
                <td>{team.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modal.open && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={handleModalClose}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 280,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)"
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3>Edit Value</h3>
            <input
              type="number"
              min={0}
              max={3}
              step={1}
              value={modal.value}
              onChange={handleModalChange}
              style={{ width: "100%", padding: 8, fontSize: 16, marginBottom: 16 }}
              autoFocus
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={handleModalClose} style={{ padding: "6px 16px" }}>Cancel</button>
              <button onClick={handleModalSave} style={{ padding: "6px 16px", background: "#1f2937", color: "#fff", border: "none", borderRadius: 4 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamStandings;

