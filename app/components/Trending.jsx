"use client"
import React, { useState, useEffect } from 'react'
import Loader from './Loader';
import { useAuth } from '../auth';
import './trending.css'
import { getDoc, doc } from "firebase/firestore";
import { db } from '../firebase';


const Trending = () => {

    const apiKey = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65";
    const [gifData, setGifData] = useState([]);
    const [type, setType] = useState("trending");
    const { authUser, searchTerm } = useAuth();

    const [faved, setFaved] = useState(false)
    const [favorites, setFavorites] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    const apiUrl = `https://api.giphy.com/v1/gifs/${type}?api_key=${apiKey}&q=${searchTerm}&limit=${50}&offset=${0}`;
    let debounceTimeout;

    useEffect(() => {
        const fetchUserFavorites = async () => {
            try {
                const userFavourite = await getDoc(doc(db, 'giphy', authUser?.uid))
                console.log(userFavourite);
                setFavorites(userFavourite.data()?.favourite)
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserFavorites();
    },[])

    const fetchGif = async () => {
        const newType = searchTerm ? "search" : "trending";
        setType(newType);

        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setGifData(data.data);
            setIsLoading(false);
        } else {
            throw new Error(" fetch data ==> Failed ");
        }
    };

    useEffect(() => {
        
        // Clear previous debounce timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        // Set a new debounce timeout
        debounceTimeout = setTimeout(() => {
            fetchGif();
        }, 500);

        // // Clean up the timeout when the component unmounts
        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [searchTerm, type,  apiUrl]);


    const handleFavorite = async (gifId) => {
        const response = await fetch(`api/favourite/${authUser.userId}?gifId=${gifId}`);


        const data = await response.json()
        // console.log(data);
        setFaved(prev => !prev)
    }





    return isLoading ? <Loader /> : (
        <div className="giphy-container">
            {gifData.map((gif) => (
                <div className="giphy-item" key={gif.id}>
                    <div>
                        <iframe src={gif.embed_url} alt="Gif" />
                    </div>
                    <div>
                        <p>{gif.title}</p>
                        {favorites.includes(gif.id) ? (
                            <button onClick={() => handleFavorite(gif.id)}>Remove from Favs</button>
                        ) : (
                            <button onClick={() => handleFavorite(gif.id)}>Add to Favs</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Trending;
