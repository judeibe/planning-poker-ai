'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
});

type FormData = z.infer<typeof formSchema>;

export function JoinSessionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionId: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setJoinError(null);
    
    try {
      // Check if the session exists
      const response = await fetch(`/api/games/${data.sessionId}`);
      
      if (response.ok) {
        // Add to session history in localStorage
        const recentSessions = JSON.parse(localStorage.getItem('recentSessions') || '[]');
        const gameData = await response.json();
        
        // Add session to history if not already present
        if (!recentSessions.some((session: any) => session.id === data.sessionId)) {
          recentSessions.unshift({
            id: data.sessionId,
            name: gameData.name,
            joinedAt: new Date().toISOString()
          });
          
          // Keep only the 5 most recent sessions
          if (recentSessions.length > 5) {
            recentSessions.pop();
          }
          
          localStorage.setItem('recentSessions', JSON.stringify(recentSessions));
        }
        
        // Navigate to the game session
        router.push(`/games/${data.sessionId}`);
      } else {
        setJoinError('Session not found. Please check the ID and try again.');
      }
    } catch (error) {
      console.error('Error joining session:', error);
      setJoinError('An error occurred while joining the session.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="sessionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter session ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {joinError && (
          <div className="text-sm font-medium text-destructive">
            {joinError}
          </div>
        )}
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Joining...' : 'Join Session'}
        </Button>
      </form>
    </Form>
  );
}