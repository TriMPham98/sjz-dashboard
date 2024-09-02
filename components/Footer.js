import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-around items-start">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Contact Us</h3>
            <p>Tri Pham - trip@sanjosejazz.com</p>
            <p>Rey Rafanan - reyr@sanjosejazz.org</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Links</h3>
            <a
              href="https://sanjosejazz.org/educations/progressions/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300">
              Visit Our Website
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
