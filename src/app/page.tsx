'use client'
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('Pages/Login')
  },[])
  return (     
     <>
      
      </>
  );
}
