import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";




//individual billboard get 
export async function GET(req: Request, { params }: { params: { categoryId: string } }) {

    try {

        if (!params.categoryId) {
            return new NextResponse("categoryId is required", { status: 400 });
        }



        const category = await prismadb.billboard.findUnique({
            where: {
                id: params.categoryId
            },
        })

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}






//individual billboard update
export async function PATCH(req: Request, { params }: { params: { categoryId: string, storeId: string } }) {

    try {

        const { userId } = auth();
        const body = await req.json();
        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!billboardId) {
            return new NextResponse("BillboardId is required", { status: 400 });
        }


        if (!params.categoryId) {
            return new NextResponse("category id is required", { status: 400 });
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

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId
            },
            data: {
                name,
                billboardId
            }
        })

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}



//individual billboard delete
export async function DELETE(req: Request, { params }: { params: { categoryId: string, storeId: string } }) {

    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.categoryId) {
            return new NextResponse("category id is required", { status: 400 });
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


        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId
            },
        })

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}




