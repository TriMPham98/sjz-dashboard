import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">© 2023 San Jose Jazz Progressions</p>
          </div>
          <div className="flex space-x-6">
            <a 
              href="https://sanjosejazz.org/educations/progressions/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">
              About
            </a>
            <a 
              href="mailto:trip@sanjosejazz.com"
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">
              Contact
            </a>
            <a 
              href="https://bridges.fmsd.org/academics/out-of-school-time-programs-athletics/san-jose-jazz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">
              Partners
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
