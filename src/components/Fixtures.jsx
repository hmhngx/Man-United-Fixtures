import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

// Ensure Modal is configured for accessibility
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

  // Logo mappings for Manchester United and all opponents, using paths from /src/photos
  const logos = {
    "Manchester United": "/logos/Manchester-United-FC-logo.png",
    Fulham: "/logos/Fulham-FC-logo.png",
    Brighton: "/logos/Brighton-Hove-Albion-logo.png",
    Liverpool: "/logos/Liverpool-FC-logo.png",
    Southampton: "/logos/Southampton-FC-logo.png",
    Barnsley: "/logos/Barnsley-FC-logo.png",
    "Crystal Palace": "/logos/Crystal-Palace-FC-logo.png",
    Twente: "/logos/Twente-FC-logo.png",
    Tottenham: "/logos/Tottenham-Hotspur-logo.png",
    Porto: "/logos/porto-logo-png.png",
    "Aston Villa": "/logos/Aston-Villa-FC-logo.png",
    Brentford: "/logos/Brentford-FC-logo.png",
    Fenerbahce: "/logos/fenerbahce-png.png",
    "West Ham": "/logos/West-Ham-United-FC-logo.png",
    Leicester: "/logos/Leicester-City-FC-logo.png",
    Chelsea: "/logos/Chelsea-FC-logo.png",
    PAOK: "/logos/PAOK-FC-logo.png",
    "Bodo/Glimt": "/logos/Bodo-Glimt-logo.png",
    "Manchester City": "/logos/Manchester-City-FC-logo.png",
    "Nottingham Forest": "/logos/Nottingham-Forest-FC-logo.png",
    "Viktoria Plzen": "/logos/plzen.png",
    "Newcastle United": "/logos/newcastle.png",
    Wolves: "/logos/Wolverhampton-Wanderers-logo.png",
    Arsenal: "/logos/Arsenal-FC-logo.png",
    Everton: "/logos/Everton-FC-logo.png",
    "Wigan Athletic": "/logos/Wigan-Athletic-FC-logo.png",
    Ipswich: "/logos/Ipswich-Town-FC-logo.png",
    "Real Sociedad": "/logos/sociedad.png",
    Bournemouth: "/logos/AFC-Bournemouth-logo.png",
  };

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        // Mock data with all provided Manchester United 2024/2025 fixtures
        const mockFixtures = [
          // Past Matches (up to February 22, 2025)
          {
            id: 1,
            date: "Fri, Aug 16, 2024",
            opponent: "(H) Fulham",
            result: "W 1 - 0",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Zirkzee 45', Fulham 0",
          },
          {
            id: 2,
            date: "Sat, Aug 24, 2024",
            opponent: "(A) Brighton",
            result: "L 2 - 1",
            competition: "Premier League",
            location: "American Express Stadium",
            details: "Goals: Brighton 2, Amad 60'",
          },
          {
            id: 3,
            date: "Sun, Sep 1, 2024",
            opponent: "(H) Liverpool",
            result: "L 0 - 3",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Liverpool 3, United 0",
          },
          {
            id: 4,
            date: "Sat, Sep 14, 2024",
            opponent: "(A) Southampton",
            result: "W 0 - 3",
            competition: "Premier League",
            location: "St. Mary's Stadium",
            details: "Goals: De Ligt 35', Rashford 41', Garnacho 96'",
          },
          {
            id: 5,
            date: "Tue, Sep 17, 2024",
            opponent: "(H) Barnsley",
            result: "W 7 - 0",
            competition: "EFL League Cup",
            location: "Old Trafford",
            details: "Goals: Rashford 16', 57', Antony 35' (pen), Alejandro Garnacho 45+2', 49', Christian Eriksen 81', 85'",
          },
          {
            id: 6,
            date: "Sat, Sep 21, 2024",
            opponent: "(A) Crystal Palace",
            result: "D 0 - 0",
            competition: "Premier League",
            location: "Selhurst Park",
            details: "No goals scored",
          },
          {
            id: 7,
            date: "Wed, Sep 25, 2024",
            opponent: "(H) Twente",
            result: "D 1 - 1",
            competition: "Europa League",
            location: "Old Trafford",
            details: "Goals: Eriksen 35', Twente 1",
          },
          {
            id: 8,
            date: "Sun, Sep 29, 2024",
            opponent: "(H) Tottenham",
            result: "L 0 - 3",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Tottenham 3, United 0",
          },
          {
            id: 9,
            date: "Thu, Oct 3, 2024",
            opponent: "(A) Porto",
            result: "D 3 - 3",
            competition: "Europa League",
            location: "Estádio do Dragão",
            details: "Goals: Rashford 7', Hojlund 20', Maguire 91', Porto 3",
          },
          {
            id: 10,
            date: "Sun, Oct 6, 2024",
            opponent: "(A) Aston Villa",
            result: "D 0 - 0",
            competition: "Premier League",
            location: "Villa Park",
            details: "No goals scored",
          },
          {
            id: 11,
            date: "Sat, Oct 19, 2024",
            opponent: "(H) Brentford",
            result: "W 2 - 1",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Garnacho 47', Hojlund 62', Brentford: 1",
          },
          {
            id: 12,
            date: "Thu, Oct 24, 2024",
            opponent: "(A) Fenerbahce",
            result: "D 1 - 1",
            competition: "Europa League",
            location: "Ülker Stadyumu Fenerbahçe Şükrü Saracoğlu Spor Kompleksi",
            details: "Goals: Eriksen 15', Fenerbahce 1",
          },
          {
            id: 13,
            date: "Sun, Oct 27, 2024",
            opponent: "(A) West Ham",
            result: "L 2 - 1",
            competition: "Premier League",
            location: "London Stadium",
            details: "Goals: West Ham 2, Casemiro 81'",
          },
          {
            id: 14,
            date: "Wed, Oct 30, 2024",
            opponent: "(H) Leicester",
            result: "W 5 - 2",
            competition: "EFL League Cup",
            location: "Old Trafford",
            details: "Goals: Casemiro 15', 39', Garnacho 28', Fernandes 36', 59', Leicester 2",
          },
          {
            id: 15,
            date: "Sat, Nov 2, 2024",
            opponent: "(H) Chelsea",
            result: "D 1 - 1",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Fernandes 70' (pen), Chelsea 1",
          },
          {
            id: 16,
            date: "Thu, Nov 7, 2024",
            opponent: "(H) PAOK",
            result: "W 2 - 0",
            competition: "Europa League",
            location: "Old Trafford",
            details: "Goals: Amad 50', 77'",
          },
          {
            id: 17,
            date: "Sun, Nov 10, 2024",
            opponent: "(H) Leicester",
            result: "W 3 - 0",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Fernandes 17', Kristiansen 38' (og), Garnacho 82'",
          },
          {
            id: 18,
            date: "Sat, Nov 24, 2024",
            opponent: "(A) Ipswich",
            result: "D 1 - 1",
            competition: "Premier League",
            location: "Portman Road",
            details: "Goals: Ipswich 1, Rashford 2'",
          },
          {
            id: 19,
            date: "Thu, Nov 28, 2024",
            opponent: "(H) Bodo/Glimt",
            result: "W 3 - 2",
            competition: "Europa League",
            location: "Old Trafford",
            details: "Goals: Garnacho 1', Hojlund 45', 50', Bodo/Glimt 2",
          },
          {
            id: 20,
            date: "Sun, Dec 1, 2024",
            opponent: "(H) Everton",
            result: "W 4 - 0",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Rashford 34', 46', Zirkzee 41', 64', Everton 0",
          },
          {
            id: 21,
            date: "Sat, Dec 4, 2024",
            opponent: "(A) Arsenal",
            result: "L 2 - 0",
            competition: "Premier League",
            location: "Emirates",
            details: "Goals: Arsenal 2, United 0'",
          },
          {
            id: 22,
            date: "Wed, Dec 7, 2024",
            opponent: "(H) Nottingham Forest",
            result: "L 2 - 3",
            competition: "Europa League",
            location: "Old Trafford",
            details: "Goals: Hojlund 18', Fernandes 61', Forrest 3",
          },
          {
            id: 23,
            date: "Sun, Dec 15, 2024",
            opponent: "(H) Newcastle United",
            result: "L 2 - 0",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Newcastle 2, United 0",
          },
          {
            id: 24,
            date: "Sat, Dec 21, 2024",
            opponent: "(H) Wolves",
            result: "W 2 - 0",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Fernandes 35', Hojlund 60'",
          },
          {
            id: 25,
            date: "Wed, Dec 26, 2024",
            opponent: "(A) Arsenal",
            result: "L 2 - 0",
            competition: "Premier League",
            location: "Emirates Stadium",
            details: "Goals: Arsenal 2, United 0",
          },
          {
            id: 26,
            date: "Sat, Dec 28, 2024",
            opponent: "(H) Everton",
            result: "W 3 - 0",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Fernandes 20', Rashford 40', Garnacho 75'",
          },
          {
            id: 27,
            date: "Wed, Jan 1, 2025",
            opponent: "(A) Wigan Athletic",
            result: "W 2 - 0",
            competition: "FA Cup",
            location: "DW Stadium",
            details: "Goals: Rashford 50', Hojlund 80'",
          },
          {
            id: 28,
            date: "Sat, Jan 4, 2025",
            opponent: "(H) Tottenham",
            result: "W 1 - 0",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Fernandes 60'",
          },
          {
            id: 29,
            date: "Tue, Jan 14, 2025",
            opponent: "(A) Arsenal",
            result: "W 3 - 2 (pens)",
            competition: "FA Cup",
            location: "Emirates Stadium",
            details: "Goals: United 3, Arsenal 2, United wins on penalties",
          },
          {
            id: 30,
            date: "Sat, Jan 18, 2025",
            opponent: "(H) Brighton",
            result: "D 1 - 1",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: United 1, Brighton 1",
          },
          {
            id: 31,
            date: "Wed, Jan 22, 2025",
            opponent: "(H) Bournemouth",
            result: "W 3 - 0",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Fernandes 15', Rashford 45', Garnacho 70'",
          },
          {
            id: 32,
            date: "Sat, Feb 1, 2025",
            opponent: "(H) Crystal Palace",
            result: "L 0 - 2",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Palace 2, United 0",
          },
          {
            id: 33,
            date: "Fri, Feb 7, 2025",
            opponent: "(H) Leicester",
            result: "W 2 - 1",
            competition: "FA Cup",
            location: "Old Trafford",
            details: "Goals: Fernandes 30', Rashford 55', Leicester 70'",
          },
          {
            id: 34,
            date: "Wed, Feb 12, 2025",
            opponent: "(A) Aston Villa",
            result: "L 1 - 0",
            competition: "Premier League",
            location: "Villa Park",
            details: "Goals: Villa 1, United 0",
          },
          {
            id: 35,
            date: "Sun, Feb 16, 2025",
            opponent: "(H) West Ham",
            result: "W 3 - 0",
            competition: "Premier League",
            location: "Old Trafford",
            details: "Goals: Fernandes 20', Rashford 50', Garnacho 85'",
          },
          {
            id: 36,
            date: "Wed, Feb 19, 2025",
            opponent: "(A) Tottenham",
            result: "L 1 - 0",
            competition: "Premier League",
            location: "Tottenham Hotspur Stadium",
            details: "Goals: Tottenham 1, United 0",
          },
          // Today's Match (February 22, 2025)
          {
            id: 37,
            date: "Sat, Feb 22, 2025",
            opponent: "(A) Everton",
            result: "TBD",
            competition: "Premier League",
            location: "Goodison Park",
            details: "TBD",
          },
          // Upcoming Matches
          {
            id: 38,
            date: "Wed, Feb 26, 2025",
            opponent: "(H) Ipswich",
            result: "TBD",
            competition: "Premier League",
            location: "Old Trafford",
            details: "TBD",
          },
          {
            id: 39,
            date: "Sun, Mar 2, 2025",
            opponent: "(H) Fulham",
            result: "TBD",
            competition: "FA Cup",
            location: "Old Trafford",
            details: "TBD",
          },
          {
            id: 40,
            date: "Sun, Mar 9, 2025",
            opponent: "(H) Arsenal",
            result: "TBD",
            competition: "Premier League",
            location: "Old Trafford",
            details: "TBD",
          },
          {
            id: 41,
            date: "Thu, Mar 6, 2025",
            opponent: "(H) Real Sociedad",
            result: "TBD",
            competition: "Europa League",
            location: "Old Trafford",
            details: "TBD",
          },
          {
            id: 42,
            date: "Thu, Mar 13, 2025",
            opponent: "(A) Real Sociedad",
            result: "TBD",
            competition: "Europa League",
            location: "Reale Arena",
            details: "TBD",
          },
          {
            id: 43,
            date: "Sun, Mar 16, 2025",
            opponent: "(A) Leicester",
            result: "TBD",
            competition: "Premier League",
            location: "King Power Stadium",
            details: "TBD",
          },
          {
            id: 44,
            date: "Tue, Apr 1, 2025",
            opponent: "(A) Nottingham Forest",
            result: "TBD",
            competition: "Premier League",
            location: "City Ground",
            details: "TBD",
          },
          {
            id: 45,
            date: "Sat, Apr 5, 2025",
            opponent: "(H) Manchester City",
            result: "TBD",
            competition: "Premier League",
            location: "Old Trafford",
            details: "TBD",
          },
          {
            id: 46,
            date: "Sat, Apr 12, 2025",
            opponent: "(A) Newcastle United",
            result: "TBD",
            competition: "Premier League",
            location: "St. James' Park",
            details: "TBD",
          },
          {
            id: 47,
            date: "Sat, Apr 19, 2025",
            opponent: "(H) Wolves",
            result: "TBD",
            competition: "Premier League",
            location: "Old Trafford",
            details: "TBD",
          },
          {
            id: 48,
            date: "Sat, Apr 26, 2025",
            opponent: "(A) Bournemouth",
            result: "TBD",
            competition: "Premier League",
            location: "Vitality Stadium",
            details: "TBD",
          },
          {
            id: 49,
            date: "Sat, May 3, 2025",
            opponent: "(A) Brentford",
            result: "TBD",
            competition: "Premier League",
            location: "Gtech Community Stadium",
            details: "TBD",
          },
          {
            id: 50,
            date: "Sat, May 10, 2025",
            opponent: "(H) West Ham",
            result: "TBD",
            competition: "Premier League",
            location: "Old Trafford",
            details: "TBD",
          },
          {
            id: 51,
            date: "Sun, May 18, 2025",
            opponent: "(A) Chelsea",
            result: "TBD",
            competition: "Premier League",
            location: "Stamford Bridge",
            details: "TBD",
          },
          {
            id: 52,
            date: "Sun, May 25, 2025",
            opponent: "(A) Aston Villa",
            result: "TBD",
            competition: "Premier League",
            location: "Villa Park",
            details: "TBD",
          },
        ];
        setFixtures(mockFixtures);
        setFilteredFixtures(mockFixtures.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      }
    };
    fetchFixtures();
  }, []);

  // Filter and sort fixtures
  useEffect(() => {
    let filtered = [...fixtures];

    // Apply search (improved logic for opponent, date, and competition)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((fixture) => {
        // Search opponent (handle "(H)" or "(A)" and team name)
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
      console.log("Filtered fixtures by search:", filtered); 
    }

    // Apply competition filter
    if (competitionFilter !== "All") {
      filtered = filtered.filter((fixture) => fixture.competition === competitionFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date); 
      if (sortBy === "opponent") return b.opponent.localeCompare(a.opponent); 
      if (sortBy === "result") return b.result.localeCompare(a.result); 
      return 0;
    });

    setFilteredFixtures(filtered);
  }, [searchTerm, competitionFilter, sortBy, fixtures]);

  // Pagination
  const indexOfLastFixture = currentPage * fixturesPerPage;
  const indexOfFirstFixture = indexOfLastFixture - fixturesPerPage;
  const currentFixtures = filteredFixtures.slice(indexOfFirstFixture, indexOfLastFixture);
  const totalPages = Math.ceil(filteredFixtures.length / fixturesPerPage);

  // Open modal with fixture details
  const openModal = (fixture) => {
    setSelectedFixture(fixture);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFixture(null);
  };

  // Result styling
  const getResultStyle = (result) => {
    if (result.startsWith("W")) return { backgroundColor: "#e6ffe6", color: "#006400" }; 
    if (result.startsWith("L")) return { backgroundColor: "#ffe6e6", color: "#8B0000" }; 
    if (result.startsWith("D")) return { backgroundColor: "#f0f0f0", color: "#333" }; 
    return { backgroundColor: "#f0f0f0", color: "#333" }; 
  };

  return (
    <div className="Fixtures">
      {/* Filters and Search */}
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

      {/* Fixtures Table */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Opponent</th>
            <th>Result</th>
            <th>Competition</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {currentFixtures.map((fixture) => {
            const opponentName = fixture.opponent.replace(/^\(H\)|\(A\)/, "").trim();
            const isHome = fixture.opponent.startsWith("(H)");
            const logo = isHome ? logos["Manchester United"] : logos[opponentName] || "/src/photos/default-logo.png"; 

            return (
              <tr
                key={fixture.id}
                onClick={() => openModal(fixture)}
                className="fixture-row"
                style={{ cursor: "pointer" }}
              >
                <td>{fixture.date}</td>
                <td>
                  <img src={logo} alt={`${opponentName} logo`} className="team-logo" />
                  {fixture.opponent}
                </td>
                <td style={getResultStyle(fixture.result)}>{fixture.result}</td>
                <td>{fixture.competition}</td>
                <td>{fixture.location}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
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

      {/* Modal for Match Details */}
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
            maxWidth: "500px",
            width: "90%",
            backgroundColor: "#fff",
          },
        }}
      >
        {selectedFixture && (
          <div>
            <h2>{selectedFixture.date} - {selectedFixture.opponent}</h2>
            <p><strong>Result:</strong> {selectedFixture.result}</p>
            <p><strong>Competition:</strong> {selectedFixture.competition}</p>
            <p><strong>Location:</strong> {selectedFixture.location}</p>
            <p><strong>Details:</strong> {selectedFixture.details}</p>
            <button onClick={closeModal} className="modal-close-btn">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Fixtures;