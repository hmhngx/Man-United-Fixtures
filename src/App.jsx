import "./App.css";
import Fixtures from "./components/Fixtures";

const App = () => {
  return (
    <div className="App">
      <div className="header">
        <img
          src="/logos/Manchester-United-FC-logo.png"
          alt="Manchester United Logo"
          className="man-utd-logo"
        />
        <h1>Manchester United Scores & Schedule 2024/25</h1>
      </div>
      <Fixtures />
    </div>
  );
};

export default App;