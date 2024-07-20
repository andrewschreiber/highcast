"use client"
import React, { useState, useEffect } from 'react';
import { Search, Download, ChevronRight, SquareTerminal } from 'lucide-react';

interface Author {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

interface Icons {
  light: string | null;
  dark: string | null;
}

interface Command {
  id: string;
  name: string;
  title: string;
  description: string;
}

interface Extension {
  id: string;
  name: string;
  title: string;
  description: string;
  author: Author;
  download_count: number;
  icons: Icons;
  commands: Command[];
}

interface ApiResponse {
  data: Extension[];
}

const ExtensionItem: React.FC<{
  icon: string;
  name: string;
  description: string;
  downloads: number;
  commands: number;
  verified: boolean;
}> = ({ icon, name, description, downloads, commands, verified }) => (
  <div className="flex items-center p-2 hover:bg-gray-700 cursor-pointer">
    <img src={icon} alt={name} className="w-8 h-8 mr-3" />
    <div className="flex-grow">
      <div className="flex items-center">
        <h3 className="text-white font-semibold">{name}</h3>
        {verified && <span className="ml-2 text-green-500">✓</span>}
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
    <div className="flex items-center text-gray-400 text-sm">
      <Download className="w-4 h-4 mr-1" />
      <span>{(downloads / 1000).toFixed(1)}k</span>
      <span className="mx-2">•</span>
      <SquareTerminal className="w-4 h-4 mr-1" />
      <span>{commands}</span>
    </div>
  </div>
);

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('fetching extensions')
    const fetchExtensions = async () => {
      try {
        const response = await fetch('https://backend.raycast.com/api/v1/extensions/trending');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        } else {
          console.log('response ok')
        }
        const data: ApiResponse = await response.json();
        setExtensions(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching extensions:', error);
        setError(`Failed to load extensions. Please try again later. Error: ${error}`);
        setLoading(false);
      }
    };

    fetchExtensions();
  }, []);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white h-screen p-4">
      <div className="mb-4 flex items-center bg-gray-800 rounded-md p-2">
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search Raycast Store for extensions..."
          className="bg-transparent border-none outline-none text-white w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h2 className="text-lg font-semibold mb-2">Trending</h2>
      {extensions.map(ext => (
        <ExtensionItem
          key={ext.id}
          name={ext.title}
          description={ext.description}
          downloads={ext.download_count}
          commands={ext.commands.length}
          icon={ext.icons.light || ext.icons.dark || ''}
          verified={ext.author.handle === 'raycast'}
        />
      ))}

      <div className="mt-4 flex items-center justify-between p-2 hover:bg-gray-700 cursor-pointer">
        <span className="text-gray-400">Store</span>
        <div className="flex items-center">
          <span className="mr-2 text-gray-400">Show Details</span>
          <ChevronRight className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}

export default Home;