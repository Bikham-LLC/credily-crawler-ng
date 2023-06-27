import { ConfigRequest } from "./ConfigRequest";

export class LicenseLookupConfigRequest{
    lookupConfigId:number=0;
    version : string = '';
    licenseLookUpLink : string = '';
    licenseLookUpName : string = '';
    userAccountUuid : string = '';
    testingProviderUuid:any;
    configStatus:string='';
    taxonomyIdList : number[] = [];
    configRequests : ConfigRequest[] = [];
}