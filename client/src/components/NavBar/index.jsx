/**
 * Navigation bar. Using bootstrap for the styling.
 */
import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, NavDropdown } from "react-bootstrap";
import "./NavBar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

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
            <Navbar className="bg-purple">
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
                    </div>
                </NavDropdown>

                {/* pathfinding dropdown */}
                <NavDropdown title="Pathfinding">
                    <div onMouseLeave={(e) => navMenuMouseLeave(e)}>
                        <div style={invisBlock}>m</div>
                        <LinkContainer to="/breadth-first-search">
                            <NavDropdown.Item>Breadth First Search</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/depth-first-search">
                            <NavDropdown.Item>Depth First Search</NavDropdown.Item>
                        </LinkContainer>
                        {/* <LinkContainer to="/dijkstras>
                            <NavDropdown.Item>Dijkstra's</NavDropdown.Item>
                        </LinkContainer> */}
                        <LinkContainer to="/a-star">
                            <NavDropdown.Item>A*</NavDropdown.Item>
                        </LinkContainer>
                    </div>
                </NavDropdown>
            </Navbar>
        </React.Fragment>
    );
};

export default NavBar;
