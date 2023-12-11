/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/supabase";
import { Button } from "react-bootstrap";
import MyCard from "@/app/Components/MyCard";
import MyAddBookModal from "@/app/Components/ModalAddBook";
import jwt from 'jsonwebtoken';

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

export default function BooksPage() {
    const router = useRouter();
    const [allBooks, setAllBooks] = useState<Array<Book> | null>(null);
    const [modalShow, setModalShow] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const handleAllBooks = async () => {
        const data = (await supabase.from('book').select('*')).data;
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
            //@ts-ignore
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



    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (isTokenExpired(token)) {
                router.push('/Pages/Login');
            }
            else {
                setToken(token);
                handleAllBooks();
            }
        }
    }, [router]);

    const renderCardRows = () => {
        if (!allBooks) {
            return null;
        }
    
        const cardsPerRow = 4;
        const cardRows: JSX.Element[] = [];
    
        for (let i = 0; i < allBooks.length; i += cardsPerRow) {
            const row = allBooks.slice(i, i + cardsPerRow);
            const cardElements = row.map((el: Book, index: number) => (
                <div key={index} style={{ flex: 1, margin: "8px", backgroundColor: "#F7efdc" }}>
                    <MyCard props={{ ...el, type: "Book" }} />
                </div>
            ));
            cardRows.push(
                <div key={i} style={{ display: "flex", justifyContent: "space-around" }}>
                    {cardElements}
                </div>
            );
        }
    
        return cardRows.length === 0 ? null : cardRows;
    };
    
    

    return (
        <>
            {/* <Table>
                <tbody style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>

                    {renderCardRows() ?? <h2>No books</h2>}
                </tbody>
            </Table> */}
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                <h1>All books</h1>
                {renderCardRows() ?? <h2>No books</h2>}
            </div>

            {isTokenExpired(token) ? <></> : <Button variant="warning" style={{ position: "absolute", right: "2em" }} onClick={() => { setModalShow(true) }}>Add Book</Button>}
            <MyAddBookModal show={modalShow}
                onHide={() => setModalShow(false)} />
        </>
    );
}
