import { X } from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react';


const QRCodeModal = ({ url, onClose }) => {
    if (!url) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center relative">
                 <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200"
                    aria-label="Close QR Code Modal"
                >
                    <X className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-medium mb-4">QR Code</h3>
                <div className="mb-4 flex justify-center">
                    <QRCodeCanvas value={url} size={192} />
                </div>
                <p className="text-sm text-gray-600 break-all">{url}</p>
            </div>
        </div>
    );
};

export default QRCodeModal;