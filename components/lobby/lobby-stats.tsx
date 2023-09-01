"use client";

export const LobbyStats = () => {
  return (
    <div className="flex gap-3 text-foreground/60 max-md:text-sm">
      <p>
        Users online: <span className="text-foreground">14</span>
      </p>
      <p>
        Active tests: <span className="text-foreground">2</span>
      </p>
    </div>
  );
};
