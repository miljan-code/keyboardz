"use client";

import { useModal } from "@/hooks/use-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { testModeFormSchema } from "@/lib/validations/test-mode-schema";
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
import { Icons } from "../icons";

import type { TestMode } from "@/types/test";

interface TypingModeDialogProps {
  testMode: TestMode;
  // eslint-disable-next-line
  handleModeChange: (mode: TestMode) => void;
}

export const TypingModeDialog = ({
  testMode,
  handleModeChange,
}: TypingModeDialogProps) => {
  const form = useForm<TestMode>({
    resolver: zodResolver(testModeFormSchema),
    defaultValues: {
      mode: "timer",
      amount: 60,
    },
  });

  const mode = form.watch("mode");

  const { isModalOpen, setIsModalOpen } = useModal();

  const onSubmit = (values: TestMode) => {
    setIsModalOpen(false);
    handleModeChange(values);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Dialog
        open={isModalOpen}
        onOpenChange={(isOpen) => setIsModalOpen(isOpen)}
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Typing Mode
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Typing Mode</DialogTitle>
            <DialogDescription>
              Change test mode to your preference.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="mode"
                render={() => (
                  <FormItem>
                    <FormLabel>Test type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue={testMode.mode}
                        onValueChange={(e) =>
                          form.setValue("mode", e as TestMode["mode"])
                        }
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
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        {...form.register("amount", { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormDescription>
                      Amount of {mode === "timer" ? "seconds" : "words"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button size="sm" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="flex items-center gap-2 text-sm text-primary">
        <div className="flex items-center gap-1">
          {testMode.mode === "timer" ? (
            <Icons.timer size={14} />
          ) : (
            <Icons.words size={14} />
          )}
          {testMode.mode}
        </div>
        <span>&mdash;</span>
        <span>{testMode.amount}</span>
      </div>
    </div>
  );
};
