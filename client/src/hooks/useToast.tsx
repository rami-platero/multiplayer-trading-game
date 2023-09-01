import { toast } from "react-toastify";

const useToast = () => {
  const notifyError = (message: string) => {
    toast.error(message, {
      theme: "colored",
      position: "top-center",
      autoClose: false,
    });
  };

  const notifySuccess = (message: string) => {
    toast.success(message, {
      theme: "colored",
      position: "top-center",
      autoClose: false,
    });
  };
  return {notifyError,notifySuccess};
};

export default useToast;