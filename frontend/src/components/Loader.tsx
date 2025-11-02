import { Loader2 } from "lucide-react";

interface LoaderProps {
  message?: string;
}

const Loader = ({ message = "Loading..." }: LoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default Loader;
