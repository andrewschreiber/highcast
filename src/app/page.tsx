"use client";

import Highlight from "@highlight-ai/app-runtime";
import { useEffect, useState } from "react";

import { Key, Mail, TriangleAlert } from "lucide-react";
import { Logo } from "@/components/logo";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  // Raycast arguments are URL encoded, for example:
  // raycast://extensions/raycast/github/create-issue?arguments={"title":"highligh.ing","space":""}
  // raycast://extensions/the-browser-company/arc/new-tab?arguments=%7B%22url%22%3A%22highlight.ing%22%2C%22space%22%3A%22%22%7D

  const [raycast, setRaycast] = useState("");

  useEffect(() => {
    // On page load, fetch a new access token
    async function fetchToken() {
      try {
        const { accessToken, refreshToken } = await Highlight.auth.signIn();
        setToken(accessToken);
      } catch (error) {
        setError("Failed to fetch token");
      }
    }

    async function fetchEmail() {
      try {
        const email = await Highlight.user.getEmail();

        setEmail(email);
      } catch (error) {
        setError("Failed to fetch email");
      }
    }

    fetchToken();
    fetchEmail();
  }, []);

  useEffect(() => {
    Highlight.addEventListener("onContext", (context: any) => {
      console.log("Got this context", context);
    });
  }, []);

  return (
    <div className="flex h-svh flex-col items-center justify-center gap-4">
      <Logo className="size-16" />

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">Highlight Demo App</h1>
        <p className="text-muted-foreground">
          Hey you and me. This is a demo app to showcase the Highlight Runtime API.
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        {token && (
          <div className="flex max-w-xl flex-row items-center gap-1.5">
            <Key className="size-4 shrink-0" />
            <p className="truncate text-muted-foreground">{token}</p>
          </div>
        )}

        {email && (
          <div className="flex max-w-xl flex-row items-center gap-1.5">
            <Mail className="size-4 shrink-0" />
            <p className="truncate text-muted-foreground">{email}</p>
          </div>
        )}
        <div className="flex flex-col items-center gap-2  max-w-xl">
          <p className="text-muted-foreground"> Enter the Raycast Deep Link to open it in Raycast</p>
          <input
            type="text"
            placeholder="Raycast URL" // make font color black, currently white
            className="input input-primary text-black w-full p-3"
            value={raycast}
            onChange={(e) => setRaycast(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <button className="btn btn-primary" onClick={() => open(raycast)}>
            Open Raycast
          </button>
        </div>

        {error && (
          <div className="flex flex-row items-center gap-1.5">
            <TriangleAlert className="size-4 shrink-0 text-destructive" />
            <p className="text-destructive">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
