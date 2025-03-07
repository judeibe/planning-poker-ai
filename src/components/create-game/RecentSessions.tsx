'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface RecentSession {
  id: string;
  joinedAt: string;
}

export function RecentSessions() {
  const router = useRouter();
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  
  useEffect(() => {
    // Load recent sessions from localStorage
    try {
      const savedSessions = localStorage.getItem('recentSessions');
      if (savedSessions) {
        setRecentSessions(JSON.parse(savedSessions));
      }
    } catch (error) {
      console.error('Error loading recent sessions:', error);
    }
  }, []);
  
  const handleJoinSession = (sessionId: string) => {
    router.push(`/games/${sessionId}`);
  };
  
  const handleClearHistory = () => {
    localStorage.removeItem('recentSessions');
    setRecentSessions([]);
  };
  
  if (recentSessions.length === 0) {
    return null;
  }
  
  return (
    <Card className="w-full mt-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Recent Sessions</CardTitle>
          <CardDescription>Sessions you've recently joined</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleClearHistory}>
          Clear History
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {recentSessions.map((session) => (
            <div 
              key={session.id} 
              className="py-3 flex items-center justify-between cursor-pointer hover:bg-muted/50 px-2 rounded"
              onClick={() => handleJoinSession(session.id)}
            >
              <div>
                <p className="font-medium">Session {session.id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(session.joinedAt).toLocaleString()}
                </p>
              </div>
              <Button size="sm" variant="ghost">Join</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}