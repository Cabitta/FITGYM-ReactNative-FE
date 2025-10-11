import { ofetch } from "ofetch";
import { getBaseURL } from "./axios";

export const fetcher = ofetch.create({
  baseURL: getBaseURL(),
});
