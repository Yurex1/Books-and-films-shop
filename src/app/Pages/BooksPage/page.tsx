'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/supabase";
import { Button, Table } from "react-bootstrap";
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
    const [allBooks, setAllBooks] = useState<Array<Book> | null>();
    const [modalShow, setModalShow] = useState(false);
    const [token, setToken] = useState<string| null>();
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
        handleAllBooks();
        }
    }, [router]);

    const renderCardRows = () => {
        if (!allBooks) {
          return null;
        }
    
        const cardsPerRow = 4;
        const cardRows = [];
        for (let i = 0; i < allBooks.length; i += cardsPerRow) {
          const row = allBooks.slice(i, i + cardsPerRow);
          const cardElements = row.map((el: Book, index: number) => (
            <td style={{backgroundColor: "#F7efdc"}} key={index}>
              <MyCard props={{...el, type: "Book"}} />
            </td>
          ));
          cardRows.push(<tr  key={i}>{cardElements}</tr>);
        }
        return cardRows;
      };

    return (
        <>
            <Table>
                <tbody style={{display: "flex", justifyContent: "center", alignItems: "center" , flexDirection: "column"}}>
                    
                {renderCardRows() ?? <h2>No books</h2>}
                </tbody>
            </Table>
            {isTokenExpired(token) ? <></> : <Button variant="warning" style={{ position: "absolute", right: "2em" }} onClick={() => { setModalShow(true) }}>Add Book</Button>}
            <MyAddBookModal show={modalShow}
                onHide={() => setModalShow(false)} />
        </>
    );
}
