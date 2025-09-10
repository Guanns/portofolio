// src/app/page.js
import Hero from "./components/hero.js";
import CustomProjectCards from "./components/customProjectCards.js";

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row items-center min-h-screen py-4 md:py-8">
  <div className="container mx-auto flex flex-col md:flex-row items-center px-4 md:px-0">
    <div className="w-full md:w-1/2 -mt-1 md:mt-0">
      <Hero />
    </div>
    <div className="w-full md:w-1/2">
      <CustomProjectCards />
    </div>
  </div>
</main>
  );
}