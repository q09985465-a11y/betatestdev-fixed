import { SignJWT, jwtVerify } from "jose";


const secret = new TextEncoder().encode(
    "TU_SECRET_SUPER_SEGURO"
);


export async function createToken(admin){

    return await new SignJWT({
        id: admin.id,
        username: admin.username
    })
    .setProtectedHeader({
        alg:"HS256"
    })
    .setExpirationTime("8h")
    .sign(secret);

}



export async function verifyToken(token){

    try{

        const {payload}=await jwtVerify(
            token,
            secret
        );

        return payload;

    }catch(e){

        return null;

    }

}