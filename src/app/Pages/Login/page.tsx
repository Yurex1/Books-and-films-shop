/* eslint-disable @typescript-eslint/ban-ts-comment */

'use client'
import { useEffect, useState } from 'react';
import supabase from '@/app/supabase';
import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useRouter } from "next/navigation";
import jwt from 'jsonwebtoken'

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [MyError, setMyError] = useState<string | undefined>('');
  const router = useRouter()

  const [validationStatus, setValidationStatus] = useState({
    email: true,
    password: true,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogin = async (e: any) => {
    e.preventDefault();
    const isAnyFieldEmpty =
      !email || !password

    if (isAnyFieldEmpty) {
      setValidationStatus({
        email: !!email,
        password: !!password
      });
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password })
    if (data.session === null || data.user === null) {
      setValidationStatus({ email: false, password: false });
      setMyError(error?.message);
      return;
    }

    localStorage.setItem('email', data.user!.email!);
    localStorage.setItem('token', data.session.access_token)
    window.location.reload();
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
    <>
      <Container style={{textAlign: 'center', marginTop: '50px', justifyContent: "center", alignItems: "center"}}>
      <h1>Login</h1>
        <Form onSubmit={handleLogin} style={{display: "flex",flexDirection: "column", justifyContent: "center"}}>
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
            <Form.Control.Feedback type="invalid">{MyError}</Form.Control.Feedback>
            <Form.Text className="text-muted" />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit" style={{backgroundColor: "#2f5232", width: "30%", marginLeft: 'auto', marginRight: 'auto'}}>
            Submit
          </Button>
        </Form>
      </Container>
      
    </>

  );
};

export default RegistrationForm;
