import React from 'react';
import { ChevronLeft, Download, User } from 'lucide-react';

interface ExtensionDetailProps {
  extension: any; // We'll use 'any' for now, but ideally this should be a properly typed interface
  onBack: () => void;
}

const ExtensionDetailView: React.FC<ExtensionDetailProps> = ({ extension, onBack }) => {
  return (
    <div className="bg-gray-900 text-white h-screen p-4">
      <button onClick={onBack} className="flex items-center text-gray-400 mb-4">
        <ChevronLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="flex items-center mb-6">
        <img src={extension.icons.light} alt={extension.title} className="w-16 h-16 mr-4" />
        <div>
          <h1 className="text-2xl font-bold">{extension.title}</h1>
          <div className="flex items-center text-gray-400 mt-1">
            <img src={extension.owner.avatar} alt={extension.owner.name} className="w-5 h-5 rounded-full mr-2" />
            <span>{extension.owner.name}</span>
            <span className="mx-2">•</span>
            <Download className="w-4 h-4 mr-1" />
            <span>{extension.download_count.toLocaleString()} Installs</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-gray-300">{extension.description}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Commands</h2>
        {extension.commands.map((command: any) => (
          <div key={command.id} className="mb-2">
            <h3 className="font-medium">{command.title}</h3>
            <p className="text-gray-300 text-sm">{command.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Contributors</h2>
        <div className="flex flex-wrap">
          {extension.contributors.map((contributor: any) => (
            <div key={contributor.id} className="flex items-center mr-4 mb-2">
              {contributor.avatar ? (
                <img src={contributor.avatar} alt={contributor.name} className="w-8 h-8 rounded-full mr-2" />
              ) : (
                <User className="w-8 h-8 mr-2" />
              )}
              <span>{contributor.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Categories</h2>
        <div className="flex flex-wrap">
          {extension.categories.map((category: string) => (
            <span key={category} className="bg-gray-700 text-white px-2 py-1 rounded mr-2 mb-2">
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExtensionDetailView;
