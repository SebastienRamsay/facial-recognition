import toast from "react-hot-toast";

export const checkName = (name: string | undefined, facesLength: number) => {
  if (facesLength < 1) {
    toast.error("I can't see your beautiful face");
    return false;
  }

  if (facesLength > 1) {
    toast.error("too many faces at once");
    return false;
  }

  if (!name) {
    toast.error("Name required");
    return false;
  }
  if (name.length < 2) {
    toast.error("Name must be more than 1 character");
    return false;
  }
  if (name.length > 15) {
    toast.error("Name must be less than 15 characters");
    return false;
  }
  return true;
};
