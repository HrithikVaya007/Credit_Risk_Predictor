import "./Navbar.css";
import { FaChartLine } from "react-icons/fa";

function Navbar() {

    return (

        <nav className="navbar">

            <div className="navbar-logo">

                <FaChartLine />

                <h2>CreditAI</h2>

            </div>

            <div className="navbar-links">

                <a href="/">Home</a>
                <a href="#">About</a>
                <a href="#">Model</a>

            </div>

        </nav>

    );

}

export default Navbar;