import { Type } from "class-transformer";
import { IsArray, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from "class-validator-custom-errors";

export enum HttpProtocols {
  http = "http",
  https = "https",
  ws = "ws",
  wss = "wss",
  ftp = "ftp"
}

export class Query {
  @IsString()
  search!: string

  @IsArray()
  @IsOptional()
  @ValidateNested()
  select: string[] = []
}

export class Url {
  @IsString({
    transformKey: 'uniqueString'
  })
  host!: string

  @IsEnum(HttpProtocols)
  protocol!: string

  @IsString()
  tld!: string

  @IsObject()
  @ValidateNested()
  @Type(() => Query)
  query!: Query
}