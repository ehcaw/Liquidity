import React from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

interface IPageProps {
  children: React.ReactNode;
}

const Page: React.FC<IPageProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-grow items-center justify-center w-full">
        <div className="py-10 space-y-10 w-full max-w-7xl"> {children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
