/**
 * Navigation bar. Using bootstrap for the styling.
 */
import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "./NavBar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import FeedbackReport from "../FeedbackReport";

// cheat to have the dropdown separated from nav-item while
// the hovers work normally
const invisBlock = {
    opacity: 0,
    position: "absolute",
    top: "-1em",
    left: "-1px",
    width: "100%",
};
/**
 * Close the dropdown when mouse leaves
 */
const navMenuMouseLeave = (e) => {
    e.target.parentNode.parentNode.parentNode.click();
    // unfocus nav-item
    e.target.parentNode.parentNode.parentNode.firstChild.blur();

    // currently attaching with the wraparound div of the dropdown.
    // could instead attach to element of dropdown-menu class through componentDidMount()
};

const NavBar = () => {
    return (
        <React.Fragment>
            <Navbar className="bg-purple container-fluid">
                {/* the app logo */}
                <Navbar.Brand>
                    <Link to="/" title="AlgoViz">
                        <img src={logo} className="logo" alt="logo" />
                    </Link>
                </Navbar.Brand>

                {/* search dropdown */}
                <NavDropdown title="Search">
                    <div onMouseLeave={(e) => navMenuMouseLeave(e)}>
                        <div style={invisBlock}>m</div>
                        <LinkContainer to="/linear-search">
                            <NavDropdown.Item>Linear Search</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/binary-search">
                            <NavDropdown.Item>Binary Search</NavDropdown.Item>
                        </LinkContainer>
                    </div>
                </NavDropdown>

                {/* sort dropdown */}
                <NavDropdown title="Sort">
                    <div onMouseLeave={(e) => navMenuMouseLeave(e)}>
                        <div style={invisBlock}>m</div>
                        <LinkContainer to="/bubble-sort">
                            <NavDropdown.Item>Bubble Sort</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/insertion-sort">
                            <NavDropdown.Item>Insertion Sort</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/selection-sort">
                            <NavDropdown.Item>Selection Sort</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Item href="#">4th</NavDropdown.Item>
                        <LinkContainer to="/merge-sort">
                            <NavDropdown.Item>Merge Sort</NavDropdown.Item>
                        </LinkContainer>
                    </div>
                </NavDropdown>

                {/* pathfinding dropdown */}
                <NavDropdown title="Pathfinding">
                    <div onMouseLeave={(e) => navMenuMouseLeave(e)}>
                        <div style={invisBlock}>m</div>
                        <NavDropdown.Item href="#">1st</NavDropdown.Item>
                        <NavDropdown.Item href="#">2nd</NavDropdown.Item>
                        <NavDropdown.Item href="#">3rd</NavDropdown.Item>
                        <NavDropdown.Item href="#">4th</NavDropdown.Item>
                    </div>
                </NavDropdown>
                <Nav.Item className="ms-auto me-4">
                    <FeedbackReport />
                </Nav.Item>
            </Navbar>
        </React.Fragment>
    );
};

export default NavBar;
