"use client";

import { useModal } from "@/hooks/use-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";

import { testModeAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";
import { testModeFormSchema } from "@/lib/validations/test-mode-schema";
import { leaderboardCategories } from "@/config/leaderboard";
import { Icons } from "@/components/icons";
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

import type { TestMode } from "@/types/test";

export const TypingModeDialog = () => {
  const [testMode, setTestMode] = useAtom(testModeAtom);

  const form = useForm<TestMode>({
    resolver: zodResolver(testModeFormSchema),
    defaultValues: {
      mode: testMode.mode,
      amount: testMode.amount,
    },
  });

  const mode = form.watch("mode");
  const formAmount = form.watch("amount");

  const [activeMode] = leaderboardCategories.filter(
    (amount) => amount.mode === mode,
  );

  const { isModalOpen, setIsModalOpen } = useModal();

  const onSubmit = (values: TestMode) => {
    setIsModalOpen(false);
    setTestMode(values);
  };

  const handleAmountChange = (amount: number) => {
    form.setValue("amount", amount);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Dialog
        open={isModalOpen}
        onOpenChange={(isOpen) => setIsModalOpen(isOpen)}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative before:absolute before:left-0 before:top-0 before:h-[1px] before:w-full before:bg-card-gradient after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-card-gradient"
          >
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
                      <Input type="number" {...field} />
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
