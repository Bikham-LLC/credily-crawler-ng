import { ConfigRequest } from "./ConfigRequest";
import { RemoveStepRequest } from "./RemoveStepRequest";
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
    attachmentSubTypeDescription:string='';
    taxonomyIdList : number[] = [];
    configRequests : ConfigRequest[] = [];
    removeStepList : RemoveStepRequest[] = [];
    planId : string='';
    rpaEndPoint:string='';

    lookupNames:string[] = [];
    removeIds:number[] = [];
    mappedIds:number[] = [];
    removeAll:string='no';
    attactmentSource:string='';
    ticketType:string='';
    queueId:string='';

    isHighPriority: number = 0;
    highPriorityType: string = '';
    highPriorityDate: any;
}