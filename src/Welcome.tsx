import React, { useState } from "react";
import pirateMap from "./assets/pirate-map.png";
import Header from "./Header";
import TeamStandings from './TeamStandings';
import Footer from "./Footer";

interface Team {
  id: number;
  logo: string;
  name: string;
  points: number;
  g1?: string | number;
  g2?: string | number;
  g3?: string | number;
  g4?: string | number;
}

const Welcome: React.FC<{ teams: Team[] }> = ({ teams: initialTeams }) => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  const handleUpdateCell = (teamId: number, field: string, value: string) => {
    setTeams(prev =>
      prev.map(team =>
        team.id === teamId
          ? {
              ...team,
              [field]: value,
              points:
                Number(field === "g1" ? value : team.g1) +
                Number(field === "g2" ? value : team.g2) +
                Number(field === "g3" ? value : team.g3) +
                Number(field === "g4" ? value : team.g4)
            }
          : team
      )
    );
  };

  return (
    <div className="welcome-background" style={{ backgroundImage: `url(${pirateMap})` }}>
      <Header />
      <main className="welcome-main">
        <TeamStandings teams={teams} onUpdateCell={handleUpdateCell} />
      </main>
      <Footer />
    </div>
  );
};

export default Welcome;