import { SocketProvider } from "@/components/socket-provider";

interface LobbyLayoutProps {
  children: React.ReactNode;
}

export default function LobbyLayout({ children }: LobbyLayoutProps) {
  return (
    <section className="space-y-6 px-8">
      <SocketProvider>{children}</SocketProvider>
    </section>
  );
}
