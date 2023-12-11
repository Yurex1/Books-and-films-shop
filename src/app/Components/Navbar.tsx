/* eslint-disable react/react-in-jsx-scope */
'use client'
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import jwt from 'jsonwebtoken';
import './navbar.css'


import React, { useEffect, useState } from 'react';
import supabase from '../supabase';

function MyNavbar() {
    const [userEmail, setUserEmail] = useState(null);

    const handleLogout = () => {
        supabase.auth.signOut();

        localStorage.clear();
        window.location.reload();
    }

    function isTokenExpired(token: string | null) {
        if (token === null) {
            return true;
        }
        try {
            const decoded = jwt.decode(token);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            if (!decoded || !decoded.exp) {
                return true;
            }

            const currentTimestamp = Math.floor(Date.now() / 1000);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            return decoded.exp < currentTimestamp;
        } catch (error) {

            return true;
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        if (isTokenExpired(token)) {
            setUserEmail(null);
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            setUserEmail(email);
        }
    }, []);


    return (
        <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#947d6c" }}>
            <Container>
                <Navbar.Brand href="/Pages/HomePage" style={{ color: "white" }}>Film and Book Market</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/Pages/BooksPage" style={{ color: "white" }}>Books</Nav.Link>
                        <Nav.Link href="/Pages/FilmsPage" style={{ color: "white" }}>Films</Nav.Link>
                        <Nav.Link href="/Pages/BucketPage" style={{ color: "white" }}>Cart</Nav.Link>
                    </Nav>
                    <Nav>
                        {userEmail === null ? <>
                            <Nav.Link href="/Pages/Login" style={{color: "white"}}>
                                Login
                            </Nav.Link>
                            <Nav.Link href="/Pages/Register" style={{color: "white"}}>
                                Register
                            </Nav.Link></> : 
                    <DropdownButton variant="secondary"  title={localStorage.getItem('email')} className='custom-dropdownMy'>
                                <Dropdown.Item onClick={handleLogout} className='logout-button' style={{backgroundColor: "#e8ded3"}}>Logout</Dropdown.Item>
                                
                        </DropdownButton>
                        }

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MyNavbar;