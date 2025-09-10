import { Poppins } from "next/font/google";
import "./globals.css";

// import components start here
import Navbar from "./navbar/navbar.js";

// import components end here

// font
const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});
// font end

// metadata
export const metadata = {
  title: "Andika's Portofolio",
  description:
    "Andika Akhdan - Software Engineer",
};
// metadata end

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={poppins.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
