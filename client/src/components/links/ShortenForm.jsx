import { useDispatch, useSelector } from "react-redux";
import { clearShortenStatus, shortenUrl } from "../../store/slices/linksSlice";
import { useState } from "react";
import MessageBox from "../common/MessageBox";
import LoadingSpinner from "../common/LoadingSpinner";
import { Link2 } from "lucide-react";


const ShortenForm = () => {

    const [longUrl, setLongUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const dispatch = useDispatch();
    const { shortenLoading, shortenError, shortenSuccess } = useSelector((state) => state.links);
    const { isAuthenticated } = useSelector((state) => state.auth);
  
  
    const handleSubmit = (e) => {
      e.preventDefault();
       if (!isAuthenticated) {
          console.error("User not authenticated");
          return;
      }
      dispatch(clearShortenStatus());
      const data = { longUrl };
      if (customAlias) data.customAlias = customAlias;
      if (expirationDate) data.expirationDate = new Date(expirationDate).toISOString();
  
      dispatch(shortenUrl(data))
          .unwrap()
          .then(() => {
              setLongUrl('');
              setCustomAlias('');
              setExpirationDate('');
          })
          .catch((err) => {
              console.error("Shorten URL failed:", err);
          });
    };
  
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Create Short Link</h3>
         <MessageBox message={shortenError} type="error" onDismiss={() => dispatch(clearShortenStatus())} />
         <MessageBox message={shortenSuccess} type="success" onDismiss={() => dispatch(clearShortenStatus())} />
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-1">Original URL *</label>
            <input
              type="url"
              id="longUrl"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
              placeholder="https://example.com/very/long/url/to/shorten"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 mb-1">Custom Alias (Optional)</label>
              <input
                type="text"
                id="customAlias"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-custom-link"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (Optional)</label>
              <input
                type="datetime-local"
                id="expirationDate"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={shortenLoading || !isAuthenticated}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center disabled:opacity-50"
          >
            {shortenLoading ? <LoadingSpinner size={5} /> : <><Link2 className="mr-2 h-4 w-4" /> Shorten</>}
          </button>
        </form>
      </div>
    );
  };

  export default ShortenForm
  