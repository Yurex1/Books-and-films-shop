
'use client';


import React from 'react';
import { Container } from 'react-bootstrap';

const HomePage = () => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: "#F7efdc",

    
    padding: '2rem',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '3rem',
    color: '#333',
    marginBottom: '1rem',
    textAlign: 'center',
  };

  const paragraphStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
    textAlign: 'center',
  };

  

  const ctaContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '2rem',
    padding: '2rem',
    background: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const ctaHeadingStyle: React.CSSProperties = {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '1rem',
    textAlign: 'center',
  };

  const ctaParagraphStyle: React.CSSProperties = {
    fontSize: '1rem',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
    textAlign: 'center',
  };

  return (
    <Container style={containerStyle } >
      
      <h1 style={headingStyle}>Welcome to Film and Book Collection</h1>
      <p style={paragraphStyle}>
        This site is for people who love films and books. Explore our collection,
        add your favorites to your bucket, and enjoy the world of stories!
      </p>

      <h2 style={headingStyle}>Features</h2>
      <ul style={{ ...paragraphStyle, listStyleType: 'none', paddingLeft: 0 }}>
        <li>&#8226; Discover a vast collection of films and books.</li>
        <li>&#8226; Add your favorite items to your personal bucket.</li>
        <li>&#8226; Manage your collection by adding or removing items.</li>
      </ul>

      <h2 style={headingStyle}>Get Started</h2>
      <p style={paragraphStyle}>
        To get started, navigate to our{' '}
        <a href="/Pages/FilmsPage" style={{textDecoration: "none"}}>Films Page</a> and{' '}
        <a href='/Pages/BooksPage' style={{textDecoration: "none"}}>Books Page</a> to explore and interact with our collection.
      </p>

      <p style={paragraphStyle}>
        Don`t forget to register to access this pages!
      </p>

      <div style={ctaContainerStyle}>
        <h2 style={ctaHeadingStyle}>Ready to Dive In?</h2>
        <p style={ctaParagraphStyle}>
          Join our community now and start your journey into the captivating world of films and books.
        </p>
        <a href="/Pages/Register" style={{textDecoration: "none"}}>
          Register Today
        </a>
      </div>
      <br />

      <h2 style={headingStyle}>About Us</h2>
      <p style={paragraphStyle}>
        Our mission is to provide a platform for film and book enthusiasts to connect, share,
        and enjoy their favorite stories. Feel free to reach out to us if you have any questions
        or suggestions.
      </p>

      <h2 style={headingStyle}>Contact Us</h2>
      <p style={paragraphStyle}>
        Email: support@filmbookcollection.com
      </p>
    </Container>
  );
};

export default HomePage;
