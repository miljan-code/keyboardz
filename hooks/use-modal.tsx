import { atom, useAtom } from "jotai";

const modalAtom = atom(false);

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useAtom(modalAtom);

  return { isModalOpen, setIsModalOpen };
};
