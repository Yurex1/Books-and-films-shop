import Button from 'react-bootstrap/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import React, { useEffect, useState } from 'react';
import supabase from '../supabase';
import { Omit, BsPrefixProps } from 'react-bootstrap/esm/helpers';

export default function ModalBook(props: React.JSX.IntrinsicAttributes & Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & { ref?: React.RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null | undefined; }, BsPrefixProps<"div"> & ModalProps> & BsPrefixProps<"div"> & ModalProps & { children?: React.ReactNode; }) {
    const [favoriteUsers, setFavoriteUsers] = useState<Array<string | null>>([]);
    const [isInBucket, setInBucket] = useState(false);
    const deleteBook = async () => {
        const { error } = await supabase
            .from('book')
            .delete()
            .eq('id', props.props.id)
        if (error) {
            alert("Error while deleting a card. Check logs")
            console.log("Error while deleting a card")
        }
        else {
            window.location.reload();
        }
    }

    const { id, title, description, author, cover_image_url, genre, publication_year, favorite_users } = props.props;

    useEffect(() => {
        if (favorite_users) {
            setFavoriteUsers(favorite_users);
        }
        checkIsAlreadyInBucket();
    }, [favorite_users]);



    const checkIsAlreadyInBucket = () => {
        if (favorite_users && favorite_users.includes(localStorage.getItem('email')) || favoriteUsers && favoriteUsers.includes(localStorage.getItem('email'))) {
            setInBucket(true);
            return true;
        }
        setInBucket(false);
        return false;
    }

    const deleteFromBucket = async () => {
        if (!checkIsAlreadyInBucket()) {
            return;
        }

        const updatedFavoriteUsers = Array.isArray(favoriteUsers) ? favoriteUsers.filter((el: string | null) => el !== localStorage.getItem('email')) : [];
        
        const { error } = await supabase
            .from('book')
            .update({ favorite_users: updatedFavoriteUsers })
            .eq('id', id);
        if (error) {
            alert("Error while deleting from bucket");
        } else {
            setInBucket(false);
            setFavoriteUsers(updatedFavoriteUsers)
            alert("Successfully deleted from bucket")

        }
    }

    const addInBucket = async () => {
        if (checkIsAlreadyInBucket()) {
            return;
        }

        const updatedFavoriteUsers = Array.isArray(favoriteUsers)
            ? [...favoriteUsers, localStorage.getItem('email')]
            : [localStorage.getItem('email')];

        setFavoriteUsers(updatedFavoriteUsers);

        const { error } = await supabase
            .from('book')
            .update({ favorite_users: updatedFavoriteUsers })
            .eq('id', id);

        if (error) {
            alert("Error while adding in bucket");
        } else {
            setFavoriteUsers(updatedFavoriteUsers)
            setInBucket(true);
            alert("Successfully added in bucket")

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
                    <hr />
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <div>
                            Жанр
                        </div>
                        <div>
                            {genre ?? <>Невідомо</>}
                        </div>
                    </div>
                    <hr />
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <div>
                            Рік видання
                        </div>
                        <div>
                            {publication_year ?? <>Невідомо</>}
                        </div>
                    </div>
                </div>
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

            </Modal.Body >
            <Modal.Footer style={{ display: "flex", justifyContent: "center", backgroundColor: "#f2f8ff"}}>
                <Button variant='danger' onClick={deleteBook}>Delete</Button>
                {isInBucket ? <Button onClick={deleteFromBucket} variant='warning'>Delete from cart</Button> : <Button variant='success' onClick={addInBucket}>Add in cart</Button>}
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}