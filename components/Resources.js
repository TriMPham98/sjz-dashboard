import React from "react";

const Resources = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-100">Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ResourceCard
          title="Jazz Theory"
          description="Learn the fundamentals of jazz theory and harmony."
          link="#"
        />
        <ResourceCard
          title="Rhythm Exercises"
          description="Improve your timing and groove with these exercises."
          link="#"
        />
        <ResourceCard
          title="Instrument Techniques"
          description="Advanced techniques for various jazz instruments."
          link="#"
        />
        {/* Add more ResourceCards as needed */}
      </div>
    </div>
  );
};

const ResourceCard = ({ title, description, link }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-100">{title}</h2>
      <p className="text-gray-300 mb-4">{description}</p>
      <a
        href={link}
        className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
        Learn More →
      </a>
    </div>
  );
};

export default Resources;
