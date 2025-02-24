import React, { useState, useEffect } from "react";
import axios from "axios";
import Event from "./Event";

const Calendar = () => {
  const [fixtures, setFixtures] = useState([]);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = ["12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        // Mock data 
        const mockFixtures = [
          {
            id: 1,
            date: "2025-02-23T12:00:00Z", 
            homeTeam: "Manchester United",
            awayTeam: "Chelsea",
            score: { home: 2, away: 1 },
            status: "FINISHED",
          },
          {
            id: 2,
            date: "2025-02-24T15:00:00Z", 
            homeTeam: "Arsenal",
            awayTeam: "Manchester United",
            score: { home: null, away: null },
            status: "SCHEDULED",
          },
          {
            id: 3,
            date: "2025-02-26T14:00:00Z", 
            homeTeam: "Manchester United",
            awayTeam: "Liverpool",
            score: { home: null, away: null },
            status: "SCHEDULED",
          },
          {
            id: 4,
            date: "2025-02-28T17:00:00Z", 
            homeTeam: "Manchester City",
            awayTeam: "Manchester United",
            score: { home: 1, away: 1 },
            status: "FINISHED",
          },
        ];
        setFixtures(mockFixtures);

        // Real API example 
        const response = await axios.get(
          "https://api.football-data.org/v4/teams/66/matches?season=2024",
          { headers: { "X-Auth-Token": "62014e02d91a408f96bd0ca7687e38b0" } }
        );
        setFixtures(response.data.matches);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      }
    };
    fetchFixtures();
  }, []);

  const groupedFixtures = days.map((day) => {
    return fixtures.filter((fixture) => {
      const fixtureDate = new Date(fixture.date);
      return fixtureDate.toLocaleString("en-US", { weekday: "long" }) === day;
    });
  });

  return (
    <div className="Calendar">
      <table>
        <thead>
          <tr>
            <th></th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time) => (
            <tr key={time}>
              <td className="time">{time}</td>
              {days.map((day, index) => {
                const dayFixtures = groupedFixtures[index];
                const fixture = dayFixtures.find((f) => {
                  const fixtureHour = new Date(f.date).getHours();
                  const slotHour = parseInt(time.split(" ")[0]) + (time.includes("PM") && time !== "12 PM" ? 12 : 0);
                  return fixtureHour === slotHour;
                });
                return fixture ? (
                  <Event
                    key={fixture.id}
                    event={`${fixture.homeTeam} vs ${fixture.awayTeam}`}
                    color={fixture.status === "FINISHED" ? "green" : "yellow"}
                    location={
                      fixture.score.home !== null && fixture.score.away !== null
                        ? `${fixture.score.home} - ${fixture.score.away}`
                        : "TBD"
                    }
                  />
                ) : (
                  <td key={day}></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;