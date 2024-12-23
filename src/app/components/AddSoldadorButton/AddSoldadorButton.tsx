import { Button } from "@nextui-org/react";
import { AddSoldadorIcon } from "./AddSoldadorIcon";
import { FaUserPlus } from "react-icons/fa6";

export default function AddSoldadorButton({ onClick }: { onClick: () => void }) {
    return (
        <div className="flex gap-4 items-center">
            <Button
                isIconOnly
                radius="full"
                color="primary"
                aria-label="Add Soldador"
                className="text-white"
                onPress={onClick}
                disableRipple
            >
                <FaUserPlus className="size-5" />
            </Button>
        </div>
    );
}
