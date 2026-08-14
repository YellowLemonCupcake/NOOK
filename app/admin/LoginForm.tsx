"use client";
import { logsPage } from "@/constants";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitEvent, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

function LoginForm() {
   const router = useRouter();
   const [credentials, setCredentials] = useState({
      username: "",
      password: "",
   });
   const [error, setError] = useState("");
   const handleCredentialsSubmit = async (e: SubmitEvent) => {
      e.preventDefault();

      const username = credentials.username;
      const password = credentials.password;
      const response = (await signIn("credentials", {
         username,
         password,
         redirect: false,
      }))!;
      if (!response.ok) {
         setError(
            response.status === 401
               ? "Invalid username and password"
               : "Unexpecred error occured",
         );
      } else {
         router.replace(logsPage);
         setError("");
      }
   };
   const handleGoogle = () => signIn("google");

   return (
      <form
         onSubmit={handleCredentialsSubmit}
         className="my-auto w-full space-y-2 p-8"
      >
         <input
            name="username"
            type="text"
            placeholder="Username"
            required
            value={credentials.username}
            onChange={(e) => {
               setCredentials((prev) => ({
                  ...prev,
                  username: e.target.value,
               }));
            }}
            autoComplete="off"
            spellCheck={false}
            className="bg-white-primary font-inter block w-full rounded-lg p-3 text-sm font-medium outline-0 placeholder:select-none"
         />
         <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={credentials.password}
            onChange={(e) => {
               setCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
               }));
            }}
            className="bg-white-primary font-inter block w-full rounded-lg p-3 text-sm font-medium outline-0 placeholder:select-none"
         />
         <div className="font-inter my-4 flex gap-2 text-xs font-medium text-[#6C7278] select-none">
            <input name="remember" id="remember" type="checkbox" />
            <label htmlFor="remember">Remember me</label>
         </div>
         <p className="font-inter flex gap-2 text-sm font-medium text-red-800 select-none">
            {error}
         </p>
         <button
            className="font-inter bg-green-primary text-white-primary font-lg w-full rounded-lg bg-linear-to-b to-transparent py-3 text-sm not-active:from-white/12"
            type="submit"
         >
            Log In
         </button>
         <div className="relative z-100">
            <div className="absolute inset-0 -z-10 m-auto h-px bg-gray-400" />
            <p className="font-inter z-10 m-auto my-2 w-fit bg-[#D2E0D7] px-2 text-sm text-gray-600">
               or
            </p>
         </div>
         <button
            type="button"
            className="font-inter flex w-full items-center justify-center gap-2 rounded-lg bg-white p-2.5 text-sm font-semibold"
            onClick={handleGoogle}
         >
            <FcGoogle size={20} /> Continue with Google
         </button>
      </form>
   );
}

export default function Login() {
   const router = useRouter();
   const { status } = useSession();

   useEffect(() => {
      if (status === "authenticated") router.replace(logsPage);
   }, [router, status]);

   return (
      status === "unauthenticated" && (
         <section className="flex h-dvh w-full min-w-60 flex-col overflow-x-auto bg-[#D2E0D7] md:w-90">
            <div className="bg-white-primary flex h-60 shrink-0 flex-col justify-end px-7 py-10 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
               <h1
                  className="font-inter font-bold"
                  style={{
                     fontSize: "32px",
                     lineHeight: "130%",
                     letterSpacing: "-2%",
                  }}
               >
                  Ready to Manage
                  <br />
                  Your Nook?
               </h1>
               <small className="font-inter mt-2.5 font-medium text-gray-600">
                  Enter your email and password to login
               </small>
            </div>
            <div className="flex grow flex-col overflow-x-hidden overflow-y-auto">
               <LoginForm />
            </div>
         </section>
      )
   );
}
