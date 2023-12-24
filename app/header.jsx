"use client"

import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

import { useRouter } from 'next/navigation';
import { useAuth } from "./auth";
import Loader from "./components/Loader";

const Header = () => {

    const router = useRouter();

    const { authUser, isLoading, signOut } = useAuth();
    

    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push("/login");
        }
    }, [authUser, isLoading, router]);



    return !authUser ? (
        <Loader />
    ) : (
        <div className="header">
            <div className="logo-container">
                <Image
                    className="logo-image"
                    src="https://upload.wikimedia.org/wikipedia/commons/8/82/Giphy-logo.svg"
                    width={100}
                    height={100}
                    alt="Picture of the author"
                />
            </div>


            <button className="logout" onClick={()=>(router.push(`/favorite?userId=${authUser.uid}`))}>

                Favourite

            </button>

            <button className="logout" onClick={signOut}>

                Logout

            </button>

        </div>
    );
};

export default Header;
