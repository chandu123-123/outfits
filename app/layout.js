import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const metadata = {
  title: "Ready Outfits",
  description: `Step into the world of fashion with Ready Outfits, your go-to destination for stylish and trendsetting collections inspired by the wardrobes of top heroines. Whether you're looking to replicate the glamorous red carpet looks or the casual elegance of your favorite stars, we've curated an exclusive selection of iconic outfits just for you.

Discover handpicked ensembles from leading heroines in the entertainment world, ranging from chic everyday wear to statement pieces for special occasions. At Ready Outfits, we make it easy to channel your inner star with the latest fashion trends and timeless classics, all in one place.

Elevate your style and make a bold fashion statement with our ready-to-wear collections. Dress like your favorite icons, and turn heads wherever you go!`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
         className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
