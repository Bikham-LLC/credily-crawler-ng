import { ConfigRequest } from "./ConfigRequest";

export class LicenseLookupConfigRequest{

    version : string = '';
    licenseLookUpLink : string = '';
    licenseLookUpName : string = '';
    userAccountUuid : string = '';
    taxonomyIdList : number[] = [];
    configRequests : ConfigRequest[] = [];
}