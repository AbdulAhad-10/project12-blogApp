import Hero from "@/components/Hero";
import PopularPosts from "@/components/PopularPosts";
import RecentPosts from "@/components/RecentPosts";

export default function Home() {
  return (
    <main className="px-5 md:px-20">
      <Hero />
      <div className="flex flex-col md:gap-20 md:flex-row ">
        <RecentPosts />
        <PopularPosts />
      </div>
    </main>
  );
}
