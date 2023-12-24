"use client";
import { useEffect, useState } from "react";

import Loader from "../components/Loader";
import { useSearchParams } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import './favourite.css'
import { useAuth } from "../auth";
import Image from "next/image";
import Link from "next/link";

const Page = () => {

  const apiKey = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65";
  const [gifData, setGifData] = useState([]);
  const [favouriteData, setFavouriteData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const searchParams = useSearchParams();
  const [temp, setTemp] = useState(true);

  const { authUser } = useAuth();



  useEffect(() => {
    setUserId(searchParams.get('userId'));

    const fetchFavs = async () => {
      try {
        setIsLoading(true);
        const userId = searchParams.get('userId');
        if (userId) {
          const userFavourite = await getDoc(doc(db, 'giphy', userId));
          setFavouriteData(userFavourite.data().favourite);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in favorite', error);
        setIsLoading(false);
      }
    };

    fetchFavs();
  }, [searchParams, temp]);

  useEffect(() => {
    setIsLoading(true);

    const getAllGIFs = async () => {
      const fetchedGIFs = [];

      await Promise.all(
        favouriteData.map(async (item) => {
          const url = `https://api.giphy.com/v1/gifs?api_key=${apiKey}&ids=${item}`;
          const ans = await fetch(url);
          const response = await ans.json();
          // console.log(response.data);
          fetchedGIFs.push(...response.data);
        })
      );

      setGifData(fetchedGIFs);
      setIsLoading(false);
    };

    getAllGIFs();
  }, [favouriteData, temp]);


  const handleFavorite = async (gifId) => {
    const response = await fetch(`api/favourite/${authUser.userId}?gifId=${gifId}`)
    const data = await response.json()
    setTemp(prev => !prev)
    // console.log(data);
  }




  return isLoading ? (
    <Loader />
  ) : (
    <div>
      <div>
        <div className="logo-container">
          <Image
            className="logo-image"
            src="https://upload.wikimedia.org/wikipedia/commons/8/82/Giphy-logo.svg"
            width={100}
            height={100}
            alt="Picture of the author"
          />
        </div>
        {gifData.length > 0 ? (
          <div>
            {gifData?.map((gif) => (
              <div key={gif.id} className="gifContainer">
                <div className="gifWrapper">
                  <iframe
                    src={gif.embed_url}
                    alt="Gif"
                    className="gifIframe"
                  />
                </div>
                <div className="gifInfo">
                  <p className="gifTitle">{gif.title}</p>
                  <button
                    onClick={() => handleFavorite(gif.id)}
                    className="favoriteButton"
                  >
                    Remove From Favorite
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="noDataMessage">
            No Favourite Item Here....
            <div><br/>
              Go To <Link href={"/"}>Home Page</Link>
            </div>
          </div>

        )}
      </div>
    </div>
  );
}

export default Page
