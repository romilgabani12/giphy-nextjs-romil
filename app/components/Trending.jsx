"use client"
import React, { useState, useEffect } from 'react'
import Loader from './Loader';
import { useAuth } from '../auth';
import './Trending.css'

const Trending = () => {

    const apiKey = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65";
    const [gifData, setGifData] = useState([]);
    const [type, setType] = useState("trending");
    const { authUser,searchTerm } = useAuth();

    const [faved, setFaved] = useState(false)
    const [favorites, setFavorites] = useState([])
    const [isLoading, setIsLoading] = useState(true);


    const fetchGif = async () => {
        const newType = searchTerm ? "search" : "trending";
        setType(newType);

        const response = await fetch(`https://api.giphy.com/v1/gifs/${type}?api_key=${apiKey}&q=${searchTerm}&limit=${50}&offset=${0}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setGifData(data.data);
            setIsLoading(false);
        } else {
            throw new Error("Failed to fetch data");
        }
    };

    const handleFavorite = async (gifId) => {
        const response = await fetch(`api/favorite/${authUser.uid}?gifId=${gifId}`);
        // console.log(response);
        const data = await response.json()
        // console.log(data);
        setFaved(prev => !prev)
    }

    useEffect(() => {
        fetchGif();
    }, [])


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
