"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { shuffle } from 'lodash';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Share2 } from 'lucide-react';
import Modal from '../components/Modal';
import { useSearchParams } from 'next/navigation';

// Define swipe constants
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

// Main component
const Outfit = () => {
  const [fetchedItems, setFetchedItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemLinks, setSelectedItemLinks] = useState([]);
  const [isNextImageLoading, setIsNextImageLoading] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/getItems`);
        if (response.ok) {
          const data = await response.json();
          let items = data.fetchedItems;

          if (id) {
            const matchingItem = items.find(item => item._id === id);
            if (matchingItem) {
              items = items.filter(item => item._id !== id);
              items.unshift(matchingItem);
            }
          } else {
            items = shuffle(items);
          }

          setFetchedItems(items);
          setDisplayedItems(items);
        } else {
          console.error('Failed to fetch items');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
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

  // Function to remove top card
  const removeTopCard = () => {
    setIsAnimating(true);
    setIsNextImageLoading(true);
    setTimeout(() => {
      setDisplayedItems((prev) => {
        const newItems = prev.slice(1);
        if (newItems.length <= 2) {
          const itemsToAdd = shuffle([...fetchedItems]);
          return [...newItems, ...itemsToAdd];
        }
        if (newItems.length > 1) {
          preloadNextImage(newItems[1].image);
        }
        return newItems;
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
      alert('Link copied to clipboard!');
    });
  };

  // Function to handle share action
  const handleShare = (e, item) => {
    e.stopPropagation();
    const shareLink = generateShareLink(item._id);
    copyToClipboard(shareLink);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 font-poppins">Ready Outfits</h1>

      {isLoading ? (
        <div className="mt-8 flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : displayedItems.length > 0 ? (
        <div className="mt-12">
          <div className="relative w-[20rem] h-[27rem] mx-auto overflow-hidden">
            <AnimatePresence initial={false}>
              {displayedItems.map((item, index) =>
                index === 0 && (
                  <motion.div
                    key={`${item._id}-${index}`}
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
                          removeTopCard();
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
                      src={item.image}
                      layout="fill"
                      objectFit="fill"
                      alt={`Item ${index + 1}`}
                      draggable="false"
                    />
                    <button
                      className="absolute top-2 right-2 p-2 bg-white bg-opacity-75 rounded-full"
                      onClick={(e) => handleShare(e, item)}
                    >
                      <Share2 className="h-6 w-6 text-gray-800" />
                    </button>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <p className="font-semibold" onClick={() => handleImageClick(item.links)}>View Links</p>
                    </motion.div>
                  </motion.div>
                )
              )}
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
