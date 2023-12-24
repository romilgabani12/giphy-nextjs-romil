"use client"

import React, { useState, useEffect } from 'react'
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import './login.css'
import { useRouter } from 'next/navigation';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,

} from "firebase/auth";
import { useAuth } from '../auth';
import Loader from '../components/Loader';

const Provider = new GoogleAuthProvider();



const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const { authUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/");
    }
  }, [authUser, isLoading]);


  const loginHandler = async () => {
    if (!email || !password) return;
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      console.log(user);

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


  return isLoading || (!isLoading && !!authUser) ? (<Loader />)
    : (
      <main >
        <div className='container'>
          <div >
            <h1 >Login</h1>
            <p >
              Don't have an account ?{" "}
              <Link
                href="/register"

              >
                Sign Up
              </Link>
            </p>

            <div className="google-container" >
              <FcGoogle size={22} />
              <span

                onClick={signInWithGoogle}
              >
                Login with Google
              </span>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>

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

                onClick={loginHandler}
              >
                Login
              </button>
            </form>
          </div>
        </div>
        
      </main>
    )
}

export default page
