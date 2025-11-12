import React from "react";
import Link from "next/link";

const Navbar = () => (
  <nav className="flex gap-6 py-2">
    <Link href="/" className="text-brand-primary hover:underline">خانه</Link>
    <Link href="/products" className="hover:underline">محصولات</Link>
    <Link href="/about" className="hover:underline">درباره ما</Link>
    <Link href="/contact" className="hover:underline">تماس با ما</Link>
  </nav>
);

export default Navbar;
