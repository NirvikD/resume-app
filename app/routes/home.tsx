// Home.tsx
import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants/index";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useNavigate } from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuMagic" },
    { name: "description", content: "Welcome to the Resume App!" },
  ];
}

export default function Home() {
      const {auth } = usePuterStore();
      
      const navigate = useNavigate();
  
      useEffect(() => {
          if(!auth.isAuthenticated) navigate('/auth?next=/');
      }, [auth.isAuthenticated])
  return (
    // Added bg-no-repeat for robustness, and ensure min-h-screen is only here or in CSS
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Your Dream Job Starts with a Killer Resume</h1>
          <h2>Effortlessly track, manage, and level up your applications in one place.</h2>
        </div>

        {resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}