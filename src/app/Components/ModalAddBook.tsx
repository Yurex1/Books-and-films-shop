import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { ChangeEvent, useState } from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import supabase from '../supabase';
import { uuid } from 'uuidv4';
import Feedback from 'react-bootstrap/esm/Feedback';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
export default function MyAddBookModal(props) {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState<File | null>();
    const [genre, setGenre] = useState('')
    const [publicationYear, setPublicationYear] = useState('')

    const [validationStatus, setValidationStatus] = useState({
        author: true,
        title: true,
        description: true,
        genre: true,
        publicationYear: true,
        coverImageUrl: true,
    });

    const submitCreateBook = async () => {
        const isAnyFieldEmpty =
            !author || !title || !description || !genre || !publicationYear || !coverImageUrl;

        if (isAnyFieldEmpty) {
            setValidationStatus({
                author: !!author,
                title: !!title,
                description: !!description,
                genre: !!genre,
                publicationYear: !!publicationYear,
                coverImageUrl: !!coverImageUrl,
            });
            return;
        }

        let tempUrl: string | null = null;
        
        const photoName = uuid();
        if (coverImageUrl !== null && localStorage.getItem('token') !== null) {
            tempUrl = 'https://lwdpiokfiissgfviqngz.supabase.co/storage/v1/object/public/Photos/Books/' + photoName
            const { error } = await supabase.storage
                .from('Photos/Books')
                .upload(photoName, coverImageUrl, {
                    cacheControl: "3600",
                    upsert: false,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
                    headers: {
                        Authorization: localStorage.getItem('token')!,
                    },
                });
            if (error) {
                alert("Error in uploading photo")
            }
        }

        const { error } = await supabase
            .from('book')
            .insert({
                title: title,
                author: author,
                publication_year: publicationYear,
                genre: genre,
                description: description,
                cover_image_url: tempUrl,
            })
        if (error) {
            alert("Error while creating a book. Check logs")
            console.log("Error in creating a book: ", error)
        }
        else {
            window.location.reload();
        }

    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">

                    Add new book
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <InputGroup className='mb-3' >
                    <InputGroup.Text id="inputGroup-sizing-default">
                        Author:
                    </InputGroup.Text>

                    <Form.Control
                        aria-label="Default"
                        isInvalid={!validationStatus.author}
                        onChange={(e) => setAuthor(e.target.value)}
                        aria-describedby="inputGroup-sizing-default"
                    />
                    <Feedback type="invalid">Input cannot be empty</Feedback>

                </InputGroup>
                <br />
                <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">
                        Title:
                    </InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        isInvalid={!validationStatus.title}
                        onChange={(e) => setTitle(e.target.value)}
                        aria-describedby="inputGroup-sizing-default"
                    />
                    <Feedback type="invalid">Input cannot be empty</Feedback>
                </InputGroup>
                <br />
                <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">
                        Description:
                    </InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        isInvalid={!validationStatus.description}
                        onChange={(e) => setDescription(e.target.value)}
                        aria-describedby="inputGroup-sizing-default"
                    />
                    <Feedback type="invalid">Input cannot be empty</Feedback>
                </InputGroup>
                <br />
                <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">
                        Genre:
                    </InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        isInvalid={!validationStatus.genre}
                        onChange={(e) => setGenre(e.target.value)}
                        aria-describedby="inputGroup-sizing-default"
                    />
                    <Feedback type="invalid">Input cannot be empty</Feedback>
                </InputGroup>
                <br />
                <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">
                        Publication year:
                    </InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        type='date'
                        isInvalid={!validationStatus.publicationYear}
                        onChange={(e) => setPublicationYear(e.target.value)}
                        aria-describedby="inputGroup-sizing-default"
                    />
                    <Feedback type="invalid">Input cannot be empty</Feedback>
                </InputGroup>
                <br />
                <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">
                        Image:
                    </InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        type='file'
                        accept="image/png, image/jpeg"
                        isInvalid={!validationStatus.coverImageUrl}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.currentTarget.files !== null) {
                                setCoverImageUrl(e.currentTarget.files[0]);
                            } else {
                                setCoverImageUrl(null);
                            }
                        }
                        }
                        aria-describedby="inputGroup-sizing-default"

                    />
                    <Feedback type="invalid">Input cannot be empty</Feedback>
                </InputGroup>
                <br />

            </Modal.Body>
            <Modal.Footer style={{ display: "flex", justifyContent: "space-between" }}>
                <Button onClick={props.onHide}>Close</Button>
                <Button variant='success' onClick={submitCreateBook}>Submit</Button>


            </Modal.Footer>
        </Modal>
    );
}

