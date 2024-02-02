import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";




export async function POST(req: Request, { params }: { params: { storeId: string } }) {

    console.log("passed");


    try {

        const { userId } = auth();
        const body = await req.json();
        const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }
        if (!categoryId) {
            return new NextResponse("CategoryId is required", { status: 400 });
        }
        if (!colorId) {
            return new NextResponse("ColorId is required", { status: 400 });
        }
        if (!sizeId) {
            return new NextResponse("SizeId is required", { status: 400 });
        }
        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }


        if (!params.storeId) {
            return new NextResponse("storeId is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isArchived,
                isFeatured,
                categoryId,
                colorId,
                sizeId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: String }) => image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}




export async function GET(req: Request, { params }: { params: { storeId: string } }) {

    try {

        const { searchParams } = new URL(req.url);

        const categoryId = searchParams.get("categoryId") || undefined
        console.log(categoryId);
        
        const colorId = searchParams.get("colorId") || undefined
        console.log(colorId);
        const sizeId = searchParams.get("sizeId") || undefined
        console.log(sizeId);
        const isFeatured = searchParams.get("isFeatured")
        console.log(isFeatured);

        const products = await prismadb.product.findMany({
   
            where: {
                storeId:params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived :false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: "desc"
            },


        })

        console.log(products);
        

        return NextResponse.json(products);

    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}
