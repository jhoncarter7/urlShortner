import {Loader2} from "lucide-react"

const LoadingSpinner = ({ size = 6 }) => (
    <Loader2 className={`animate-spin h-${size} w-${size} text-blue-600`} />
  );

  export default LoadingSpinner;