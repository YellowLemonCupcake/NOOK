"use client";

import { ChangeEvent, SubmitEvent, useState } from "react";

export default function CreateAccount() {
   const [isLoading, setIsLoading] = useState(false);
   const [credentials, setCredentials] = useState({
      name: "",
      username: "",
      password: "",
      email: "",
   });
   const [message, setMessage] = useState("");

   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const curr = { ...credentials };
      curr[e.target.name as keyof typeof credentials] = e.target.value;
      setCredentials(curr);
   };

   const handleFormSubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      if (isLoading) return;
      setIsLoading(true);
      setMessage("Wait...");
      const res = await fetch("/api/test", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(credentials),
      });
      if (!res.ok) {
         setMessage("Error");
         return;
      }
      setMessage("Created");
      setIsLoading(false);
   };
   return (
      <form onSubmit={handleFormSubmit}>
         <label className="block" htmlFor="name">
            Name:{" "}
            <input
               className="border"
               onChange={handleInputChange}
               required
               type="text"
               id="name"
               name="name"
            />
         </label>
         <label className="block" htmlFor="username">
            Username:{" "}
            <input
               className="border"
               onChange={handleInputChange}
               required
               type="text"
               id="username"
               name="username"
            />
         </label>
         <label className="block" htmlFor="password">
            Password:{" "}
            <input
               className="border"
               onChange={handleInputChange}
               required
               type="text"
               id="password"
               name="password"
            />
         </label>
         <label className="block" htmlFor="email">
            Email:{" "}
            <input
               className="border"
               onChange={handleInputChange}
               required
               type="email"
               id="email"
               name="email"
            />
         </label>
         <button>Submit</button>
         <p>{message}</p>
      </form>
   );
}
