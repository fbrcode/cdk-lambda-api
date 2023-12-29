import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";
import { DataStack } from "../../../out/outputs.json";

export class DataService {
  private authService: AuthService;
  private s3Client: S3Client | undefined;
  private region = "us-west-1";

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async createSpace(name: string, location: string, photo?: File) {
    console.log(name, location);
    const credentials = await this.authService.getTemporaryCredentials();
    console.log(credentials);
    if (photo) {
      const uploadUrl = await this.uploadPublicFile(photo);
      console.log(uploadUrl);
    }
    return "123";
  }

  private async uploadPublicFile(file: File): Promise<string | undefined> {
    const credentials = await this.authService.getTemporaryCredentials();
    if (!this.s3Client) {
      this.s3Client = new S3Client({ credentials, region: this.region });
    }
    const command = new PutObjectCommand({
      Bucket: DataStack.SpaceUiPhotosBucketName,
      Key: file.name,
      ACL: "public-read",
      Body: file,
    });
    try {
      await this.s3Client.send(command);
      return `https://${command.input.Bucket}.s3.${this.region}.amazonaws.com/${command.input.Key}`;
    } catch (error) {
      console.log(error);
    }
  }

  public isAuthorized() {
    return true;
  }
}
