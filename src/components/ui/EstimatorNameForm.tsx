"use client";

import React, { useState } from 'react';
import { Input } from './input';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "./button";
import { Label } from "./label";

const EstimatorNameForm = ({ onNameSubmit }: { onNameSubmit: (name: string) => void }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('estimatorName', name);
      onNameSubmit(name);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Join Planning Poker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Enter your name:</Label>
            <Input
              type="text"
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full">Join Game</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EstimatorNameForm;