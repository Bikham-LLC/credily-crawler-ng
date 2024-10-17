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
    reRunDate:any;
    licenseNumber:string='';
}