import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import MatchHighlights from "./MatchHighlights";

Modal.setAppElement("#root");

const Fixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [filteredFixtures, setFilteredFixtures] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [competitionFilter, setCompetitionFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const fixturesPerPage = 10;

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const mockFixtures = await response.json();
        setFixtures(mockFixtures);
        setFilteredFixtures(mockFixtures.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      }
    };
    fetchFixtures();
  }, []);

  useEffect(() => {
    let filtered = [...fixtures];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((fixture) => {
        const opponentName = fixture.opponent.replace(/^\(H\)|\(A\)/, "").trim().toLowerCase();
        const opponentWithPrefix = fixture.opponent.toLowerCase();
        const dateMatch = fixture.date.toLowerCase().includes(searchLower);
        const competitionMatch = fixture.competition.toLowerCase().includes(searchLower);

        return (
          opponentName.includes(searchLower) ||
          opponentWithPrefix.includes(searchLower) ||
          dateMatch ||
          competitionMatch
        );
      });
    }

    if (competitionFilter !== "All") {
      filtered = filtered.filter((fixture) => fixture.competition === competitionFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "opponent") return b.opponent.localeCompare(a.opponent);
      if (sortBy === "result") return b.result.localeCompare(a.result);
      return 0;
    });

    setFilteredFixtures(filtered);
  }, [searchTerm, competitionFilter, sortBy, fixtures]);

  const indexOfLastFixture = currentPage * fixturesPerPage;
  const indexOfFirstFixture = indexOfLastFixture - fixturesPerPage;
  const currentFixtures = filteredFixtures.slice(indexOfFirstFixture, indexOfLastFixture);
  const totalPages = Math.ceil(filteredFixtures.length / fixturesPerPage);

  const openModal = (fixture) => {
    setSelectedFixture(fixture);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFixture(null);
  };

  const getResultStyle = (result) => {
    if (result.startsWith("W")) return { backgroundColor: "#e6ffe6", color: "#006400" };
    if (result.startsWith("L")) return { backgroundColor: "#ffe6e6", color: "#8B0000" };
    if (result.startsWith("D")) return { backgroundColor: "#f0f0f0", color: "#333" };
    return { backgroundColor: "#f0f0f0", color: "#333" };
  };

  return (
    <div className="Fixtures">
      <div className="filters">
        <input
          type="text"
          placeholder="Search by opponent, date, or competition..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={competitionFilter}
          onChange={(e) => setCompetitionFilter(e.target.value)}
          className="competition-filter"
        >
          <option value="All">All Competitions</option>
          <option value="Premier League">Premier League</option>
          <option value="FA Cup">FA Cup</option>
          <option value="Europa League">Europa League</option>
          <option value="EFL League Cup">EFL League Cup</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-filter"
        >
          <option value="date">Sort by Date (Newest First)</option>
          <option value="opponent">Sort by Opponent</option>
          <option value="result">Sort by Result</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>DATE</th>
            <th>OPPONENT</th>
            <th>RESULT</th>
            <th>COMPETITION</th>
            <th>LOCATION</th>
            <th>HIGHLIGHTS</th>
          </tr>
        </thead>
        <tbody>
          {currentFixtures.map((fixture) => {
            const opponentName = fixture.opponent.replace(/^\(H\)|\(A\)/, "").trim();
            return (
              <tr
                key={fixture.id}
                onClick={() => openModal(fixture)}
                className="fixture-row"
                style={{ cursor: "pointer" }}
              >
                <td>{fixture.date}</td>
                <td>
                  <img
                    src={fixture.logo}
                    alt={`${opponentName} logo`}
                    className="team-logo"
                    onError={(e) => {
                      e.target.src = "/logos/default-logo.png";
                    }}
                  />
                  {fixture.opponent}
                </td>
                <td style={getResultStyle(fixture.result)}>{fixture.result}</td>
                <td>{fixture.competition}</td>
                <td>{fixture.location}</td>
                <td className="highlight-column">
                  <MatchHighlights highlightVideo={fixture.highlightVideo} context="table" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "600px",
            width: "90%",
            backgroundColor: "#fff",
            maxHeight: "90vh",
            overflowY: "auto",
          },
        }}
      >
        {selectedFixture && (
          <div>
            <h2>
              {selectedFixture.date} - {selectedFixture.opponent}
            </h2>
            <p>
              <strong>Result:</strong> {selectedFixture.result}
            </p>
            <p>
              <strong>Competition:</strong> {selectedFixture.competition}
            </p>
            <p>
              <strong>Location:</strong> {selectedFixture.location}
            </p>
            <p>
              <strong>Details:</strong> {selectedFixture.details}
            </p>
            <MatchHighlights highlightVideo={selectedFixture.highlightVideo} context="modal" />
            <button onClick={closeModal} className="modal-close-btn">
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Fixtures;