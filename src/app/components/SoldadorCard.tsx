import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import Soldador from "@/types/Soldador";

export default function SoldadorCard({ soldador }: { soldador: Soldador }) {
    if (!soldador) return null;

    return (
        <Card className="max-w-[400px] shadow-lg">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-md">{soldador.primerApellido} {soldador.segundoApellido} {soldador.primerNombre} </p>
                    <p className="text-small text-default-500">{soldador.idSoldador}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p>Make beautiful websites regardless of your design experience.</p>
            </CardBody>
            <Divider />
            <CardFooter>
                <Link
                    isExternal
                    showAnchorIcon
                    href="https://github.com/nextui-org/nextui"
                >
                    Visit source code on GitHub.
                </Link>
            </CardFooter>
        </Card>
    );
}