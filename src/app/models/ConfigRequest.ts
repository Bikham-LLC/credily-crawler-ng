import { SubAttributeMap } from "./SubAttributeMap";

export class ConfigRequest{
    crawlerAttributeId : number = 0;
    crawlerAttribute : string = '';
    lookUpElementDesc : string = '';
    elementEvent : string = '';
    className : string = '';
    columnName : string = '';
    pattern : string='';
    dataSourcePath:string='';
    actionButton:string='';
    licenseLookupAttrMapId:number = 0;
    commentStepToggle:boolean = false;
    commentUpdatingToggle:boolean = false;
    isStepCommented:number=0;
    isStepUpdted:boolean = false;
    subAttributeMapList: SubAttributeMap[] = new Array();
}