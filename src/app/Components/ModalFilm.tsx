import Button from 'react-bootstrap/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import React, { useEffect, useState } from 'react';
import supabase from '../supabase';
import { Omit, BsPrefixProps } from 'react-bootstrap/esm/helpers';

export default function ModalFilm(props: React.JSX.IntrinsicAttributes & Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & { ref?: ((instance: HTMLDivElement | null) => void) | React.RefObject<HTMLDivElement> | null | undefined; }, BsPrefixProps<"div"> & ModalProps> & BsPrefixProps<"div"> & ModalProps & { children?: React.ReactNode; }) {
    const [favoriteUsers, setFavoriteUsers] = useState<Array<string | null>>([]);
    const [isInBucket, setInBucket] = useState(false);
    const { id, title, description, author, cover_image_url, genre, publication_year, director, stars, favorite_users } = props.props;

    const checkIsAlreadyInBucket = () => {
        if (favorite_users && favorite_users.includes(localStorage.getItem('email')) || favoriteUsers && favoriteUsers.includes(localStorage.getItem('email'))) {
            setInBucket(true);
            return true;
        }
        setInBucket(false);
        return false;
    }

    const deleteFromBucket = async () => {
        console.log("TYT")
        if (!checkIsAlreadyInBucket()) {
            return;
        }
        
        const updatedFavoriteUsers = Array.isArray(favoriteUsers) ? favoriteUsers.filter((el: string | null) => el !== localStorage.getItem('email')) : [];
        const { error } = await supabase
            .from('films')
            .update({ favorite_users: updatedFavoriteUsers })
            .eq('id', id);
        if (error) {
            alert("Error while deleting from bucket");
        } else {
            setInBucket(false);
            alert("Successfully deleted from bucket")
            setFavoriteUsers(updatedFavoriteUsers)
        }
    }

    const deleteBook = async () => {

        const { error } = await supabase
            .from('films')
            .delete()
            .eq('id', props.props.id)
        if (error) {
            alert("Error while deleting a card")
        }
        else {
            setInBucket(false);
            window.location.reload();
        }
    }


    useEffect(() => {
        if (favorite_users) {
            setFavoriteUsers(favorite_users);
        }
        checkIsAlreadyInBucket();
    }, [favorite_users]);

    const addInBucket = async () => {
        if (checkIsAlreadyInBucket()) {
            return;
        }

        const updatedFavoriteUsers = Array.isArray(favoriteUsers)
            ? [...favoriteUsers, localStorage.getItem('email')]
            : [localStorage.getItem('email')];

        console.log("upd: ", updatedFavoriteUsers)

        setFavoriteUsers(updatedFavoriteUsers);

        const { error } = await supabase
            .from('films')
            .update({ favorite_users: updatedFavoriteUsers })
            .eq('id', id);

        if (error) {
            alert("Error while adding in bucket");
        } else {
            alert("Successfully added in bucket")
            setInBucket(true);
            setFavoriteUsers(updatedFavoriteUsers)
            
        }
    }


    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            
        >
            <Modal.Header closeButton style={{backgroundColor: "#f2f8ff"}}> 
                <Modal.Title id="contained-modal-title-vcenter">

                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor: "#f2f8ff"}}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={cover_image_url} width="400px" />
                </div>
                <br />
                <div>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <div>
                            Автор
                        </div>
                        <div>
                            {author ?? <>Невідомо</>}
                        </div>
                    </div>
                    <hr style={{borderColor: "#fff", borderTop: "2px dashed #8c8b8b"}}/>

                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <div>
                            Режисер
                        </div>
                        <div>
                            {director ?? <>Невідомо</>}
                        </div>
                    </div>
                    <hr style={{borderColor: "#fff", borderTop: "2px dashed #8c8b8b"}}/>

                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <div>
                            Жанр
                        </div>
                        <div>
                            {genre ?? <>Невідомо</>}
                        </div>
                    </div>
                    <hr style={{borderColor: "#fff", borderTop: "2px dashed #8c8b8b"}}/>

                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <div>
                            Зірки:
                        </div>
                        <div>
                            {stars ?? <>Невідомо</>}
                        </div>
                    </div>
                    <hr style={{borderColor: "#fff", borderTop: "2px dashed #8c8b8b"}}/>

                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <div>
                            Рік видання
                        </div>
                        <div>
                            {publication_year ?? <>Невідомо</>}
                        </div>
                    </div>
                </div>
                <hr style={{borderColor: "#fff", borderTop: "2px dashed #8c8b8b"}}/>

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div>
                        <strong>Description:</strong>
                    </div>
                </div>
                <div style={{ textAlign: "justify", padding: "10px" }}>
                    {description ? (
                        <p>{description}</p>
                    ) : (
                        <p style={{ fontStyle: "italic" }}>No description available</p>
                    )}
                </div>

            </Modal.Body>
            <Modal.Footer style={{ display: "flex", justifyContent: "center", backgroundColor: "#f2f8ff"}}>
                <Button variant='danger' onClick={deleteBook}>Delete</Button>
                {isInBucket ? <Button onClick={deleteFromBucket} variant='warning'>Delete from bucket</Button> : <Button variant='success' onClick={addInBucket}>Add in Bucket</Button>}
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}