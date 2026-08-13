'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Flame, Star, MessageSquare, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

interface MockFriend {
  id: number;
  name: string;
  username: string;
  avatar: string;
  xp: number;
  streak: number;
  isFriend: boolean;
}

export const FriendsList: React.FC = () => {
  const [friends, setFriends] = useState<MockFriend[]>([
    { id: 1, name: 'Sofia Rodriguez', username: 'sofia', avatar: 'S', xp: 820, streak: 12, isFriend: true },
    { id: 2, name: 'Daniel Kim', username: 'daniel', avatar: 'D', xp: 710, streak: 8, isFriend: true },
    { id: 3, name: 'Mateo Rossi', username: 'mateo', avatar: 'M', xp: 550, streak: 5, isFriend: false },
    { id: 4, name: 'Emma Watson', username: 'emma', avatar: 'E', xp: 490, streak: 4, isFriend: false },
  ]);

  const toggleFriend = (id: number) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFriend: !f.isFriend } : f))
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#1CB0F6]" />
          <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
            Friends & Social
          </h3>
        </div>
        <span className="text-xs font-mono font-extrabold text-zinc-400">
          {friends.filter((f) => f.isFriend).length} Friends
        </span>
      </div>

      {/* Friends Cards List */}
      <div className="space-y-3">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/60 dark:border-zinc-800"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1CB0F6] to-sky-300 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
                {friend.avatar}
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white truncate">
                  {friend.name}
                </h4>
                <p className="text-xs text-zinc-400 font-semibold truncate">@{friend.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold">
                <span className="flex items-center gap-1 text-orange-500 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-lg border border-orange-200 dark:border-orange-900/50">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  {friend.streak}d
                </span>
                <span className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {friend.xp}
                </span>
              </div>

              <Button
                variant={friend.isFriend ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => toggleFriend(friend.id)}
              >
                {friend.isFriend ? (
                  <span>Following</span>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5 mr-1" />
                    <span>Add</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Social Features Coming Soon Card */}
      <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#1CB0F6] tracking-wider">
            <Clock className="w-3 h-3" />
            <span>Social Features Coming Soon</span>
          </div>
          <p className="text-xs font-bold text-zinc-700 dark:text-sky-200">
            Direct Messaging, Friend Challenges, and Real-Time Quest Activity will be added in a future update!
          </p>
        </div>
      </div>
    </div>
  );
};
