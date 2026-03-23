import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import MainContent from "./Components/MainContent";
import Footer from "./Components/Footer";
import "./App.css";

function App() {
  return (
    <div className="app-wrapper">
      <Navbar title="NextByte" />
      <div className="app-body">
        <Sidebar />
        <MainContent title="NextByte" />
      </div>
      <Footer />
    </div>
  );
}

export default App;
