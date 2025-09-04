// esse é o contrato que define os métodos que uma classe de hashing deve implementar
export abstract class HashingService {
  //vai receber uma senha e retornar uma senha hasheada
  abstract hash(password: string): Promise<string>;

  //vai receber uma senha e uma senha hasheada e retornar true ou false
  abstract compare(password: string, hashedPassword: string): Promise<boolean>;
}
