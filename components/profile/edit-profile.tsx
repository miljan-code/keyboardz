"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { editProfileFormSchema } from "@/lib/validations/edit-profile-schema";
import { User } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface EditProfileProps {
  user: User;
}

export const EditProfile = ({ user }: EditProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof editProfileFormSchema>>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      bio: user.bio || "",
      github: user.github || "",
      keyboard: user.keyboard || "",
      website: user.website || "",
      x: user.x || "",
    },
  });

  const { toast } = useToast();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (values: z.infer<typeof editProfileFormSchema>) => {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      return await res.json();
    },
    onSuccess: () => {
      setIsOpen(false);
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Your profile is not updated, please try again.",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Tell us something about yourself
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="keyboard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keyboard</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">https://github.com/</span>
                    <FormControl>
                      <Input {...field} placeholder="username" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="x"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X</FormLabel>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">https://twitter.com/</span>
                    <FormControl>
                      <Input {...field} placeholder="username" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="max-sm:flex max-sm:gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          {/* FIXME: Temp, https://github.com/shadcn-ui/ui/issues/709 */}
          <Button
            disabled={isLoading}
            size="sm"
            onClick={() => mutate(form.getValues())}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
