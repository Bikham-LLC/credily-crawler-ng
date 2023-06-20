import { ConfigRequest } from "./ConfigRequest";

export class LicenseLookupConfigRequest{

    version : string = '';
    providerUuid:string = '';
    licenseLookUpLink : string = '';
    licenseLookUpName : string = '';
    userAccountUuid : string = '';
    taxonomyIdList : number[] = [];
    configRequests : ConfigRequest[] = [];
}