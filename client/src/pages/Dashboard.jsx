import { useEffect, useState } from "react";
import { logoutUser } from "../store/slices/authSlice";
import { clearLinks, fetchLinks } from "../store/slices/linksSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link2, LogOut, BarChart3, Smartphone } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner"
import MessageBox from "../components/common/MessageBox"
import QRCodeModal from "../components/common/QRCodeModal"
import ShortenForm from "../components/links/ShortenForm";
import DeviceChart from "../components/analytics/DeviceChart";
import ClicksChart from "../components/analytics/ClicksChart.JSX";
import AnalyticsTable from "../components/analytics/AnalyticsTable";

const Dashboard = () => {

    const dispatch = useDispatch();
    const { items: links, loading, error } = useSelector((state) => state.links);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
  
    useEffect(() => {
      if (isAuthenticated) {
          dispatch(fetchLinks());
      } else {
          dispatch(clearLinks());
      }
    }, [dispatch, isAuthenticated]);
  
    const handleLogout = () => {
      dispatch(logoutUser());
    };
  
    const handleShowQr = (url) => {
        setQrCodeUrl(url);
    };
  
    const handleCloseQr = () => {
        setQrCodeUrl(null);
    };
  
    return (
      <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                      <div className="flex items-center">
                           <Link2 className="h-6 w-6 text-blue-600 mr-2" />
                          <span className="font-bold text-xl text-gray-800">URL Shortener</span>
                      </div>
                      <div className="flex items-center">
                          <button
                              onClick={handleLogout}
                              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md text-sm flex items-center"
                          >
                              <LogOut className="mr-1 h-4 w-4" /> Logout
                          </button>
                      </div>
                  </div>
              </div>
          </nav>
  
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <ShortenForm />
  
            <div className="bg-white p-6 rounded-lg shadow mb-8">
               <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-blue-600"/> Clicks Over Time</h3>
               {loading && <div className="flex justify-center p-8"><LoadingSpinner size={8}/></div>}
               <MessageBox message={error} type="error" />
               {!loading && !error && <ClicksChart links={links} />}
            </div>
  
             <div className="bg-white p-6 rounded-lg shadow mb-8">
               <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><Smartphone className="mr-2 h-5 w-5 text-green-600"/> Device Analytics</h3>
               {loading && <div className="flex justify-center p-8"><LoadingSpinner size={8}/></div>}
               <MessageBox message={error} type="error" />
               {!loading && !error && <DeviceChart links={links} />}
            </div>
  
            {loading && (!Array.isArray(links) || links.length === 0) && <div className="flex justify-center p-8"><LoadingSpinner size={10}/></div>}
            <MessageBox message={error && (!Array.isArray(links) || links.length === 0) ? error : null} type="error" />
            {!loading && <AnalyticsTable links={links} onShowQr={handleShowQr} />}
          </div>
        </main>
        <QRCodeModal url={qrCodeUrl} onClose={handleCloseQr} />
      </div>
    );
  }

  export default Dashboard;