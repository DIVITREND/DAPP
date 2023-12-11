import { AlertStatus } from "@chakra-ui/react";
import { ILink } from "./ILink";

export interface IToast {
  toastId?: string;
  toastStatus?: AlertStatus;
  toastTitle?: string;
  toastDescription?: string;
  toastLink?: ILink;
}
