import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-evenly items-start">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Instructor Contacts</h3>
            <ul className="space-y-2">
              <li>Tri Pham - trip@sanjosejazz.com</li>
              <li>Rey Rafanan - reyr@sanjosejazz.org</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://sanjosejazz.org/educations/progressions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300">
                  San Jose Jazz - Progressions
                </a>
              </li>
              <li>
                <a
                  href="https://bridges.fmsd.org/academics/out-of-school-time-programs-athletics/san-jose-jazz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300">
                  Bridges Afterschool Programs
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
