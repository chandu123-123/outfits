import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Modal = ({ isOpen, onClose, itemLinks }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        className="bg-white rounded-lg p-4 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
      >
        <h2 className="text-lg font-bold mb-2">Product Links</h2>
        <button className="text-gray-600" onClick={onClose}>Close</button>
        <div className="mt-4">
          {itemLinks.map((link, index) => (
            <div key={index} className="flex items-center mb-2">
              <Image
                src={link.imageLink}
                alt={`Link ${index + 1}`}
                height={100} width={100}
                className="w-16 h-16 object-cover rounded"
              />
              <a
                href={link.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:underline"
              >
                View Product
              </a>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
