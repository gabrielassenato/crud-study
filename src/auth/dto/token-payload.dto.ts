export class TokenPayloadDto {
    sub: number; //user id
    email: string;
    iat: number; //issued at
    exp: number; //expiration time
    aud: string; //audience
    iss: string; //issuer
}