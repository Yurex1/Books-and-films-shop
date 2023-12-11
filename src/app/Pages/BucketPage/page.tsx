'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/supabase";
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
    const [, setToken] = useState<string | null>();
    const [modalShow, setModalShow] = useState(false);

    const handleAllFilms = async () => {
        const email = localStorage.getItem('email');
        const data = (await supabase.from('films').select('*').filter('favorite_users', 'cs', `{${email}}`)).data;
        if (data === null || data === undefined) {
            setAllFilms(null)
        } else {
            setAllFilms(data);
        }
    }

    const handleAllBooks = async () => {
        const email = localStorage.getItem('email');
        const data = (await supabase.from('book').select('*').filter('favorite_users', 'cs', `{${email}}`)).data;
        if (data === null || data === undefined) {
            setAllBooks(null)
        } else {
            setAllBooks(data);
        }
    }

    function isTokenExpired(token: string | null) {
        if (token === null) {
            return true;
        }
        try {
            const decoded = jwt.decode(token);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            if (!decoded || !decoded.exp) {
                return true;
            }
            const currentTimestamp = Math.floor(Date.now() / 1000);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
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
        const cardRows: JSX.Element[] = [];
    
        for (let i = 0; i < allFilms.length; i += cardsPerRow) {
            const row = allFilms.slice(i, i + cardsPerRow);
            const cardElements = row.map((el: Film, index: number) => (
                <div key={index} style={{ backgroundColor: "#F7efdc", flex: 1, margin: "8px" }}>
                    <MyCard props={{ ...el, type: "Film", from: "Bucket" }} />

                </div>
            ));
            cardRows.push(<div key={i} style={{ display: "flex", justifyContent: "center" }}>{cardElements}</div>);
        }
    
        return cardRows.length === 0 ? null : cardRows;
    };
    

    const renderBookCardRows = () => {
        if (!allBooks) {
            return null;
        }
    
        const cardsPerRow = 4;
        const cardRows: JSX.Element[] = [];
    
        for (let i = 0; i < allBooks.length; i += cardsPerRow) {
            const row = allBooks.slice(i, i + cardsPerRow);
            const cardElements = row.map((el: Book, index: number) => (
                <div key={index} style={{ backgroundColor: "#F7efdc", flex: 1, margin: "8px" }}>
                    <MyCard props={{ ...el, type: "Book", from: "Bucket" }} />
                </div>
            ));
            cardRows.push(<div key={i} style={{ display: "flex", justifyContent: "center" }}>{cardElements}</div>);
        }
    
        return cardRows.length === 0 ? null : cardRows;
    };
    

    return (
        <>
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                <h1>Your favorite films</h1>
                {}
                {renderFilmCardRows() ?? <h2>No films</h2>}
                <h1>Your favorite books</h1>
                {renderBookCardRows() ?? <h2>No books</h2>}
            </div>
                        
            <MyAddFilmModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}
