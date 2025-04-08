import { AlertCircle, CheckCircle, X } from "lucide-react";



const MessageBox = ({ message, type = 'error', onDismiss }) => {
    if (!message) return null;
    const isError = type === 'error';
    return (
      <div className={`p-3 rounded-md flex items-center justify-between ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        <div className="flex items-center">
          {isError ? <AlertCircle className="h-5 w-5 mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
          <span>{message}</span>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="ml-4 p-1 rounded-full hover:bg-opacity-20 hover:bg-current">
              <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  export default MessageBox;