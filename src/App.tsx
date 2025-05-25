import React, { useState } from "react";
import Welcome from "./Welcome";
import SetupTeam from "./SetupTeam";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Start with no teams
const emptyTeams: any[] = [];

function App() {
  const [teams, setTeams] = useState(emptyTeams);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            teams.length === 4 ? (
              <Welcome teams={teams} />
            ) : (
              // Redirect to setupTeam if teams are not set up
              <Navigate to="/setupTeam" replace />
            )
          }
        />
        <Route
          path="/setupTeam"
          element={
            <SetupTeam
              onSubmit={(newTeams) =>
                setTeams(
                  newTeams.map((t, i) => ({
                    id: t.id, // <-- preserve the id!
                    name: t.name,
                    logo: t.logo,
                    points: 0,
                    g1: "",
                    g2: "",
                    g3: "",
                    g4: "",
                  }))
                )
              }
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
