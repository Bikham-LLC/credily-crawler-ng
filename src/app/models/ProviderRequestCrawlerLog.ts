export class ProviderRequestCrawlerLog{ 
    
    id:number=0;
    createdDate:any;
    updatedDate:any;
    snapShotUrl:string='';
    stateName:string='';
    status:number=0;
    lookupName:string='';
    lookupLink:string='';
    errorStatus:string='';
    crawlerStatus:string='';
    reTestingToggle:boolean=false;
    mapAgainLoadingToggle:boolean=true;
    reRunCount:number = 0;
    manualUploadCount:number = 0;
    reRunDate:any;
    licenseNumber:string='';
    licenseType:string='';
    verificationStatus:number=0;
    isRead:number=0;
    verificationLog:string='';
    docName:string='';
    docUrl:string='';
    attachmentId: number=0;
    updatedBy: string ='';
    isFlag: number = 1;
    deleteFlag: number = 0;
}