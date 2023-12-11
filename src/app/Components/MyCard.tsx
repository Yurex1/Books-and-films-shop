/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useState } from 'react';
import ModalBook from './ModalBook';
import ModalFilm from './ModalFilm';

function MyCard(props: { props: { type: any; title?: any; description?: any; cover_image_url?: any; from?: string }; }) {
  const [modalShow, setModalShow] = useState(false);
  const { type, title, description, cover_image_url } = props.props;
  console.log("Props: ", props.props.from)
  
  const truncatedDescription = description ? description.slice(0, 80) + (description.length > 80 ? '...' : '') : '';

  return (
    <>
      <Card style={{ width: '18rem', height: '24rem', backgroundColor: "#f2f2f2", borderRadius: '15px' }}>
        <Card.Img variant="top" src={cover_image_url === null ? '' : cover_image_url} style={{ objectFit: 'cover', height: '50%' }} />
        <Card.Body style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", padding: '1rem'  }}>
          <div style={{display: "flex", flexDirection: "column"}}>
          <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{title}</Card.Title>
          <Card.Text style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            {truncatedDescription}
          </Card.Text>
          </div >
            <Button  variant="primary" className='myBnt' onClick={() => setModalShow(true)}>Check {type === 'Book' ? `Book` : `Film`}</Button>
        </Card.Body>
      </Card>
      {props.props.type === "Book" ? <ModalBook
        show={modalShow}
        onHide={() => setModalShow(false)}
        props={props.props}
      /> : <ModalFilm
        show={modalShow}
        onHide={() => setModalShow(false)}
        props={props.props}
      />}
    </>
  );
}

export default MyCard;
