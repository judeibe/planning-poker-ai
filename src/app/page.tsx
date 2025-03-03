import { CreateGameForm } from "@/components/create-game/CreateGameForm";
import { GameFormCard } from "@/components/create-game/GameFormCard";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <GameFormCard>
        <CreateGameForm />
      </GameFormCard>
    </div>
  );
}
