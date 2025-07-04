import { Spinner } from "./spinner";

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage = ({ message = "Cargando..." }: LoadingPageProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};