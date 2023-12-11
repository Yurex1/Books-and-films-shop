import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { ChangeEvent, useState } from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import supabase from '../supabase';
import { uuid } from 'uuidv4';
import Feedback from 'react-bootstrap/esm/Feedback';

export default function MyAddFilmModal(props) {
    // const {title, description, author, cover_image_url, genre,  publication_year} = props;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [director, setDirector] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState<File | null>();
    const [genre, setGenre] = useState('')
    const [releaseYear, setReleaseYear] = useState('')
    const [stars, setStars] = useState<string[]>();

    const [validationStatus, setValidationStatus] = useState({
        director: true,
        title: true,
        releaseYear: true,
        description: true,
        genre: true,
        stars: true,
        coverImageUrl: true,
    });

    const submitCreateBook = async () => {
        const isAnyFieldEmpty =
            !director || !title || !description || !genre || !releaseYear || !coverImageUrl || !stars;

        if (isAnyFieldEmpty) {
            console.log("Please fill in all the required fields.");
            // Update the validation status to highlight empty fields
            setValidationStatus({
                director: !!director,
                title: !!title,
                description: !!description,
                genre: !!genre,
                stars: !!stars,
                releaseYear: !!releaseYear,
                coverImageUrl: !!coverImageUrl,
            });
            return;
        }

        let tempUrl: string | null = null;

        const photoName = uuid();
        if (coverImageUrl !== null && localStorage.getItem('token') !== null) {
            tempUrl = 'https://lwdpiokfiissgfviqngz.supabase.co/storage/v1/object/public/Photos/Films/' + photoName
            const { error } = await supabase.storage
                .from('Photos/Films')
                .upload(photoName, coverImageUrl, {
                    cacheControl: "3600",
                    upsert: false,
                    headers: {
                        Authorization: localStorage.getItem('token')!,
                    },
                });
            if (error) {
                console.log("Error in uploading photo")
            }
        }

        const { error } = await supabase
            .from('films')
            .insert({
                title: title,
                director: director,
                release_year: releaseYear,
                genre: genre,
                stars: stars,
                description: description,
                cover_image_url: tempUrl,
            })
        if (error) {
            console.log("Error in createing a book: ", error)
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

                    Add new film
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <InputGroup className='mb-3' >
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
                        Director:
                    </InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        isInvalid={!validationStatus.director}
                        onChange={(e) => setDirector(e.target.value)}
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
                        Stars:
                    </InputGroup.Text>
                    <Form.Control
                        as="textarea" // Use textarea instead of input
                        rows={3}      // Set the number of visible rows
                        aria-label="Default"
                        isInvalid={!validationStatus.stars}
                        onChange={(e) => {
                            const input = e.target.value;
                            const starsArray = input
                                .split(/[\n, ]+/)
                                .filter((star) => star.trim() !== ''); // Remove empty strings after splitting
                            setStars(starsArray);
                            console.log("stars: ", stars)
                        }
                        }
                        aria-describedby="inputGroup-sizing-default"
                    />
                    <Feedback type="invalid">Input cannot be empty</Feedback>
                </InputGroup>

                <br />
                <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">
                        Release year:
                    </InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        type='date'
                        isInvalid={!validationStatus.releaseYear}
                        onChange={(e) => setReleaseYear(e.target.value)}
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

