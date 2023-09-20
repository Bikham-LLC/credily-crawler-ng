import { ConfigRequest } from "./ConfigRequest";
import { SubAttributeMap } from "./SubAttributeMap";

export class LicenseLookupConfigRequest{
    type:string = '';
    lookupConfigId:number=0;
    version : string = '';
    licenseLookUpLink : string = '';
    licenseLookUpName : string = '';
    userAccountUuid : string = '';
    testingProviderUuid:any;
    configStatus:string='';
    lastTestedOn:any;
    screenShotUrl:any;
    configReportStatus:any;
    attachmentType:string='';
    attachmentSubType:string='';
    taxonomyIdList : number[] = [];
    configRequests : ConfigRequest[] = [];

    lookupNames:string[] = [];
    removeIds:number[] = [];
    mappedIds:number[] = [];
}