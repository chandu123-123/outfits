"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Share2, Trash } from "lucide-react";
import Modal from "../components/Modal";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// Helper function to determine swipe power
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const swipeConfidenceThreshold = 10000; // Adjust threshold for swipe detection

const SavedOutfits = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Index to track current item
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemLinks, setSelectedItemLinks] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedOutfits")) || [];
    setSavedOutfits(saved);
    setIsLoading(false);
  }, []);

  // Remove outfit from localStorage
  const removeOutfit = (index) => {
    const updatedOutfits = savedOutfits.filter((_, i) => i !== index);
    
    // Update saved outfits in state and localStorage
    setSavedOutfits(updatedOutfits);
    localStorage.setItem("savedOutfits", JSON.stringify(updatedOutfits));
    
    // Adjust currentIndex after deletion
    if (updatedOutfits.length === 0) {
      setCurrentIndex(0); // If no outfits left, reset currentIndex
    } else if (currentIndex >= updatedOutfits.length) {
      setCurrentIndex(updatedOutfits.length - 1); // Ensure currentIndex is within bounds
    }
    toast.error("Outfit Removed!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored", // You can use "light", "dark", or "colored"
      });
    
  };
  const handleSwipe = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (direction === "left") {
          return (prevIndex + 1) % savedOutfits.length;
        } else if (direction === "right") {
          return (prevIndex - 1 + savedOutfits.length) % savedOutfits.length;
        }
      });
      setIsAnimating(false);
    }, 300);
  };
  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link copied to clipboard!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored", // You can use "light", "dark", or "colored"
      });
    });
  };

  const generateShareLink = (item) => {
    return `${window.location.origin}/outfits?id=${item}`;
  };

  const handleShare = (e, item) => {
    e.stopPropagation();
    const shareLink = generateShareLink(item._id);
    copyToClipboard(shareLink);
  };
  const handleImageClick = (links) => {
    setSelectedItemLinks(links);
    setIsModalOpen(true);
  };

  return (
    <div>
        <ToastContainer />
 <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-3 gap-9">
          <div className="flex justify-between items-center ">
            <div className="text-xl  text-gray-800 font-poppins"><Link href={"/"}>Ready Outfits</Link></div>
           
          <Link href={"/outfits"}>Back</Link>
          </div>
        </nav>
      </header>

      {isLoading ? (
        <div className="mt-8 flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : savedOutfits.length > 0 ? (
        <div className="mt-12">
          <div className="relative w-[20rem] h-[27rem] mx-auto overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={`${savedOutfits[currentIndex]._id}-${currentIndex}`}
                className="absolute w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                drag={!isAnimating ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  if (!isAnimating) {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (Math.abs(swipe) > swipeConfidenceThreshold) {
                      handleSwipe(swipe < 0 ? "left" : "right"); // Swipe left or right
                    }
                  }
                }}
              >
                <Image
                  src={savedOutfits[currentIndex].image}
                  layout="fill"
                  objectFit="fill"
                  alt={`Item ${currentIndex + 1}`}
                  draggable="false"
                />
                <button
                  className="absolute top-2 right-2 p-2 bg-white bg-opacity-75 rounded-full"
                  onClick={(e) => handleShare(e, savedOutfits[currentIndex])}
                >
                  <Share2 className="h-6 w-6 text-gray-800" />
                </button>
                <button
                  className="absolute top-10 right-2 p-2 bg-white bg-opacity-75 rounded-full mt-3"
                  onClick={() => removeOutfit(currentIndex)}
                >
                  <Trash className="h-6 w-6 text-red-500" />
                </button>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <p
                    className="font-semibold"
                    onClick={() => handleImageClick(savedOutfits[currentIndex].links)}
                  >
                    View Links
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 text-center">
            <p>Swipe left or right to see more outfits</p>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center">No saved outfits available</div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemLinks={selectedItemLinks}
      />
    </div>
  );
};

export default SavedOutfits;
