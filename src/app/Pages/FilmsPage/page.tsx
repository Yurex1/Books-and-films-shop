'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/supabase";
import { Button } from "react-bootstrap";
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

export default function FilmsPage() {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [allFilms, setAllFilms] = useState<any>();
    const [modalShow, setModalShow] = useState(false);
    const [token, setToken] = useState<string | null>()

    const handleAllFilms = async () => {
        const data = (await supabase.from('films').select('*')).data;
        if (data === null || data === undefined || data.length === 1) {
            setAllFilms(null)
        } else {
            setAllFilms(data);
        }
        console.log("all Films: ", allFilms, data)
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
        }
    }, [router]);

    const renderCardRows = () => {
        if (!allFilms) {
            return null;
        }

        const cardsPerRow = 4;
        const cardRows = [];
        for (let i = 0; i < allFilms.length; i += cardsPerRow) {
            const row = allFilms.slice(i, i + cardsPerRow);
            const cardElements = row.map((el: Film, index: number) => (
                <td key={index} style={{backgroundColor: "#F7efdc"}}>
                    <MyCard props={{...el, type: "Film"}} />
                </td>
            ));
            cardRows.push(<tr style={{ display: "flex", justifyContent: "space-around" }} key={i}>{cardElements}</tr>);
        }
        if(cardRows.length === 0) {
            return null;
        }
        return cardRows;
    };

    return (
        <>
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                <h1>Your favorite films</h1>
                
                {renderCardRows() ?? <h2>No films</h2>}
            </div>
            {isTokenExpired(token) ? <></> : <Button variant="warning" style={{ position: "absolute", right: "2em" }} onClick={() => { setModalShow(true) }}>Add Film</Button>}
            <MyAddFilmModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}
