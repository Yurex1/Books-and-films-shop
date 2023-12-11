'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/supabase";
import { Button, Table } from "react-bootstrap";
import MyCard from "@/app/Components/MyCard";
import MyAddFilmModal from "@/app/Components/ModalAddFilm";

import jwt from 'jsonwebtoken';

interface Film {
    id: number,
    title: string,
    director: string,
    release_year: string,
    genre: string,
    description: string,
    cover_image_url: string,
    favorite_users: string[],
    stars: string[],
}

interface Book {
    id: number,
    cover_image_url: string,
    created_at: string,
    title: string,
    description: string,
    favorite_users: string[],
    genre: string,
    publication_year: string,

}


export default function FilmsPage() {
    const router = useRouter();

    const [allFilms, setAllFilms] = useState<Array<Film> | null>();
    const [allBooks, setAllBooks] = useState<Array<Book> | null>();
    const [token, setToken] = useState<string | null>();
    const [modalShow, setModalShow] = useState(false);

    const handleAllFilms = async () => {
        const data = (await supabase.from('films').select('*')).data?.filter((el: Film) => el.favorite_users.includes(localStorage.getItem('email')!));
        if (data === null || data === undefined) {
            setAllFilms(null)
        } else {
            setAllFilms(data);
        }
    }

    const handleAllBooks = async () => {
        const data = (await supabase.from('book').select('*')).data;
        if (data === null || data === undefined) {
            setAllBooks(null)
        } else {
            setAllBooks(data);
        }
        console.log("all books: ", allBooks, data)
    }

    function isTokenExpired(token: string | null) {
        if (token === null) {
            return true;
        }
        try {
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) {
                // Invalid token format or missing expiration claim
                return true;
            }

            // Check if the token has expired (in seconds)
            const currentTimestamp = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTimestamp;
        } catch (error) {

            return true;
        }
    }



    useEffect(() => {
        const token = localStorage.getItem('token');
        if (isTokenExpired(token)) {
            router.push('/Pages/Login');
        }
        else {
            setToken(token);
            handleAllFilms();
            handleAllBooks();
        }
    }, [router]);

    const renderFilmCardRows = () => {
        if (!allFilms) {
            return null;
        }

        const cardsPerRow = 4;
        const cardRows = [];
        for (let i = 0; i < allFilms.length; i += cardsPerRow) {
            const row = allFilms.slice(i, i + cardsPerRow);
            const cardElements = row.map((el: Film, index: number) => (
                <td style={{ backgroundColor: "#F7efdc" }} key={index}>
                    <MyCard props={{ ...el, type: "Film" }} />
                </td>
            ));
            cardRows.push(<tr key={i}>{cardElements}</tr>);
        }
        if(cardRows.length === 0) {
            return null;
        }
        return cardRows;

    };

    const renderBookCardRows = () => {
        if (!allBooks) {
            return null;
        }

        const cardsPerRow = 4;
        const cardRows = [];
        for (let i = 0; i < allBooks.length; i += cardsPerRow) {
            const row = allBooks.slice(i, i + cardsPerRow);
            const cardElements = row.map((el: Book, index: number) => (
                <td style={{ backgroundColor: "#F7efdc" }} key={index}>
                    <MyCard props={{ ...el, type: "Book" }} />
                </td>
            ));
            cardRows.push(<tr key={i}>{cardElements}</tr>);
        }
        if(cardRows.length === 0) {
            return null;
        }
        return cardRows;
    };

    return (
        <>
            {/* <Table>
                <tbody style={{display: "flex", justifyContent: "center", alignItems: "center" , flexDirection: "column"}}>
                <h1>Your favorite films:</h1>
                    {renderFilmCardRows()}
                    <h1>Your favorite books:</h1>
                    {renderBookCardRows()}
                </tbody>
            </Table> */}
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                <h1>Your favorite films</h1>
                {}
                {renderFilmCardRows() ?? <h2>No films</h2>}
                <h1>Your favorite books</h1>
                {renderBookCardRows() ?? <h2>No books</h2>}
            </div>
            {isTokenExpired(token) ? <></> : <Button variant="warning" style={{ position: "absolute", right: "2em" }} onClick={() => { setModalShow(true) }}>Add Film</Button>}
            <MyAddFilmModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}
