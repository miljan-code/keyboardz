import { useAtom } from "jotai";

import { testModeModalAtom } from "@/lib/store";

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useAtom(testModeModalAtom);

  return { isModalOpen, setIsModalOpen };
};
