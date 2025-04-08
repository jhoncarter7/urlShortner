import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, QrCode, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

const AnalyticsTable = ({ links, onShowQr }) => {
    // Imports needed: React, hooks, components, icons
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredLinks = useMemo(() => {
        if (!Array.isArray(links)) return [];
        return links.filter(link =>
            link.originalUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.shortUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.shortCode?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [links, searchTerm]);

    const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
    const paginatedLinks = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredLinks.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredLinks, currentPage, itemsPerPage]);


    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied:', text);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    const renderPaginationControls = () => {
        if (totalPages <= 1) return null;
        return (
            <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        );
    };


  return (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
             <h3 className="text-xl font-semibold text-gray-800">Your Links</h3>
             <div className="relative w-full sm:w-64">
                <input
                    type="text"
                    placeholder="Search links..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
        </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short URL</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">QR</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedLinks.length === 0 && (
                <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500">
                        {Array.isArray(links) && links.length > 0 ? 'No links match your search.' : 'No links created yet.'}
                    </td>
                </tr>
            )}
            {paginatedLinks.map((link) => (
              <tr key={link?._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap max-w-xs">
                  <a href={link?.originalUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 truncate block" title={link?.originalUrl}>
                    {link?.originalUrl}
                  </a>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                   <div className="flex items-center">
                    <a href={link?.shortUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-800 mr-2">
                        {link?.shortUrl?.replace(/^https?:\/\//, '')}
                    </a>
                     <button onClick={() => handleCopy(link?.shortUrl)} title="Copy Short URL" className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                   </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-center">{link?.totalClicks ?? 0}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {link?.createdAt ? format(new Date(link.createdAt), 'MMM d, yy') : 'N/A'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    link?.expirationStatus === 'Expired' ? 'bg-red-100 text-red-800' :
                    link?.expirationStatus === 'Active' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {link?.expirationStatus === 'Active' && link?.expiresAt ? format(new Date(link.expiresAt), 'MMM d, yy') : link?.expirationStatus ?? 'Never'}
                  </span>
                </td>
                 <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                    <button onClick={() => onShowQr(link?.shortUrl)} title="Show QR Code" className="text-blue-600 hover:text-blue-800 disabled:opacity-50" disabled={!link?.shortUrl}>
                        <QrCode className="h-5 w-5 mx-auto" />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {renderPaginationControls()}
       <p className="text-xs text-gray-500 mt-4 text-center">Note: Pagination and search are currently frontend-only demonstrations.</p>
    </div>
  );
};


export default AnalyticsTable;