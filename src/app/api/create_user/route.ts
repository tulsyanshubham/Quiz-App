import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export async function POST(req: Request): Promise<Response> {
    await dbConnect();
    try {
        const { username, email, password, phone, gender, dob, occupation } = await req.json();
        const userExists = await UserModel.findOne({$or: [{username}, {email}]});
        if (userExists) {
            return Response.json({
                success: false,
                message: "User already exists",
            }, { status: 400 });
        }
        const user = new UserModel({ username, email, password, phone, gender, dob, occupation });
        await user.save();
        console.log(user);
        return Response.json({
            success: true,
            message: "User created successfully",
        }, { status: 200 });
    } catch (error) {
        console.error("An unexpected error occurred", error);
        return Response.json({
            success: false,
            message: "An unexpected error occurred",
        }, { status: 500 });
    }
}