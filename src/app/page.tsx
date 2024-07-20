"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Download, ChevronRight, SquareTerminal, User } from 'lucide-react';

import ExtensionDetailView from './ExtensionDetailView';

interface Author {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

interface Owner {
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
  owner: Owner;
  download_count: number;
  icons: Icons;
  commands: Command[];
}

interface ApiResponse {
  data: Extension[];
}

const ExtensionItem: React.FC<{
  extension: Extension;
  onSelect: (extension: Extension) => void;
}> = ({ extension, onSelect }) => (
  <div className="flex items-center p-2 hover:bg-gray-700 cursor-pointer" onClick={() => onSelect(extension)}>
    <img src={extension.icons.light || extension.icons.dark || ''} alt={extension.title} className="w-8 h-8 mr-3" />
    <div className="flex-grow">
      <div className="flex items-center">
        <h3 className="text-white font-semibold">{extension.title}</h3>
        {extension.author.handle === 'raycast' && <span className="ml-2 text-green-500">✓</span>}
      </div>
      <p className="text-gray-400 text-sm">{extension.description}</p>
    </div>
    <div className="flex items-center text-gray-400 text-sm space-x-4">
      <div title={`${extension.download_count.toLocaleString()} downloads`} className="flex items-center">
        <Download className="w-4 h-4 mr-1" />
        <span>{(extension.download_count / 1000).toFixed(1)}k</span>
      </div>
      <div title={`${extension.commands.length} commands`} className="flex items-center">
        <SquareTerminal className="w-4 h-4 mr-1" />
        <span>{extension.commands.length}</span>
      </div>
      <div title={extension.author.name} className="flex items-center">
        {extension.author.avatar ? (
          <img src={extension.author.avatar} alt={extension.author.name} className="w-6 h-6 rounded-full" />
        ) : (
          <User className="w-6 h-6" />
        )}
      </div>
    </div>
  </div>
);

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);

  const fetchExtensions = useCallback(async (query: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = query
        ? `https://backend.raycast.com/api/v1/store_listings/search?page=1&q=${encodeURIComponent(query)}&include_native=true&per_page=25`
        : 'https://backend.raycast.com/api/v1/extensions/trending?page=1&per_page=25';

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: ApiResponse = await response.json();
      setExtensions(data.data);
    } catch (error) {
      console.error('Error fetching extensions:', error);
      setError(`Failed to load extensions. Please try again later. Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(
    (query: string) => fetchExtensions(query),
    [fetchExtensions]
  );

  useEffect(() => {
    fetchExtensions();
  }, [fetchExtensions]);

  useEffect(() => {
    if (searchQuery) {
      debouncedFetch(searchQuery);
    } else {
      fetchExtensions();
    }
  }, [searchQuery, debouncedFetch, fetchExtensions]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectExtension = async (extension: Extension) => {
    try {

      const owner = extension.owner?.handle ?? extension.author.handle;
      const response = await fetch(`https://backend.raycast.com/api/v1/extensions/${owner}/${extension.name}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const detailedExtension = await response.json();
      setSelectedExtension(detailedExtension);
    } catch (error) {
      console.error('Error fetching extension details:', error);
      setSelectedExtension(null);

    }
  };

  if (selectedExtension) {
    return <ExtensionDetailView extension={selectedExtension} onBack={() => setSelectedExtension(null)} />;
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
          onChange={handleSearchChange}
        />
      </div>

      <h2 className="text-lg font-semibold mb-2">{searchQuery ? 'Search Results' : 'Trending'}</h2>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : extensions.length === 0 ? (
        <div className="text-gray-400">No extensions found</div>
      ) : (
        extensions.map(ext => (
          <ExtensionItem
            key={ext.id}
            extension={ext}
            onSelect={handleSelectExtension}
          />
        ))
      )}

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