"use client";
import React, { useState, useEffect } from 'react';
import { shuffle } from 'lodash';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react'; // Import the Modal component
import Modal from '../components/Modal';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

export default function Men() {
  const [fetchedItems, setFetchedItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemLinks, setSelectedItemLinks] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/getItems`);
        if (response.ok) {
          const data = await response.json();
          setFetchedItems(data.fetchedItems);
          setDisplayedItems(shuffle([...data.fetchedItems]));
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
  }, []);

  const removeTopCard = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setDisplayedItems((prev) => {
        const newItems = prev.slice(1);
        if (newItems.length <= 2) {
          const itemsToAdd = shuffle([...fetchedItems]);
          return [...newItems, ...itemsToAdd];
        }
        return newItems;
      });
      setIsAnimating(false);
    }, 300);
  };

  const handleImageClick = (links) => {
    setSelectedItemLinks(links);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mens Selection</h1>

      {isLoading ? (
        <div className="mt-8 flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : displayedItems.length > 0 ? (
        <div className="mt-8">
          <div className="relative w-[20rem] h-[27rem] mx-auto overflow-hidden">
            <AnimatePresence initial={false}>
              {displayedItems.map((item, index) =>
                index === 0 && (
                  <motion.div
                    key={`${item._id.$oid}-${index}`} // Use the unique ID for the key
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
                    onClick={() => handleImageClick(item.links)} // Handle image click
                  >
                    <Image
                      src={item.image}
                      layout="fill"
                      objectFit="fill"
                      alt={`Item ${index + 1}`}
                      draggable="false"
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <p className="font-semibold">View Links</p>
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
}
