import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";
import { DataStack, ApiStack } from "../../../out/outputs.json";
import { SpaceEntry } from "../components/model/space";

const spacesUrl = ApiStack.SpacesApiEndpoint36C4F3B6 + "spaces";

export class DataService {
  private authService: AuthService;
  private s3Client: S3Client | undefined;
  private region = "us-west-1";

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public reserveSpace(spaceId: string): string {
    console.log(spaceId);
    return "123";
  }

  public async getSpaces(): Promise<SpaceEntry[]> {
    const method = "GET";
    const headers = new Headers();
    headers.append("Authorization", this.authService.getJwtToken() || "");
    const options: RequestInit = { method, headers };
    const getSpacesResult = await fetch(spacesUrl, options);
    const getSpacesResultJson: SpaceEntry[] = await getSpacesResult.json();
    return getSpacesResultJson;
  }

  public async createSpace(name: string, location: string, photo?: File) {
    // const credentials = await this.authService.getTemporaryCredentials();
    // console.log(credentials);
    const space = {} as SpaceEntry;
    space.name = name;
    space.location = location;
    if (photo) {
      const uploadUrl = await this.uploadPublicFile(photo);
      // console.log(uploadUrl);
      space.photoUrl = uploadUrl;
    }
    const method = "POST";
    const headers = new Headers();
    headers.append("Authorization", this.authService.getJwtToken() || "");
    const body = JSON.stringify(space);
    const options: RequestInit = { method, headers, body };
    const postResult = await fetch(spacesUrl, options);
    const postResultJson = (await postResult.json()) as { id: string };
    return postResultJson.id;
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
    return this.authService.isAuthorized();
  }
}
