import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";




//individual billboard get 
export async function GET(req: Request, { params }: { params: { colorId: string } }) {

    try {

        if (!params.colorId) {
            return new NextResponse("SizeId is required", { status: 400 });
        }



        const color = await prismadb.colors.findUnique({
            where: {
                id: params.colorId
            },
        })

        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR_GET]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}






//individual billboard update
export async function PATCH(req: Request, { params }: { params: { colorId: string, storeId: string } }) {

    try {

        const { userId } = auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!value) {
            return new NextResponse("Image Url is required", { status: 400 });
        }


        if (!params.colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const color = await prismadb.colors.updateMany({
            where: {
                id: params.colorId
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR_PATCH]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}



//individual billboard delete
export async function DELETE(req: Request, { params }: { params: { colorId: string, storeId: string } }) {

    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.colorId) {
            return new NextResponse("Color Id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }


        const color = await prismadb.colors.deleteMany({
            where: {
                id: params.colorId
            },
        })

        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}




