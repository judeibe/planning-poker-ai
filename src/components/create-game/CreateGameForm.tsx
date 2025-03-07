'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { RecentSession } from './RecentSessions';
import type { NewGameResponse } from '@/app/api/games/route';
import { createGame } from '@/app/actions';
import { useFormState } from 'react-dom';


export function CreateGameForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { formState } = useFormState<{ status: string, message: string}, object>(createGame, null);
  const form = useForm()

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      if (response.ok) {
        const newGame = await response.json() as NewGameResponse;
        form.reset();
        
        // Add to session history in localStorage
        const recentSessions = JSON.parse(localStorage.getItem('recentSessions') || '[]') as RecentSession[];
        
        // Add session to history if not already present
        if (!recentSessions.some((session) => session.id === newGame.id)) {
          recentSessions.unshift({
            id: newGame.id,
            joinedAt: new Date().toISOString()
          });
          
          // Keep only the 5 most recent sessions
          if (recentSessions.length > 5) {
            recentSessions.pop();
          }
          
          localStorage.setItem('recentSessions', JSON.stringify(recentSessions));
        }
        
        router.push(`/games/${newGame.id}`);
      } else {
        const errorData = await response.json();
        console.error('Error creating game:', errorData);
      }
    } catch (error) {
      console.error('Error creating game:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form action={createGame} className="space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Game'}
        </Button>
      </form>
    </Form>
  );
}