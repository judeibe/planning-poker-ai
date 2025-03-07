"use client";

import { useState, useEffect } from 'react';
import EstimatorNameForm from '@/components/ui/EstimatorNameForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define the Game interface matching the database structure
interface Game {
  id: string;
  name: string;
  description: string | null;
}

export default function GameSessionPage({ params }: { params: { id: string } }) {
  const [name, setName] = useState<string | null>(null);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load the user's name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('estimatorName');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  // Fetch the game data
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/games/${params.id}`);
        if (!response.ok) {
          throw new Error('Game not found');
        }
        const data = await response.json();
        setGameData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game:', error);
        setError('Unable to load game. It may not exist or has been removed.');
        setLoading(false);
      }
    };

    fetchGame();
  }, [params.id]);

  const handleNameSubmit = (name: string) => {
    setName(name);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p>Loading game session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {!name ? (
        <EstimatorNameForm onNameSubmit={handleNameSubmit} />
      ) : (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{gameData?.name || 'Game Session'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-muted-foreground">{gameData?.description || 'No description provided'}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Players</h2>
              <div className="flex flex-wrap gap-2">
                <div className="bg-primary/10 px-3 py-1 rounded-full text-sm">
                  {name} (You)
                </div>
                {/* Other players would be added here dynamically */}
              </div>
            </div>
            
            {/* Game interface would go here */}
            <p className="text-center text-muted-foreground my-8">
              Share this link with others to join this planning poker session:
            </p>
            <div className="bg-muted p-2 rounded flex items-center justify-between">
              <code className="text-sm truncate">
                {typeof window !== 'undefined' ? window.location.href : ''}
              </code>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                variant="outline"
                size="sm"
              >
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}