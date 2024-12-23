import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function alert(msg: any, type: "error" | "success") {
    toast[type](msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
}
