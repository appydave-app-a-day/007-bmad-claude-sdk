/**
 * PagesMenu Component
 * Hierarchical dropdown menu showing generated HTML files from /public directory
 */

import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { io, Socket } from 'socket.io-client';

interface PagesMenuProps {
  serverUrl?: string;
}

/**
 * Displays generated HTML pages in a dropdown menu
 * Fetches from /api/pages endpoint and opens files in new tab
 */
export const PagesMenu: React.FC<PagesMenuProps> = ({ serverUrl = 'http://localhost:3000' }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch list of HTML files from server
   */
  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${serverUrl}/api/pages`);
      const data = await response.json();
      setPages(data.files || []);
    } catch (error) {
      console.error('❌ Failed to fetch pages:', error);
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pages on mount and listen for real-time updates via Socket.io
  useEffect(() => {
    // Initial fetch
    fetchPages();

    // Connect to Socket.io for real-time updates
    const socket: Socket = io(serverUrl);

    // Listen for file-created events
    socket.on('file-created', (data: { filepath: string; timestamp: number }) => {
      console.log('📄 File created:', data.filepath);
      // Refetch pages list when HTML file is created
      fetchPages();
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [serverUrl]);

  /**
   * Open HTML file in new tab
   * @param filepath - Relative path from /public directory
   */
  const handlePageClick = (filepath: string) => {
    const url = `${serverUrl}/${filepath}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  if (pages.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled>
        No Pages Yet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" style={{ fontSize: '13px', padding: '6px 14px' }}>
          📄 Pages ({pages.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" style={{ width: '240px', maxHeight: '400px', overflowY: 'auto', backgroundColor: '#ffffff' }}>
        <DropdownMenuLabel style={{ fontSize: '12px', padding: '8px 12px', opacity: 0.7 }}>
          Generated Pages
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {pages.map((page) => (
          <DropdownMenuItem
            key={page}
            onClick={() => handlePageClick(page)}
            className="cursor-pointer"
            style={{ fontSize: '13px', padding: '8px 12px' }}
          >
            <span className="truncate" style={{ fontSize: '13px' }}>{page}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
