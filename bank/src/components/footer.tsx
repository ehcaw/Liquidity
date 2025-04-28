import { Shield } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t bg-slate-50 py-12">
      <div className="container mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Liquidity</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Banking reimagined for the digital age. Secure, accessible, and
              user-friendly.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Products</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Checking Accounts
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Savings Accounts
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Credit Cards
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Loans
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Investments
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Press
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  FDIC Information
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Liquidity. All rights reserved.
          </p>
          <p className="mt-2">
            Liquidity is a member FDIC and an Equal Housing Lender. Banking
            services provided by Liquidity, N.A.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
