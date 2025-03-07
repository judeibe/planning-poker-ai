import { CreateGameForm } from '@/components/create-game/CreateGameForm';
import { JoinSessionForm } from '@/components/create-game/JoinSessionForm';
import { RecentSessions } from '@/components/create-game/RecentSessions';
import { GameFormCard } from '@/components/create-game/GameFormCard';

export default function Home() {  
  
  return (
    <div className="min-h-screen p-8">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Pointing Poker</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GameFormCard title="Create New Session">
              <CreateGameForm />
            </GameFormCard>
            
            <GameFormCard title="Join Existing Session">
              <JoinSessionForm />
            </GameFormCard>
          </div>
          
          <RecentSessions />
        </div>
    </div>
  );
}
