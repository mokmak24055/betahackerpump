import React from 'react';
import { Github, Twitter, Coffee } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-12 pb-4 text-primary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; 2023 Hacker News Terminal. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors duration-300">
              <Github size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors duration-300">
              <Twitter size={20} />
            </a>
            <a href="https://www.buymeacoffee.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors duration-300">
              <Coffee size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
