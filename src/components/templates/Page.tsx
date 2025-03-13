import React from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

interface IPageProps {
  children: React.ReactNode;
}

const Page: React.FC<IPageProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 space-y-10">{children}</div>
      <Footer />
    </div>
  );
};

export default Page;
