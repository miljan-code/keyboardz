"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { socket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { createRoomSchema } from "@/lib/validations/create-room-schema";
import type { Room } from "@/db/schema";
import { leaderboardCategories } from "@/config/leaderboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

import type { TestMode } from "@/types/test";

type CreateRoomFields = z.infer<typeof createRoomSchema>;

interface CreateRoomProps {
  session: Session;
}

export const CreateRoom = ({ session }: CreateRoomProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateRoomFields>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      roomName: "",
      mode: "timer",
      amount: 60,
      isPublic: true,
      maxUsers: 4,
      minWpm: 0,
    },
  });

  const mode = form.watch("mode");
  const formAmount = form.watch("amount");
  const isChecked = form.watch("isPublic");

  const [activeMode] = leaderboardCategories.filter(
    (amount) => amount.mode === mode,
  );

  const { toast } = useToast();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (values: CreateRoomFields) => {
      const res = await fetch("/api/socket/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      return await res.json();
    },
    onSuccess: (room: Room) => {
      setIsOpen(false);
      socket.emit("userJoinRoom", {
        userId: session.user.id,
        roomId: room.id,
      });
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Room is not created, please try again.",
      });
    },
  });

  const onSubmit = (values: CreateRoomFields) => mutate(values);

  const handleAmountChange = (amount: number) => {
    form.setValue("amount", amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button size="sm">Create a room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new room</DialogTitle>
          <DialogDescription>
            Choose test options and play with others.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="roomName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mode"
              render={() => (
                <FormItem>
                  <FormLabel>Test type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue="timer"
                      onValueChange={(e) =>
                        form.setValue("mode", e as TestMode["mode"])
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="timer" id="timer" />
                        <Label htmlFor="timer">Timer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="words" id="words" />
                        <Label htmlFor="words">Word count</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-0.5 overflow-hidden rounded-md border bg-muted">
              {activeMode.amounts.map((amount) => (
                <div
                  key={amount}
                  onClick={() => handleAmountChange(amount)}
                  className={cn(
                    "flex-1 cursor-pointer bg-background py-1 text-center text-sm transition-colors hover:bg-primary hover:text-background",
                    {
                      "bg-primary text-background": amount === formAmount,
                    },
                  )}
                >
                  {amount}
                </div>
              ))}
            </div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" min={10} {...field} />
                  </FormControl>
                  <FormDescription>
                    Amount of {mode === "timer" ? "seconds" : "words"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxUsers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max users</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={2} max={8} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxUsers"
              render={() => (
                <FormItem className="flex items-end justify-between">
                  <FormLabel>Public room</FormLabel>
                  <FormControl>
                    <Switch
                      checked={isChecked}
                      onCheckedChange={(value) =>
                        form.setValue("isPublic", value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minWpm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum WPM to join</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Close
              </Button>
              <Button size="sm" disabled={isLoading}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
