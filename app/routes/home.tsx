import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants/index";
import ResumeCard from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuMagic" },
    { name: "description", content: "Welcome to the Resume App!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center bg-no-repeat min-h-screen text-gray-900">
      <Navbar />
      <section className="main-section py-16 text-center">
        <div className="page-heading max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Welcome to ResuMagic</h1>
          <h2 className="text-lg text-gray-600">
            Your one-stop solution for resume building
          </h2>
        </div>
      </section>
      {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </main>
  );
}
