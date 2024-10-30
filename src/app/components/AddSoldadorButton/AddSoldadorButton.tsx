import { Button } from "@nextui-org/react";
import { AddSoldadorIcon } from "./AddSoldadorIcon";

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
            >
                <AddSoldadorIcon />
            </Button>
        </div>
    );
}
