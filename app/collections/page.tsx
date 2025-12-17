import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function Collections() {
    const products = await prisma.product.findMany();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto py-24 px-4">
                <h1 className="text-4xl font-serif text-center mb-4">Our Collections</h1>
                <div className="w-24 h-1 bg-primary mx-auto mb-12" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map(product => {
                        let images = [];
                        try {
                            images = JSON.parse(product.images as string);
                        } catch (e) {
                            images = [product.images];
                        }

                        return (
                            <Card key={product.id} className="overflow-hidden border-none shadow-lg group">
                                <div className="h-80 overflow-hidden relative bg-secondary/20">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                </div>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl font-serif">{product.name}</CardTitle>
                                    <p className="text-sm uppercase tracking-widest text-muted-foreground">{product.category}</p>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-muted-foreground line-clamp-2 px-4">{product.description}</p>
                                    <p className="text-xl font-bold mt-4 text-primary font-serif">${product.price.toFixed(2)} <span className="text-xs font-sans text-muted-foreground font-normal">/ unit</span></p>
                                </CardContent>
                                <CardFooter className="pb-8">
                                    <Link href={`/product/${product.id}`} className="w-full">
                                        <Button className="w-full h-12 text-lg font-light tracking-wide rounded-none" variant="default">Select Design</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
