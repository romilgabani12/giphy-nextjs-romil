"use client"

import React, { useState, useEffect } from 'react'
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import './register.css'
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,

} from "firebase/auth";
import { useAuth } from '../auth';
import Loader from '../components/Loader';


const Provider = new GoogleAuthProvider();



const Page = () => {
    const router = useRouter();
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const { authUser, isLoading, setAuthUser } = useAuth();

    useEffect(() => {
        if (!isLoading && authUser) {
            router.push("/");
        }
    }, [authUser, isLoading]);


    const singupHandler = async () => {
        if (!email || !password || !username) return;
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log(user);

            await updateProfile(auth.currentUser, {
                displayName: username,
            });


            setAuthUser({
                userId: user.uid,
                email: user.email,
                username,
            });



        } catch (error) {
            console.error("An error occured", error);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const user = await signInWithPopup(auth, Provider);
            console.log(user);
        } catch (error) {
            console.error("An error occured", error);
        }
    };

    return isLoading || (!isLoading && !!authUser) ? (
        <Loader />
    ) : (
        <main >
            <div className='container'>
                <div >
                    <h1 >Sign Up</h1>
                    <p >
                        Already have an account ?{" "}
                        <Link
                            href="/login"

                        >
                            Login
                        </Link>
                    </p>

                    <div className="google-container" >
                        <FcGoogle size={22} />
                        <span

                            onClick={signInWithGoogle}
                        >
                            Sign up with Google
                        </span>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <div >
                            <label>Name</label>
                            <input
                                type="text"

                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div >
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"

                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div >
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"

                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button

                            onClick={singupHandler}
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>

        </main>
    )
}

export default Page
