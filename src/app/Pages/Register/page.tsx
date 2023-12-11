/* eslint-disable @typescript-eslint/ban-ts-comment */

'use client'
import { useState, useEffect } from 'react';
import supabase from '@/app/supabase';
import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useRouter } from "next/navigation";
import jwt from 'jsonwebtoken'

const RegistrationForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [myError, setMyError] = useState('');

    const [validationStatus, setValidationStatus] = useState({
        email: true,
        password: true,
        confirmedPassword: true,
    })
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRegister = async (e: any) => {
        e.preventDefault();
        if(password !== repeatedPassword) {
          setValidationStatus({
            email: true,
            password: false,
            confirmedPassword: false,
          });
        // setMyError("Passwords are not identical");
        return;
        }
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            
        })
        
        if (error) {
            setValidationStatus({
                email: false,
                password: false,
                confirmedPassword: false,
            })
            setMyError(error.message);
        }
        else {
            router.push('Login')
        }
    }

    function isTokenExpired(token: string | null) {
        if (token === null) {
            return true;
        }
        try {
            const decoded = jwt.decode(token);
            //@ts-expect-error
            if (!decoded || !decoded.exp) {
                return true;
            }

            const currentTimestamp = Math.floor(Date.now() / 1000);
            //@ts-expect-error
            return decoded.exp < currentTimestamp;
        } catch (error) {

            return true;
        }
    }
    const handleUser = async () => {
        const token = localStorage.getItem('token');
        if (isTokenExpired(token)) {
            return;
        }
        else {
            router.push('/Pages/FilmsPage');
        }

        
    }

    useEffect(() => { handleUser() }, [])

    return (
        <Container style={{textAlign: 'center', marginTop: '50px', justifyContent: "center", alignItems: "center"}}>
      <h1>Register</h1>
        <Form onSubmit={handleRegister} style={{display: "flex",flexDirection: "column", justifyContent: "center"}}>
          <Form.Group className="mb-3" controlId="formBasicEmail" style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              isInvalid={!validationStatus.email}
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              style={{width: "30%", marginLeft: 'auto', marginRight: 'auto'}}
            />
            <Form.Text className="text-muted" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword"  style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              isInvalid={!validationStatus.password}
              type="password"
              placeholder="Enter password"
              style={{width: "30%", marginLeft: 'auto', marginRight: 'auto'}}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">{myError}</Form.Control.Feedback>
            <Form.Text className="text-muted" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword"  style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              isInvalid={!validationStatus.confirmedPassword}
              type="password"
              placeholder="Repeat your password"
              style={{width: "30%", marginLeft: 'auto', marginRight: 'auto'}}
              onChange={(e) => setRepeatedPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">Password are not identical</Form.Control.Feedback>
            <Form.Text className="text-muted" />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit" style={{backgroundColor: "#2f5232", width: "30%", marginLeft: 'auto', marginRight: 'auto'}}>
            Submit
          </Button>
        </Form>
      </Container>
    );
};

export default RegistrationForm;
