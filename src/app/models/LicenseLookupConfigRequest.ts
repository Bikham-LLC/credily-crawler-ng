import { ConfigRequest } from "./ConfigRequest";

export class LicenseLookupConfigRequest{
    licenseLookUpLink : string = '';
    licenseLookUpName : string = '';
    userAccountUuid : string = '';
    taxonomyIdList : number[] = [];
    configRequests : ConfigRequest[] = [];
}