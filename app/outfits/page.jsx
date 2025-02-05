"use client";
import React, { useState, useEffect, Suspense } from "react";
import { shuffle } from "lodash";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Share2, Save } from "lucide-react";
import Modal from "../components/Modal";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// Define swipe constants
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

// Main component
const Outfit = () => {
  const [fetchedItems, setFetchedItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Index to track current item
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemLinks, setSelectedItemLinks] = useState([]);
  const [isNextImageLoading, setIsNextImageLoading] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/getItems`);
        if (response.ok) {
          const data = await response.json();
          let items = data.fetchedItems;
          items = shuffle(items);
          if (id) {
            const matchingItem = items.find((item) => item._id === id);
            if (matchingItem) {
              
              items = items.filter((item) => item._id !== id);
              items.unshift(matchingItem);
            }
          } 
          setFetchedItems(items);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [id]);

  // Function to preload next image
  const preloadNextImage = (url) => {
    const img = new window.Image();
    img.src = url;
  };

  // Function to handle swipe and circular array logic
  const handleSwipe = (direction) => {
    setIsAnimating(true);
    setIsNextImageLoading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        // Circular logic using modulo
        const newIndex =
          direction === "left"
            ? (prevIndex + 1) % fetchedItems.length // Move to next
            : (prevIndex - 1 + fetchedItems.length) % fetchedItems.length; // Move to previous
        if (fetchedItems.length > 1) {
          preloadNextImage(fetchedItems[(newIndex + 1) % fetchedItems.length].image);
        }
        return newIndex;
      });
      setIsAnimating(false);
      setIsNextImageLoading(false);
    }, 300);
  };

  // Function to handle image click
  const handleImageClick = (links) => {
    setSelectedItemLinks(links);
    setIsModalOpen(true);
  };

  // Function to generate share link
  const generateShareLink = (item) => {
    return `${window.location.origin}/outfits?id=${item}`;
  };

  // Function to copy link to clipboard
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
  const saveOutfit = (item) => {
    const savedOutfits = JSON.parse(localStorage.getItem("savedOutfits")) || [];

  // Check if the item already exists in the array (using item.id for uniqueness)
  const itemExists = savedOutfits.some((savedItem) => savedItem._id === item._id);
 console.log(savedOutfits)
  // If the item doesn't exist, add it to the array and update localStorage
  if (!itemExists) {
    const updatedOutfits = [...savedOutfits, item];
    localStorage.setItem("savedOutfits", JSON.stringify(updatedOutfits));
    console.log("Item saved successfully!");
  } else {
    console.log("Item already exists in saved outfits.");
  }
  toast.success("Outfit Saved", {
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
  // Function to handle share action
  const handleShare = (e, item) => {
    e.stopPropagation();
    const shareLink = generateShareLink(item._id);
    copyToClipboard(shareLink);
  };

  return (
    <div className="">
       <ToastContainer />
        <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-3 gap-9">
          <div className="flex justify-between items-center ">
            <div className="text-xl  text-gray-800 font-poppins"><Link href={"/"}>Ready Outfits</Link></div>
           
          <Link href={"/savedOutfits"}>Saved</Link>
          </div>
        </nav>
      </header>

      {isLoading ? (
        <div className="mt-8 flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : fetchedItems.length > 0 ? (
        <div className="mt-12">
          <div className="relative w-[20rem] h-[27rem] mx-auto overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={`${fetchedItems[currentIndex]._id}-${currentIndex}`}
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
                {isNextImageLoading && (
                  <div className="absolute inset-0 flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                )}
                <Image
                  src={fetchedItems[currentIndex].image}
                  layout="fill"
                  objectFit="fill"
                  alt={`Item ${currentIndex + 1}`}
                  draggable="false"
                />
                <button
                  className="absolute top-2 right-2 p-2 bg-white bg-opacity-75 rounded-full mb-11"
                  onClick={(e) => handleShare(e, fetchedItems[currentIndex])}
                >
                  <Share2 className="h-6 w-6 text-gray-800 " />
                </button>
                <button
                    className="absolute top-10 right-2 p-2 bg-white bg-opacity-75 rounded-full mt-3"
                    onClick={() => saveOutfit(fetchedItems[currentIndex])}
                  >
                    <Save className="h-6 w-6 text-gray-800" />
                  </button>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <p
                    className="font-semibold"
                    onClick={() => handleImageClick(fetchedItems[currentIndex].links)}
                  >
                    View Links
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 text-center">
            <p>Swipe left or right to see more items</p>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center">No items available</div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemLinks={selectedItemLinks}
      />
    </div>
  );
};

// Wrap your component in Suspense
const OutfitWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Outfit />
  </Suspense>
);

export default OutfitWithSuspense;
